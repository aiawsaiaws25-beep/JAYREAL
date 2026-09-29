import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/auth";
import { getAgentLeaderboard, getNeedsAttention } from "@/lib/admin-queries";
import { EmptyState, Money, PageTitle, Panel, ScoreBadge, StageChip, Table, Td, Th } from "@/components/admin/ui";
import { formatAED, formatAEDShort } from "@/lib/utils";

export const metadata: Metadata = { title: "Agents" };

export default async function AgentsPage() {
  const user = await requireUser();
  const [board, attention] = await Promise.all([getAgentLeaderboard(), getNeedsAttention(user)]);
  const monthLabel = new Date().toLocaleDateString("en-GB", { month: "long", year: "numeric" });

  return (
    <div className="space-y-8">
      <PageTitle label={monthLabel} title="Agents" />

      <Panel title="Leaderboard vs monthly target" padded={false}>
        {board.length === 0 ? (
          <EmptyState>No agents yet.</EmptyState>
        ) : (
          <Table className="min-w-[860px]">
            <thead>
              <tr>
                <Th>#</Th>
                <Th>Agent</Th>
                <Th>Sales this month</Th>
                <Th>Target</Th>
                <Th className="w-64">Progress</Th>
                <Th>Deals</Th>
                <Th>Commission</Th>
                <Th>Active leads</Th>
                <Th>Won (all time)</Th>
              </tr>
            </thead>
            <tbody>
              {board.map((a, i) => (
                <tr key={a.id} className={a.id === user.id ? "bg-offwhite" : undefined}>
                  <Td className="font-serif text-xl text-warmgray">{String(i + 1).padStart(2, "0")}</Td>
                  <Td>
                    <span className="font-normal text-charcoal">{a.name}</span>
                    <div className="text-xs text-warmgray">{a.email}</div>
                  </Td>
                  <Td className="font-serif text-xl">{formatAEDShort(a.salesThisMonth)}</Td>
                  <Td>{a.monthlyTargetAed ? formatAEDShort(a.monthlyTargetAed) : "—"}</Td>
                  <Td>
                    <div className="flex items-center gap-3">
                      <div className="h-1.5 flex-1 bg-line">
                        <div className="h-full bg-gold" style={{ width: `${Math.min(100, a.progress)}%` }} />
                      </div>
                      <span className="w-10 text-right text-xs tabular-nums text-warmgray">{a.progress}%</span>
                    </div>
                  </Td>
                  <Td>{a.dealsThisMonth}</Td>
                  <Td>
                    <Money value={a.commissionThisMonth} />
                  </Td>
                  <Td>{a.activeLeads}</Td>
                  <Td>{a.wonAllTime}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Panel>

      <Panel title="Needs attention · no activity for 3+ days" padded={false} className="scroll-mt-24">
        <div id="attention" />
        {attention.length === 0 ? (
          <EmptyState>Every active lead has been touched in the last 3 days.</EmptyState>
        ) : (
          <Table className="min-w-[760px]">
            <thead>
              <tr>
                <Th>Lead</Th>
                <Th>Stage</Th>
                <Th>Score</Th>
                <Th>Value</Th>
                <Th>Agent</Th>
                <Th>Idle</Th>
              </tr>
            </thead>
            <tbody>
              {attention.map((l) => (
                <tr key={l.id} className="transition-colors hover:bg-offwhite">
                  <Td>
                    <Link href={`/admin/leads/${l.id}`} className="font-normal text-charcoal hover:text-gold">
                      {l.fullName}
                    </Link>
                  </Td>
                  <Td>
                    <StageChip stage={l.stage} />
                  </Td>
                  <Td>
                    <ScoreBadge score={l.score} />
                  </Td>
                  <Td>{l.expectedValueAed ? formatAED(l.expectedValueAed) : "—"}</Td>
                  <Td className="text-xs text-warmgray">{l.agentName ?? "Unassigned"}</Td>
                  <Td className="text-gold">{l.idleDays} days</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Panel>
    </div>
  );
}
