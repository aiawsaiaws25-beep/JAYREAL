import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/auth";
import { listViewings } from "@/lib/admin-queries";
import { ViewingStatusForm } from "@/components/admin/ViewingStatusForm";
import { EmptyState, formatDateTime, PageTitle, Panel, StageChip, Table, Td, Th } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Viewings" };

const RANGES = [
  { key: "upcoming", label: "Upcoming" },
  { key: "past", label: "Past" },
  { key: "all", label: "All" },
] as const;

export default async function ViewingsPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const user = await requireUser();
  const { range: raw } = await searchParams;
  const range = raw === "past" || raw === "all" ? raw : "upcoming";
  const rows = await listViewings(user, range);

  return (
    <div className="space-y-8">
      <PageTitle label={`${rows.length} ${range}`} title="Viewings">
        <div className="flex border border-line">
          {RANGES.map((r) => (
            <Link key={r.key} href={`/admin/viewings?range=${r.key}`} className={cn("label px-4 py-2 text-[0.55rem] transition-colors", range === r.key ? "bg-charcoal text-white" : "text-warmgray hover:text-charcoal")}>
              {r.label}
            </Link>
          ))}
        </div>
      </PageTitle>

      <Panel padded={false}>
        {rows.length === 0 ? (
          <EmptyState>No {range} viewings. Schedule one from a lead page.</EmptyState>
        ) : (
          <Table className="min-w-[900px]">
            <thead>
              <tr>
                <Th>When</Th>
                <Th>Lead</Th>
                <Th>Property</Th>
                <Th>Agent</Th>
                <Th>Status & feedback</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((v) => (
                <tr key={v.id} className="transition-colors hover:bg-offwhite">
                  <Td className="whitespace-nowrap">{formatDateTime(v.scheduledAt)}</Td>
                  <Td>
                    <Link href={`/admin/leads/${v.lead.id}`} className="font-normal text-charcoal hover:text-gold">
                      {v.lead.fullName}
                    </Link>
                    <div className="mt-1">
                      <StageChip stage={v.lead.stage} />
                    </div>
                  </Td>
                  <Td className="text-xs text-warmgray">
                    {v.property?.title ?? "—"}
                    {v.property?.community ? <div>{v.property.community}</div> : null}
                  </Td>
                  <Td className="text-xs text-warmgray">{v.agent?.name ?? "—"}</Td>
                  <Td>
                    <ViewingStatusForm viewingId={v.id} status={v.status} feedback={v.feedback} />
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Panel>
    </div>
  );
}
