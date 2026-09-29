import "server-only";
import { and, asc, count, desc, eq, gte, ilike, inArray, isNull, lt, lte, max, notInArray, or, sql, sum, type SQL } from "drizzle-orm";
import { getDb } from "@/db";
import {
  deals,
  developers,
  leadNotes,
  leads,
  projects,
  properties,
  users,
  viewings,
  type LeadSource,
  type LeadStage,
} from "@/db/schema";
import { scoreBadge } from "@/lib/scoring";

export type Scope = { id: number; role: "admin" | "agent" };

export const STAGES: LeadStage[] = ["new", "contacted", "qualified", "viewing", "offer", "mou_signed", "financing", "transfer", "won", "lost"];
export const ACTIVE_STAGES: LeadStage[] = ["new", "contacted", "qualified", "viewing", "offer", "mou_signed", "financing", "transfer"];
export const SOURCES: LeadSource[] = ["form", "property_page", "project_page", "brochure", "mortgage_calc", "valuation", "callback"];

/** Agents only see leads assigned to them. */
export function leadScope(scope: Scope): SQL | undefined {
  return scope.role === "agent" ? eq(leads.assignedTo, scope.id) : undefined;
}

function startOfDay(d = new Date()) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function startOfWeek(d = new Date()) {
  const x = startOfDay(d);
  const day = (x.getDay() + 6) % 7; // Monday = 0
  x.setDate(x.getDate() - day);
  return x;
}
function startOfMonth(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

/* ------------------------------ Notifications ----------------------------- */

export async function getNewLeadNotifications(scope: Scope) {
  const db = await getDb();
  const where = and(isNull(leads.viewedAt), leadScope(scope));
  const [[{ total }], latest] = await Promise.all([
    db.select({ total: count() }).from(leads).where(where),
    db.query.leads.findMany({
      where,
      orderBy: [desc(leads.createdAt)],
      limit: 8,
      columns: { id: true, fullName: true, source: true, score: true, createdAt: true, expectedValueAed: true },
    }),
  ]);
  return { count: Number(total), latest };
}

/* -------------------------------- Dashboard ------------------------------- */

export async function getDashboardStats(scope: Scope) {
  const db = await getDb();
  const s = leadScope(scope);
  const today = startOfDay();
  const week = startOfWeek();
  const month = startOfMonth();
  const dealScope = scope.role === "agent" ? eq(deals.agentId, scope.id) : undefined;
  const viewingScope = scope.role === "agent" ? eq(viewings.agentId, scope.id) : undefined;

  const [
    [{ newToday }],
    [{ pipelineValue, pipelineCount }],
    [{ viewingsThisWeek }],
    [{ dealsThisMonth, salesThisMonth, commissionThisMonth }],
    [{ totalLeads }],
    [{ wonLeads }],
    bySource,
    byStage,
    monthlyRows,
  ] = await Promise.all([
    db.select({ newToday: count() }).from(leads).where(and(gte(leads.createdAt, today), s)),
    db
      .select({ pipelineValue: sum(leads.expectedValueAed), pipelineCount: count() })
      .from(leads)
      .where(and(inArray(leads.stage, ACTIVE_STAGES), s)),
    db
      .select({ viewingsThisWeek: count() })
      .from(viewings)
      .where(and(gte(viewings.scheduledAt, week), lt(viewings.scheduledAt, new Date(week.getTime() + 7 * 86_400_000)), viewingScope)),
    db
      .select({ dealsThisMonth: count(), salesThisMonth: sum(deals.salePriceAed), commissionThisMonth: sum(deals.commissionAed) })
      .from(deals)
      .where(and(gte(deals.closedAt, month), dealScope)),
    db.select({ totalLeads: count() }).from(leads).where(s),
    db.select({ wonLeads: count() }).from(leads).where(and(eq(leads.stage, "won"), s)),
    db.select({ source: leads.source, total: count() }).from(leads).where(s).groupBy(leads.source),
    db.select({ stage: leads.stage, total: count(), value: sum(leads.expectedValueAed) }).from(leads).where(s).groupBy(leads.stage),
    db
      .select({
        month: sql<string>`to_char(date_trunc('month', ${deals.closedAt}), 'YYYY-MM')`,
        sales: sum(deals.salePriceAed),
        commission: sum(deals.commissionAed),
        total: count(),
      })
      .from(deals)
      .where(and(gte(deals.closedAt, new Date(month.getFullYear(), month.getMonth() - 5, 1)), dealScope))
      .groupBy(sql`date_trunc('month', ${deals.closedAt})`)
      .orderBy(sql`date_trunc('month', ${deals.closedAt})`),
  ]);

  // Fill the last 6 months so the chart has a continuous axis.
  const months: { month: string; label: string; sales: number; commission: number; total: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(month.getFullYear(), month.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const row = monthlyRows.find((r) => r.month === key);
    months.push({
      month: key,
      label: d.toLocaleDateString("en-GB", { month: "short" }),
      sales: Number(row?.sales ?? 0),
      commission: Number(row?.commission ?? 0),
      total: Number(row?.total ?? 0),
    });
  }

  const total = Number(totalLeads);
  const won = Number(wonLeads);

  return {
    newToday: Number(newToday),
    pipelineValue: Number(pipelineValue ?? 0),
    pipelineCount: Number(pipelineCount),
    viewingsThisWeek: Number(viewingsThisWeek),
    dealsThisMonth: Number(dealsThisMonth),
    salesThisMonth: Number(salesThisMonth ?? 0),
    commissionThisMonth: Number(commissionThisMonth ?? 0),
    conversionRate: total ? Math.round((won / total) * 1000) / 10 : 0,
    totalLeads: total,
    leadsBySource: SOURCES.map((source) => ({ source, total: Number(bySource.find((r) => r.source === source)?.total ?? 0) })),
    stageFunnel: STAGES.map((stage) => {
      const r = byStage.find((x) => x.stage === stage);
      return { stage, total: Number(r?.total ?? 0), value: Number(r?.value ?? 0) };
    }),
    monthlySales: months,
  };
}

/* ---------------------------------- Leads --------------------------------- */

export type LeadListFilters = {
  q?: string;
  stage?: LeadStage;
  source?: LeadSource;
  assignedTo?: number | "unassigned";
  badge?: "HOT" | "WARM" | "COLD";
  page?: number;
  pageSize?: number;
  sort?: "newest" | "oldest" | "score" | "value";
};

export async function listLeads(scope: Scope, f: LeadListFilters = {}) {
  const db = await getDb();
  const pageSize = Math.min(Math.max(f.pageSize ?? 20, 5), 200);
  const page = Math.max(f.page ?? 1, 1);

  const where: SQL[] = [];
  const scoped = leadScope(scope);
  if (scoped) where.push(scoped);
  if (f.q) {
    const like = `%${f.q}%`;
    where.push(or(ilike(leads.fullName, like), ilike(leads.email, like), ilike(leads.phone, like))!);
  }
  if (f.stage) where.push(eq(leads.stage, f.stage));
  if (f.source) where.push(eq(leads.source, f.source));
  if (f.assignedTo === "unassigned") where.push(isNull(leads.assignedTo));
  else if (typeof f.assignedTo === "number") where.push(eq(leads.assignedTo, f.assignedTo));
  if (f.badge === "HOT") where.push(gte(leads.score, 70));
  else if (f.badge === "WARM") where.push(and(gte(leads.score, 40), lt(leads.score, 70))!);
  else if (f.badge === "COLD") where.push(lt(leads.score, 40));

  const cond = where.length ? and(...where) : undefined;
  const orderBy =
    f.sort === "oldest" ? asc(leads.createdAt) : f.sort === "score" ? desc(leads.score) : f.sort === "value" ? desc(leads.expectedValueAed) : desc(leads.createdAt);

  const [rows, [{ total }]] = await Promise.all([
    db.query.leads.findMany({
      where: cond,
      orderBy: [orderBy],
      limit: pageSize,
      offset: (page - 1) * pageSize,
      with: {
        agent: { columns: { id: true, name: true } },
        property: { columns: { id: true, title: true, slug: true } },
        project: { columns: { id: true, name: true, slug: true } },
      },
    }),
    db.select({ total: count() }).from(leads).where(cond),
  ]);

  return {
    rows: rows.map((r) => ({ ...r, badge: scoreBadge(r.score) })),
    total: Number(total),
    page,
    pageSize,
    pages: Math.max(1, Math.ceil(Number(total) / pageSize)),
  };
}

/** Full export without pagination (respects filters and scope). */
export async function exportLeads(scope: Scope, f: LeadListFilters = {}) {
  const { rows } = await listLeads(scope, { ...f, page: 1, pageSize: 200 });
  const all = [...rows];
  let page = 2;
  while (all.length % 200 === 0 && all.length > 0) {
    const next = await listLeads(scope, { ...f, page, pageSize: 200 });
    if (!next.rows.length) break;
    all.push(...next.rows);
    page++;
  }
  return all;
}

export async function getLead(id: number, scope: Scope) {
  const db = await getDb();
  const lead = await db.query.leads.findFirst({
    where: and(eq(leads.id, id), leadScope(scope)),
    with: {
      agent: { columns: { id: true, name: true, email: true } },
      property: true,
      project: { with: { developer: true } },
      notes: { with: { user: { columns: { id: true, name: true } } }, orderBy: [desc(leadNotes.createdAt)] },
      viewings: { with: { property: { columns: { id: true, title: true, slug: true } }, agent: { columns: { id: true, name: true } } }, orderBy: [desc(viewings.scheduledAt)] },
      deals: { with: { property: { columns: { id: true, title: true } } }, orderBy: [desc(deals.closedAt)] },
    },
  });
  return lead ?? null;
}

export async function markLeadViewed(id: number) {
  const db = await getDb();
  await db.update(leads).set({ viewedAt: new Date() }).where(and(eq(leads.id, id), isNull(leads.viewedAt)));
}

export async function getPipeline(scope: Scope) {
  const db = await getDb();
  const rows = await db.query.leads.findMany({
    where: leadScope(scope),
    orderBy: [desc(leads.score), desc(leads.updatedAt)],
    columns: { id: true, fullName: true, stage: true, score: true, expectedValueAed: true, source: true, updatedAt: true, propertyId: true, assignedTo: true },
    with: { agent: { columns: { id: true, name: true } }, property: { columns: { id: true, title: true, priceAed: true } } },
  });
  return STAGES.map((stage) => ({
    stage,
    leads: rows.filter((r) => r.stage === stage).map((r) => ({ ...r, badge: scoreBadge(r.score) })),
  }));
}

/* ---------------------------------- Users --------------------------------- */

export async function listAgents() {
  const db = await getDb();
  return db.query.users.findMany({
    columns: { id: true, name: true, email: true, role: true, monthlyTargetAed: true },
    orderBy: [asc(users.name)],
  });
}

export async function getAgentLeaderboard() {
  const db = await getDb();
  const month = startOfMonth();
  const [agents, monthDeals, activeLeads, wonAllTime] = await Promise.all([
    listAgents(),
    db
      .select({ agentId: deals.agentId, total: count(), sales: sum(deals.salePriceAed), commission: sum(deals.commissionAed) })
      .from(deals)
      .where(gte(deals.closedAt, month))
      .groupBy(deals.agentId),
    db.select({ agentId: leads.assignedTo, total: count() }).from(leads).where(inArray(leads.stage, ACTIVE_STAGES)).groupBy(leads.assignedTo),
    db.select({ agentId: leads.assignedTo, total: count() }).from(leads).where(eq(leads.stage, "won")).groupBy(leads.assignedTo),
  ]);

  return agents
    .filter((a) => a.role === "agent" || a.monthlyTargetAed > 0)
    .map((a) => {
      const d = monthDeals.find((x) => x.agentId === a.id);
      const sales = Number(d?.sales ?? 0);
      return {
        ...a,
        dealsThisMonth: Number(d?.total ?? 0),
        salesThisMonth: sales,
        commissionThisMonth: Number(d?.commission ?? 0),
        activeLeads: Number(activeLeads.find((x) => x.agentId === a.id)?.total ?? 0),
        wonAllTime: Number(wonAllTime.find((x) => x.agentId === a.id)?.total ?? 0),
        progress: a.monthlyTargetAed ? Math.min(999, Math.round((sales / a.monthlyTargetAed) * 100)) : 0,
      };
    })
    .sort((a, b) => b.salesThisMonth - a.salesThisMonth);
}

/** Active leads with no activity (update, note or viewing) for 3+ days. */
export async function getNeedsAttention(scope: Scope, days = 3) {
  const db = await getDb();
  const cutoff = new Date(Date.now() - days * 86_400_000);

  const lastNote = db
    .select({ leadId: leadNotes.leadId, last: max(leadNotes.createdAt).as("last_note") })
    .from(leadNotes)
    .groupBy(leadNotes.leadId)
    .as("ln");
  const lastViewing = db
    .select({ leadId: viewings.leadId, last: max(viewings.scheduledAt).as("last_viewing") })
    .from(viewings)
    .groupBy(viewings.leadId)
    .as("lv");

  const rows = await db
    .select({
      id: leads.id,
      fullName: leads.fullName,
      stage: leads.stage,
      score: leads.score,
      expectedValueAed: leads.expectedValueAed,
      updatedAt: leads.updatedAt,
      agentName: users.name,
      lastNote: lastNote.last,
      lastViewing: lastViewing.last,
    })
    .from(leads)
    .leftJoin(users, eq(users.id, leads.assignedTo))
    .leftJoin(lastNote, eq(lastNote.leadId, leads.id))
    .leftJoin(lastViewing, eq(lastViewing.leadId, leads.id))
    .where(
      and(
        inArray(leads.stage, ACTIVE_STAGES),
        lte(leads.updatedAt, cutoff),
        or(isNull(lastNote.last), lte(lastNote.last, cutoff)),
        or(isNull(lastViewing.last), lte(lastViewing.last, cutoff)),
        leadScope(scope)
      )
    )
    .orderBy(asc(leads.updatedAt))
    .limit(50);

  return rows.map((r) => {
    const last = new Date(Math.max(new Date(r.updatedAt).getTime(), r.lastNote ? new Date(r.lastNote).getTime() : 0, r.lastViewing ? new Date(r.lastViewing).getTime() : 0));
    return { ...r, badge: scoreBadge(r.score), lastActivity: last, idleDays: Math.floor((Date.now() - last.getTime()) / 86_400_000) };
  });
}

/* -------------------------------- Viewings -------------------------------- */

export async function listViewings(scope: Scope, range: "upcoming" | "past" | "all" = "upcoming") {
  const db = await getDb();
  const now = new Date();
  const scopeCond = scope.role === "agent" ? eq(viewings.agentId, scope.id) : undefined;
  const rangeCond = range === "upcoming" ? gte(viewings.scheduledAt, startOfDay(now)) : range === "past" ? lt(viewings.scheduledAt, startOfDay(now)) : undefined;
  return db.query.viewings.findMany({
    where: and(scopeCond, rangeCond),
    orderBy: [range === "past" ? desc(viewings.scheduledAt) : asc(viewings.scheduledAt)],
    with: {
      lead: { columns: { id: true, fullName: true, phone: true, stage: true } },
      property: { columns: { id: true, title: true, community: true, slug: true } },
      agent: { columns: { id: true, name: true } },
    },
    limit: 200,
  });
}

/* -------------------------- Properties & projects ------------------------- */

export async function adminListProperties() {
  const db = await getDb();
  return db.query.properties.findMany({ orderBy: [desc(properties.id)], with: { project: { columns: { id: true, name: true } } } });
}

export async function adminGetProperty(id: number) {
  const db = await getDb();
  return (await db.query.properties.findFirst({ where: eq(properties.id, id) })) ?? null;
}

export async function adminListProjects() {
  const db = await getDb();
  const rows = await db.query.projects.findMany({ orderBy: [asc(projects.handoverDate)], with: { developer: true } });
  const unitCounts = await db.select({ projectId: properties.projectId, total: count() }).from(properties).where(notInArray(properties.projectId, [-1])).groupBy(properties.projectId);
  return rows.map((p) => ({ ...p, units: Number(unitCounts.find((u) => u.projectId === p.id)?.total ?? 0) }));
}

export async function adminGetProject(id: number) {
  const db = await getDb();
  return (await db.query.projects.findFirst({ where: eq(projects.id, id) })) ?? null;
}

export async function adminListDevelopers() {
  const db = await getDb();
  return db.select().from(developers).orderBy(asc(developers.name));
}

export async function listPropertyOptions() {
  const db = await getDb();
  return db.query.properties.findMany({ columns: { id: true, title: true, priceAed: true, status: true }, orderBy: [asc(properties.title)] });
}
