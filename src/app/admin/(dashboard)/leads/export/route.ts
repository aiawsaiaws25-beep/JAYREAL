import { NextResponse, type NextRequest } from "next/server";
import { getSessionUser } from "@/auth";
import { exportLeads, type LeadListFilters, SOURCES, STAGES } from "@/lib/admin-queries";
import type { LeadSource, LeadStage } from "@/db/schema";

function csvCell(v: unknown) {
  if (v === null || v === undefined) return "";
  const s = v instanceof Date ? v.toISOString() : String(v);
  // Guard against spreadsheet formula injection and quote as needed.
  const safe = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
  return /[",\n\r]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
}

export async function GET(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const sp = req.nextUrl.searchParams;
  const stage = sp.get("stage");
  const source = sp.get("source");
  const assigned = sp.get("assignedTo");
  const badge = sp.get("badge");
  const sort = sp.get("sort");
  const filters: LeadListFilters = {
    q: sp.get("q") ?? undefined,
    stage: STAGES.includes(stage as LeadStage) ? (stage as LeadStage) : undefined,
    source: SOURCES.includes(source as LeadSource) ? (source as LeadSource) : undefined,
    assignedTo: assigned === "unassigned" ? "unassigned" : assigned && !Number.isNaN(Number(assigned)) ? Number(assigned) : undefined,
    badge: badge === "HOT" || badge === "WARM" || badge === "COLD" ? badge : undefined,
    sort: sort === "oldest" || sort === "score" || sort === "value" ? sort : "newest",
  };

  const rows = await exportLeads(user, filters);
  const header = ["id", "full_name", "email", "phone", "source", "stage", "badge", "score", "buyer_type", "finance_type", "timeline", "budget_min", "budget_max", "expected_value_aed", "property", "project", "agent", "created_at", "updated_at", "message"];
  const lines = [header.join(",")];
  for (const l of rows) {
    lines.push(
      [l.id, l.fullName, l.email, l.phone, l.source, l.stage, l.badge, l.score, l.buyerType, l.financeType, l.timeline, l.budgetMin, l.budgetMax, l.expectedValueAed, l.property?.title, l.project?.name, l.agent?.name, l.createdAt, l.updatedAt, l.message]
        .map(csvCell)
        .join(",")
    );
  }

  const stamp = new Date().toISOString().slice(0, 10);
  return new NextResponse("﻿" + lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="jay-leads-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
