"use client";

import { useOptimistic, useState, useTransition } from "react";
import Link from "next/link";
import { updateLeadStage } from "@/app/actions/admin";
import { DealModal, type DealLead } from "./DealModal";
import { ScoreBadge, STAGE_LABELS } from "./ui";
import { cn, formatAEDShort } from "@/lib/utils";
import type { LeadStage } from "@/db/schema";

export type KanbanLead = {
  id: number;
  fullName: string;
  stage: LeadStage;
  score: number;
  expectedValueAed: number | null;
  source: string;
  propertyId: number | null;
  assignedTo: number | null;
  agent: { id: number; name: string } | null;
  property: { id: number; title: string; priceAed: number } | null;
};

type Column = { stage: LeadStage; leads: KanbanLead[] };
type Option = { id: number; title: string; priceAed: number; status: string };

export function Kanban({ columns, properties, agents, isAdmin }: { columns: Column[]; properties: Option[]; agents: { id: number; name: string }[]; isAdmin: boolean }) {
  const [cols, setCols] = useOptimistic(columns);
  const [dragging, setDragging] = useState<number | null>(null);
  const [over, setOver] = useState<LeadStage | null>(null);
  const [dealLead, setDealLead] = useState<DealLead | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, start] = useTransition();

  const move = (leadId: number, to: LeadStage) => {
    const lead = cols.flatMap((c) => c.leads).find((l) => l.id === leadId);
    if (!lead || lead.stage === to) return;

    if (to === "won") {
      setDealLead({ id: lead.id, fullName: lead.fullName, propertyId: lead.propertyId, expectedValueAed: lead.expectedValueAed, assignedTo: lead.assignedTo });
      return;
    }

    start(async () => {
      setCols((prev) =>
        prev.map((c) => ({
          ...c,
          leads: c.stage === to ? [{ ...lead, stage: to }, ...c.leads] : c.leads.filter((l) => l.id !== leadId),
        }))
      );
      const result = await updateLeadStage(leadId, to);
      if (!result.ok) setError(result.message);
    });
  };

  return (
    <>
      {error && (
        <p className="mb-4 text-xs font-light text-gold" role="alert">
          {error}
        </p>
      )}
      <div className="flex gap-4 overflow-x-auto pb-6">
        {cols.map((col) => {
          const value = col.leads.reduce((s, l) => s + (l.expectedValueAed ?? 0), 0);
          return (
            <section
              key={col.stage}
              onDragOver={(e) => {
                e.preventDefault();
                if (over !== col.stage) setOver(col.stage);
              }}
              onDragLeave={() => setOver(null)}
              onDrop={(e) => {
                e.preventDefault();
                const id = Number(e.dataTransfer.getData("text/lead-id") || dragging);
                setOver(null);
                setDragging(null);
                if (id) move(id, col.stage);
              }}
              className={cn(
                "flex w-64 shrink-0 flex-col border bg-white transition-colors duration-300",
                over === col.stage ? "border-gold" : "border-line",
                col.stage === "won" && "bg-offwhite"
              )}
            >
              <header className="border-b border-line px-4 py-3">
                <div className="flex items-center justify-between">
                  <h2 className="label text-[0.6rem] text-charcoal">{STAGE_LABELS[col.stage]}</h2>
                  <span className="label text-[0.55rem] tabular-nums text-warmgray">{col.leads.length}</span>
                </div>
                <p className="mt-1 text-xs font-light text-warmgray">{value ? formatAEDShort(value) : "—"}</p>
              </header>
              <ul className="flex min-h-40 flex-1 flex-col gap-2 p-2">
                {col.leads.map((lead) => (
                  <li
                    key={lead.id}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("text/lead-id", String(lead.id));
                      e.dataTransfer.effectAllowed = "move";
                      setDragging(lead.id);
                    }}
                    onDragEnd={() => setDragging(null)}
                    className={cn("cursor-grab border border-line bg-white p-3 transition-opacity active:cursor-grabbing", dragging === lead.id && "opacity-40")}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <Link href={`/admin/leads/${lead.id}`} className="text-sm font-normal text-charcoal transition-colors hover:text-gold">
                        {lead.fullName}
                      </Link>
                      <ScoreBadge score={lead.score} />
                    </div>
                    <p className="mt-1.5 truncate text-xs font-light text-warmgray">{lead.property?.title ?? lead.source.replace(/_/g, " ")}</p>
                    <div className="mt-2 flex items-center justify-between text-[0.65rem] font-light text-warmgray">
                      <span>{lead.expectedValueAed ? formatAEDShort(lead.expectedValueAed) : ""}</span>
                      <span>{lead.agent?.name?.split(" ")[0] ?? "Unassigned"}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      {dealLead && <DealModal lead={dealLead} properties={properties} agents={agents} isAdmin={isAdmin} onClose={() => setDealLead(null)} />}
    </>
  );
}
