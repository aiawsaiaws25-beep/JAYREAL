import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/auth";
import { getDashboardStats, getNeedsAttention, listLeads } from "@/lib/admin-queries";
import { LeadsBySourceChart, MonthlySalesChart, StageFunnelChart } from "@/components/admin/Charts";
import { EmptyState, Money, PageTitle, Panel, ScoreBadge, SourceLabel, StageChip, StatCard, Table, Td, Th, timeAgo } from "@/components/admin/ui";
import { formatAED, formatAEDShort } from "@/lib/utils";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const user = await requireUser();
  const [stats, recent, attention] = await Promise.all([getDashboardStats(user), listLeads(user, { pageSize: 8 }), getNeedsAttention(user)]);

  return (
    <div className="space-y-8">
      <PageTitle label={user.role === "agent" ? "My pipeline" : "Overview"} title="Dashboard">
        <span className="label text-[0.55rem] text-warmgray">Refreshes every minute</span>
      </PageTitle>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="New leads today" value={String(stats.newToday)} hint={`${stats.totalLeads} leads in total`} href="/admin/leads?stage=new" />
        <StatCard label="Pipeline value" value={formatAEDShort(stats.pipelineValue)} hint={`${stats.pipelineCount} active leads`} href="/admin/pipeline" />
        <StatCard label="Viewings this week" value={String(stats.viewingsThisWeek)} href="/admin/viewings" />
        <StatCard label="Deals this month" value={String(stats.dealsThisMonth)} hint={`${formatAEDShort(stats.commissionThisMonth)} commission`} />
        <StatCard label="Conversion rate" value={`${stats.conversionRate}%`} hint="Won of all leads" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Leads by source">
          <LeadsBySourceChart data={stats.leadsBySource} />
        </Panel>
        <Panel title="Stage funnel">
          <StageFunnelChart data={stats.stageFunnel} />
        </Panel>
        <Panel title="Monthly sales">
          <MonthlySalesChart data={stats.monthlySales} />
          <p className="mt-3 text-xs font-light text-warmgray">
            {formatAED(stats.salesThisMonth)} closed this month
          </p>
        </Panel>
      </div>

      <div className="grid min-w-0 gap-4 lg:grid-cols-5">
        <Panel
          title="Latest leads"
          padded={false}
          className="lg:col-span-3"
          action={
            <Link href="/admin/leads" className="label text-[0.55rem] text-warmgray transition-colors hover:text-gold">
              All leads
            </Link>
          }
        >
          {recent.rows.length === 0 ? (
            <EmptyState>No leads yet.</EmptyState>
          ) : (
            <Table className="min-w-[560px]">
              <thead>
                <tr>
                  <Th>Lead</Th>
                  <Th>Source</Th>
                  <Th>Stage</Th>
                  <Th>Value</Th>
                  <Th>Score</Th>
                  <Th>Received</Th>
                </tr>
              </thead>
              <tbody>
                {recent.rows.map((l) => (
                  <tr key={l.id} className="transition-colors hover:bg-offwhite">
                    <Td>
                      <Link href={`/admin/leads/${l.id}`} className="font-normal text-charcoal hover:text-gold">
                        {l.fullName}
                      </Link>
                      {!l.viewedAt && <span className="ml-2 inline-block h-1.5 w-1.5 bg-gold align-middle" aria-label="unread" />}
                    </Td>
                    <Td>
                      <SourceLabel source={l.source} />
                    </Td>
                    <Td>
                      <StageChip stage={l.stage} />
                    </Td>
                    <Td>
                      <Money value={l.expectedValueAed} />
                    </Td>
                    <Td>
                      <ScoreBadge score={l.score} />
                    </Td>
                    <Td className="text-warmgray">{timeAgo(l.createdAt)}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Panel>

        <Panel
          title="Needs attention"
          padded={false}
          className="lg:col-span-2"
          action={
            <Link href="/admin/agents#attention" className="label text-[0.55rem] text-warmgray transition-colors hover:text-gold">
              View all
            </Link>
          }
        >
          {attention.length === 0 ? (
            <EmptyState>Every active lead has been touched in the last 3 days.</EmptyState>
          ) : (
            <ul>
              {attention.slice(0, 8).map((l) => (
                <li key={l.id} className="flex items-center justify-between gap-4 border-b border-line px-6 py-3.5 last:border-b-0">
                  <div className="min-w-0">
                    <Link href={`/admin/leads/${l.id}`} className="block truncate text-sm font-normal text-charcoal hover:text-gold">
                      {l.fullName}
                    </Link>
                    <p className="mt-0.5 text-xs font-light text-warmgray">
                      {l.agentName ?? "Unassigned"} · idle {l.idleDays}d
                    </p>
                  </div>
                  <StageChip stage={l.stage} />
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}
