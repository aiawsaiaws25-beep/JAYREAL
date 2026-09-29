"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/db";
import { deals, leadNotes, leads, projects, properties, viewings, type LeadStage } from "@/db/schema";
import { requireUser } from "@/auth";
import { leadScope } from "@/lib/admin-queries";
import { scoreLead } from "@/lib/scoring";
import {
  dealSchema,
  leadDetailsSchema,
  noteSchema,
  projectFormSchema,
  propertyFormSchema,
  STAGES,
  viewingSchema,
  viewingUpdateSchema,
} from "@/lib/admin-validations";

export type ActionResult = { ok: true; message?: string; id?: number } | { ok: false; message: string; fieldErrors?: Record<string, string> };

function fieldErrors(issues: { path: PropertyKey[]; message: string }[]) {
  const out: Record<string, string> = {};
  for (const i of issues) {
    const k = String(i.path[0] ?? "form");
    if (!out[k]) out[k] = i.message;
  }
  return out;
}

function fail(message: string, errors?: Record<string, string>): ActionResult {
  return { ok: false, message, fieldErrors: errors };
}

function revalidateLeadPaths(id?: number) {
  revalidatePath("/admin");
  revalidatePath("/admin/pipeline");
  revalidatePath("/admin/leads");
  revalidatePath("/admin/viewings");
  revalidatePath("/admin/agents");
  if (id) revalidatePath(`/admin/leads/${id}`);
}

/** Loads a lead the current user may act on, or throws. */
async function ownedLead(id: number) {
  const user = await requireUser();
  const db = await getDb();
  const lead = await db.query.leads.findFirst({ where: and(eq(leads.id, id), leadScope(user)) });
  if (!lead) throw new Error("Lead not found");
  return { user, db, lead };
}

/** Recalculates the score from the stored lead and bumps updated_at. */
async function rescore(id: number) {
  const db = await getDb();
  const lead = await db.query.leads.findFirst({ where: eq(leads.id, id) });
  if (!lead) return;
  const { score } = scoreLead(lead);
  await db.update(leads).set({ score, updatedAt: new Date() }).where(eq(leads.id, id));
}

/* ---------------------------------- Leads --------------------------------- */

export async function updateLeadStage(id: number, stage: LeadStage): Promise<ActionResult> {
  try {
    if (!STAGES.includes(stage)) return fail("Unknown stage");
    const { db } = await ownedLead(id);
    await db.update(leads).set({ stage, updatedAt: new Date() }).where(eq(leads.id, id));
    await rescore(id);
    revalidateLeadPaths(id);
    return { ok: true };
  } catch (e) {
    return fail((e as Error).message);
  }
}

export async function assignLead(id: number, agentId: number | null): Promise<ActionResult> {
  try {
    const user = await requireUser();
    // Agents may only claim unassigned leads for themselves.
    if (user.role === "agent" && agentId !== user.id) return fail("Agents can only assign leads to themselves");
    const db = await getDb();
    const lead = await db.query.leads.findFirst({ where: eq(leads.id, id) });
    if (!lead) return fail("Lead not found");
    if (user.role === "agent" && lead.assignedTo && lead.assignedTo !== user.id) return fail("This lead belongs to another agent");
    await db.update(leads).set({ assignedTo: agentId, updatedAt: new Date() }).where(eq(leads.id, id));
    await rescore(id);
    revalidateLeadPaths(id);
    return { ok: true };
  } catch (e) {
    return fail((e as Error).message);
  }
}

export async function updateLeadDetails(id: number, formData: FormData): Promise<ActionResult> {
  try {
    const parsed = leadDetailsSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) return fail("Check the highlighted fields", fieldErrors(parsed.error.issues));
    const { db } = await ownedLead(id);
    const v = parsed.data;
    await db
      .update(leads)
      .set({
        buyerType: v.buyerType ?? null,
        financeType: v.financeType ?? null,
        timeline: v.timeline ?? null,
        budgetMin: v.budgetMin ?? null,
        budgetMax: v.budgetMax ?? null,
        expectedValueAed: v.expectedValueAed ?? null,
        updatedAt: new Date(),
      })
      .where(eq(leads.id, id));
    await rescore(id);
    revalidateLeadPaths(id);
    return { ok: true, message: "Details saved and score recalculated" };
  } catch (e) {
    return fail((e as Error).message);
  }
}

export async function addLeadNote(id: number, formData: FormData): Promise<ActionResult> {
  try {
    const parsed = noteSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) return fail("Write a note first", fieldErrors(parsed.error.issues));
    const { db, user } = await ownedLead(id);
    await db.insert(leadNotes).values({ leadId: id, userId: user.id, note: parsed.data.note });
    await db.update(leads).set({ updatedAt: new Date() }).where(eq(leads.id, id));
    await rescore(id);
    revalidateLeadPaths(id);
    return { ok: true };
  } catch (e) {
    return fail((e as Error).message);
  }
}

export async function scheduleViewing(id: number, formData: FormData): Promise<ActionResult> {
  try {
    const parsed = viewingSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) return fail("Check the viewing details", fieldErrors(parsed.error.issues));
    const { db, user, lead } = await ownedLead(id);
    const v = parsed.data;
    await db.insert(viewings).values({
      leadId: id,
      propertyId: v.propertyId ?? lead.propertyId ?? null,
      agentId: user.role === "agent" ? user.id : (v.agentId ?? lead.assignedTo ?? user.id),
      scheduledAt: v.scheduledAt,
      status: "scheduled",
    });
    const stageIndex = STAGES.indexOf(lead.stage);
    const next: Partial<typeof leads.$inferInsert> = { updatedAt: new Date() };
    if (stageIndex < STAGES.indexOf("viewing")) next.stage = "viewing";
    await db.update(leads).set(next).where(eq(leads.id, id));
    await rescore(id);
    revalidateLeadPaths(id);
    return { ok: true, message: "Viewing scheduled" };
  } catch (e) {
    return fail((e as Error).message);
  }
}

