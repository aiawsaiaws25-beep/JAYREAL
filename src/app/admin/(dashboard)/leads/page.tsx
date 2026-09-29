import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/auth";
import { listAgents, listLeads, SOURCES, STAGES, type LeadListFilters } from "@/lib/admin-queries";
import { AdminLink, EmptyState, inputClass, Money, PageTitle, Panel, ScoreBadge, selectClass, SourceLabel, STAGE_LABELS, StageChip, Table, Td, Th, timeAgo } from "@/components/admin/ui";
import { titleCase } from "@/lib/utils";
import type { LeadSource, LeadStage } from "@/db/schema";

export const metadata: Metadata = { title: "Leads" };

type SP = Record<string, string | string[] | undefined>;

function parseLeadFilters(sp: SP): LeadListFilters {
  const one = (k: string) => (Array.isArray(sp[k]) ? sp[k]?.[0] : sp[k]) || undefined;
  const stage = one("stage");
  const source = one("source");
  const assigned = one("assignedTo");
  const badge = one("badge");
  const sort = one("sort");
  return {
    q: one("q"),
    stage: STAGES.includes(stage as LeadStage) ? (stage as LeadStage) : undefined,
    source: SOURCES.includes(source as LeadSource) ? (source as LeadSource) : undefined,
    assignedTo: assigned === "unassigned" ? "unassigned" : assigned && !Number.isNaN(Number(assigned)) ? Number(assigned) : undefined,
    badge: badge === "HOT" || badge === "WARM" || badge === "COLD" ? badge : undefined,
    sort: sort === "oldest" || sort === "score" || sort === "value" ? sort : "newest",
    page: Math.max(1, Number(one("page") ?? 1) || 1),
    pageSize: 20,
  };
}

function qs(f: LeadListFilters, overrides: Partial<Record<string, string | number | undefined>> = {}) {
  const p = new URLSearchParams();
  const all: Record<string, string | number | undefined> = {
    q: f.q,
    stage: f.stage,
    source: f.source,
    assignedTo: f.assignedTo,
    badge: f.badge,
    sort: f.sort,
    page: f.page,
    ...overrides,
  };
  for (const [k, v] of Object.entries(all)) if (v !== undefined && v !== "" && !(k === "page" && v === 1) && !(k === "sort" && v === "newest")) p.set(k, String(v));
  const s = p.toString();
  return s ? `?${s}` : "";
}

export default async function LeadsPage({ searchParams }: { searchParams: Promise<SP> }) {
  const user = await requireUser();
  const filters = parseLeadFilters(await searchParams);
  const [data, agents] = await Promise.all([listLeads(user, filters), listAgents()]);

  return (
    <div className="space-y-8">
      <PageTitle label={`${data.total} ${data.total === 1 ? "lead" : "leads"}`} title="Leads">
        <AdminLink href={`/admin/leads/export${qs(filters, { page: undefined })}`} size="sm">
          Export CSV
        </AdminLink>
      </PageTitle>

      <Panel>
        <form method="get" className="grid gap-4 md:grid-cols-3 xl:grid-cols-7">
          <input name="q" defaultValue={filters.q ?? ""} placeholder="Search name, email, phone" className={inputClass + " xl:col-span-2"} />
          <select name="stage" defaultValue={filters.stage ?? ""} className={selectClass}>
            <option value="">All stages</option>
            {STAGES.map((s) => (
              <option key={s} value={s}>
                {STAGE_LABELS[s]}
              </option>
            ))}
          </select>
          <select name="source" defaultValue={filters.source ?? ""} className={selectClass}>
            <option value="">All sources</option>
            {SOURCES.map((s) => (
              <option key={s} value={s}>
                {titleCase(s.replace(/_/g, " "))}
              </option>
            ))}
          </select>
          {user.role === "admin" && (
            <select name="assignedTo" defaultValue={filters.assignedTo?.toString() ?? ""} className={selectClass}>
              <option value="">All agents</option>
              <option value="unassigned">Unassigned</option>
              {agents.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          )}
          <select name="badge" defaultValue={filters.badge ?? ""} className={selectClass}>
            <option value="">All scores</option>
            <option value="HOT">Hot (70+)</option>
            <option value="WARM">Warm (40–69)</option>
            <option value="COLD">Cold (under 40)</option>
          </select>
          <div className="flex gap-2">
            <select name="sort" defaultValue={filters.sort} className={selectClass + " min-w-0 flex-1"}>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="score">Highest score</option>
              <option value="value">Highest value</option>
            </select>
            <button type="submit" className="label shrink-0 border border-charcoal bg-charcoal px-4 text-[0.55rem] text-white transition-colors hover:border-gold hover:bg-gold">
              Filter
            </button>
          </div>
        </form>
      </Panel>

      <Panel padded={false}>
        {data.rows.length === 0 ? (
          <EmptyState>
            No leads match.{" "}
            <Link href="/admin/leads" className="text-charcoal underline decoration-gold underline-offset-4">
              Clear filters
            </Link>
          </EmptyState>
        ) : (
          <Table className="min-w-[900px]">
            <thead>
              <tr>
                <Th>Lead</Th>
                <Th>Contact</Th>
                <Th>Source</Th>
                <Th>Interest</Th>
                <Th>Stage</Th>
                <Th>Value</Th>
                <Th>Score</Th>
                <Th>Agent</Th>
                <Th>Received</Th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((l) => (
                <tr key={l.id} className="transition-colors hover:bg-offwhite">
                  <Td>
                    <Link href={`/admin/leads/${l.id}`} className="font-normal text-charcoal hover:text-gold">
                      {l.fullName}
                    </Link>
                    {!l.viewedAt && <span className="ml-2 inline-block h-1.5 w-1.5 bg-gold align-middle" aria-label="unread" />}
                  </Td>
                  <Td className="text-xs text-warmgray">
                    <div>{l.email}</div>
                    <div>{l.phone}</div>
                  </Td>
                  <Td>
                    <SourceLabel source={l.source} />
                  </Td>
                  <Td className="max-w-[200px] truncate text-xs text-warmgray">{l.property?.title ?? l.project?.name ?? "—"}</Td>
                  <Td>
                    <StageChip stage={l.stage} />
                  </Td>
                  <Td>
                    <Money value={l.expectedValueAed} />
                  </Td>
                  <Td>
                    <ScoreBadge score={l.score} />
                  </Td>
                  <Td className="text-xs text-warmgray">{l.agent?.name ?? "Unassigned"}</Td>
                  <Td className="whitespace-nowrap text-xs text-warmgray">{timeAgo(l.createdAt)}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        {data.pages > 1 && (
          <div className="flex items-center justify-between border-t border-line px-6 py-4">
            <span className="label text-[0.55rem] text-warmgray">
              Page {data.page} of {data.pages}
            </span>
            <div className="flex gap-2">
              {data.page > 1 && (
                <Link href={`/admin/leads${qs(filters, { page: data.page - 1 })}`} className="label border border-line px-3 py-2 text-[0.55rem] text-charcoal hover:border-gold">
                  Previous
                </Link>
              )}
              {data.page < data.pages && (
                <Link href={`/admin/leads${qs(filters, { page: data.page + 1 })}`} className="label border border-line px-3 py-2 text-[0.55rem] text-charcoal hover:border-gold">
                  Next
                </Link>
              )}
            </div>
          </div>
        )}
      </Panel>
    </div>
  );
}
