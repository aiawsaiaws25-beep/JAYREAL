"use server";

import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { leads, projects, properties } from "@/db/schema";
import { leadSchema, type LeadInput } from "@/lib/validations";
import { scoreLead } from "@/lib/scoring";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

const THANK_YOU_MESSAGE = "Thank you. A Jay Real Estate advisor will contact you within 24 hours.";

export type LeadActionState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | { status: "error"; message: string; fieldErrors?: Record<string, string> };

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;

/**
 * Captures a lead from any public form.
 * Validates with the shared zod schema, rate limits by IP (5 per 10 minutes),
 * silently drops honeypot hits, scores the lead and saves it.
 */
export async function submitLead(input: LeadInput): Promise<LeadActionState> {
  const parsed = leadSchema.safeParse(input);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    // Honeypot filled in: pretend success so bots learn nothing.
    if (fieldErrors.website) return { status: "success", message: THANK_YOU_MESSAGE };
    return { status: "error", message: "Please check the highlighted fields.", fieldErrors };
  }

  const ip = await getClientIp();
  const limit = rateLimit(`lead:${ip}`, RATE_LIMIT, RATE_WINDOW_MS);
  if (!limit.ok) {
    const mins = Math.ceil(limit.retryAfterSeconds / 60);
    return { status: "error", message: `Too many submissions. Please try again in ${mins} minute${mins === 1 ? "" : "s"}.` };
  }

  const v = parsed.data;
  const db = await getDb();

  // Resolve linked listing for expected value, and drop ids that do not exist.
  let propertyId: number | null = v.propertyId ?? null;
  let projectId: number | null = v.projectId ?? null;
  let expectedValueAed: number | null = null;

  if (propertyId) {
    const property = await db.query.properties.findFirst({
      where: eq(properties.id, propertyId),
      columns: { id: true, priceAed: true, projectId: true },
    });
    if (property) {
      expectedValueAed = property.priceAed;
      projectId ??= property.projectId;
    } else {
      propertyId = null;
    }
  }
  if (projectId) {
    const project = await db.query.projects.findFirst({ where: eq(projects.id, projectId), columns: { id: true } });
    if (!project) projectId = null;
  }
  if (!expectedValueAed && v.budgetMax) expectedValueAed = v.budgetMax;

  // Fold form-specific context into the message so nothing is lost.
  const context: string[] = [];
  if (v.preferredDate) context.push(`Preferred date: ${v.preferredDate}`);
  if (v.preferredTime) context.push(`Preferred time: ${v.preferredTime}`);
  if (v.propertyType) context.push(`Property type: ${v.propertyType}`);
  if (v.community) context.push(`Community: ${v.community}`);
  if (v.bedrooms !== undefined) context.push(`Bedrooms: ${v.bedrooms}`);
  if (v.areaSqft !== undefined) context.push(`Area: ${v.areaSqft} sq ft`);
  const message = [v.message, context.length ? context.join(" · ") : undefined].filter(Boolean).join("\n\n") || null;

  const { score } = scoreLead({
    financeType: v.financeType,
    timeline: v.timeline,
    budgetMin: v.budgetMin,
    budgetMax: v.budgetMax,
    phone: v.phone,
    propertyId,
    projectId,
    source: v.source,
  });

  try {
    await db.insert(leads).values({
      fullName: v.fullName,
      email: v.email.toLowerCase(),
      phone: v.phone,
      message,
      buyerType: v.buyerType ?? null,
      financeType: v.financeType ?? null,
      budgetMin: v.budgetMin ?? null,
      budgetMax: v.budgetMax ?? null,
      timeline: v.timeline ?? null,
      source: v.source,
      propertyId,
      projectId,
      stage: "new",
      score,
      expectedValueAed,
    });
  } catch (err) {
    console.error("[lead] insert failed", err);
    return { status: "error", message: "Something went wrong. Please try again or call us directly." };
  }

  return { status: "success", message: THANK_YOU_MESSAGE };
}