export async function updateViewing(viewingId: number, formData: FormData): Promise<ActionResult> {
  try {
    const parsed = viewingUpdateSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) return fail("Check the viewing details", fieldErrors(parsed.error.issues));
    const user = await requireUser();
    const db = await getDb();
    const v = await db.query.viewings.findFirst({ where: eq(viewings.id, viewingId) });
    if (!v) return fail("Viewing not found");
    if (user.role === "agent" && v.agentId !== user.id) return fail("Not your viewing");
    await db.update(viewings).set({ status: parsed.data.status, feedback: parsed.data.feedback ?? null }).where(eq(viewings.id, viewingId));
    await db.update(leads).set({ updatedAt: new Date() }).where(eq(leads.id, v.leadId));
    await rescore(v.leadId);
    revalidateLeadPaths(v.leadId);
    return { ok: true };
  } catch (e) {
    return fail((e as Error).message);
  }
}

/** Closes a deal: inserts the deal, moves the lead to won and marks the property sold. */
export async function createDeal(id: number, formData: FormData): Promise<ActionResult> {
  try {
    const parsed = dealSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) return fail("Check the deal details", fieldErrors(parsed.error.issues));
    const { db, user, lead } = await ownedLead(id);
    const v = parsed.data;
    const propertyId = v.propertyId ?? lead.propertyId ?? null;
    const agentId = user.role === "agent" ? user.id : (v.agentId ?? lead.assignedTo ?? user.id);
    const commissionAed = Math.round(v.salePriceAed * (v.commissionPercent / 100));

    const [deal] = await db
      .insert(deals)
      .values({ leadId: id, propertyId, agentId, salePriceAed: v.salePriceAed, commissionPercent: v.commissionPercent.toFixed(2), commissionAed, closedAt: new Date() })
      .returning({ id: deals.id });
    await db.update(leads).set({ stage: "won", expectedValueAed: v.salePriceAed, updatedAt: new Date() }).where(eq(leads.id, id));
    if (propertyId) await db.update(properties).set({ status: "sold" }).where(eq(properties.id, propertyId));
    await rescore(id);
    revalidateLeadPaths(id);
    revalidatePath("/admin/properties");
    revalidatePath("/properties");
    return { ok: true, id: deal.id, message: "Deal closed" };
  } catch (e) {
    return fail((e as Error).message);
  }
}

/* ------------------------------- Properties ------------------------------- */

export async function saveProperty(id: number | null, formData: FormData): Promise<ActionResult> {
  try {
    await requireUser("admin");
    const parsed = propertyFormSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) return fail("Check the highlighted fields", fieldErrors(parsed.error.issues));
    const db = await getDb();
    const v = { ...parsed.data, projectId: parsed.data.projectId ?? null, imageUrl: parsed.data.imageUrl ?? null };
    let savedId = id;
    if (id) {
      await db.update(properties).set(v).where(eq(properties.id, id));
    } else {
      const [row] = await db.insert(properties).values(v).returning({ id: properties.id });
      savedId = row.id;
    }
    revalidatePath("/admin/properties");
    revalidatePath("/properties");
    revalidatePath("/");
    return { ok: true, id: savedId ?? undefined, message: "Property saved" };
  } catch (e) {
    const msg = (e as Error).message;
    return fail(msg.includes("unique") ? "That slug is already in use" : msg);
  }
}

export async function deleteProperty(id: number): Promise<ActionResult> {
  try {
    await requireUser("admin");
    const db = await getDb();
    await db.delete(properties).where(eq(properties.id, id));
    revalidatePath("/admin/properties");
    revalidatePath("/properties");
    return { ok: true };
  } catch (e) {
    return fail((e as Error).message);
  }
}

/* --------------------------------- Projects ------------------------------- */

export async function saveProject(id: number | null, formData: FormData): Promise<ActionResult> {
  try {
    await requireUser("admin");
    const parsed = projectFormSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) return fail("Check the highlighted fields", fieldErrors(parsed.error.issues));
    const db = await getDb();
    const v = {
      ...parsed.data,
      developerId: parsed.data.developerId ?? null,
      handoverDate: parsed.data.handoverDate ?? null,
      paymentPlan: parsed.data.paymentPlan ?? null,
      description: parsed.data.description ?? null,
      imageUrl: parsed.data.imageUrl ?? null,
    };
    let savedId = id;
    if (id) {
      await db.update(projects).set(v).where(eq(projects.id, id));
    } else {
      const [row] = await db.insert(projects).values(v).returning({ id: projects.id });
      savedId = row.id;
    }
    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    revalidatePath("/");
    return { ok: true, id: savedId ?? undefined, message: "Project saved" };
  } catch (e) {
    const msg = (e as Error).message;
    return fail(msg.includes("unique") ? "That slug is already in use" : msg);
  }
}

export async function deleteProject(id: number): Promise<ActionResult> {
  try {
    await requireUser("admin");
    const db = await getDb();
    await db.delete(projects).where(eq(projects.id, id));
    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    return { ok: true };
  } catch (e) {
    return fail((e as Error).message);
  }
}

/** Used by list pages after a delete to bounce back to the index. */
export async function deleteAndRedirect(kind: "property" | "project", id: number) {
  const result = kind === "property" ? await deleteProperty(id) : await deleteProject(id);
  if (!result.ok) throw new Error(result.message);
  redirect(kind === "property" ? "/admin/properties" : "/admin/projects");
}
