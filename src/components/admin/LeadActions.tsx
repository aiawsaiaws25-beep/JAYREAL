"use client";

import { useState, useTransition } from "react";
import { addLeadNote, assignLead, scheduleViewing, updateLeadDetails, updateLeadStage, type ActionResult } from "@/app/actions/admin";
import { DealModal, type DealLead } from "./DealModal";
import { AdminButton, Field, inputClass, selectClass, STAGE_LABELS, toDatetimeLocal } from "./ui";
import type { LeadStage } from "@/db/schema";

const STAGES = Object.keys(STAGE_LABELS) as LeadStage[];
type Agent = { id: number; name: string };
type Option = { id: number; title: string; priceAed: number; status: string };

function useResult() {
  const [result, setResult] = useState<ActionResult | null>(null);
  const [pending, start] = useTransition();
  const run = (fn: () => Promise<ActionResult>) => {
    setResult(null);
    start(async () => setResult(await fn()));
  };
  return { result, pending, run };
}

function Message({ result }: { result: ActionResult | null }) {
  if (!result) return null;
  return (
    <p className={result.ok ? "text-xs font-light text-warmgray" : "text-xs font-light text-gold"} role="status">
      {result.ok ? (result.message ?? "Saved") : result.message}
    </p>
  );
}

/* ------------------------------ Stage + assign ---------------------------- */

export function StageAssignControls({
  lead,
  agents,
  properties,
  isAdmin,
  currentUserId,
}: {
  lead: DealLead & { stage: LeadStage };
  agents: Agent[];
  properties: Option[];
  isAdmin: boolean;
  currentUserId: number;
}) {
  const stageR = useResult();
  const assignR = useResult();
  const [deal, setDeal] = useState(false);

  const onStage = (stage: LeadStage) => {
    if (stage === "won") {
      setDeal(true);
      return;
    }
    stageR.run(() => updateLeadStage(lead.id, stage));
  };

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <Field label="Stage" htmlFor="stage">
        <select id="stage" value={lead.stage} onChange={(e) => onStage(e.target.value as LeadStage)} disabled={stageR.pending} className={selectClass}>
          {STAGES.map((s) => (
            <option key={s} value={s}>
              {STAGE_LABELS[s]}
            </option>
          ))}
        </select>
        <Message result={stageR.result} />
      </Field>
      <Field label="Assigned agent" htmlFor="assign">
        <select
          id="assign"
          value={lead.assignedTo ?? ""}
          onChange={(e) => assignR.run(() => assignLead(lead.id, e.target.value ? Number(e.target.value) : null))}
          disabled={assignR.pending || (!isAdmin && lead.assignedTo !== null && lead.assignedTo !== currentUserId)}
          className={selectClass}
        >
          <option value="">Unassigned</option>
          {(isAdmin ? agents : agents.filter((a) => a.id === currentUserId)).map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
        <Message result={assignR.result} />
      </Field>
      {lead.stage !== "won" && (
        <div className="sm:col-span-2">
          <AdminButton variant="gold" size="sm" onClick={() => setDeal(true)}>
            Mark as Won
          </AdminButton>
        </div>
      )}
      {deal && <DealModal lead={lead} properties={properties} agents={agents} isAdmin={isAdmin} onClose={() => setDeal(false)} />}
    </div>
  );
}

/* ------------------------------ Details form ------------------------------ */

export function LeadDetailsForm({
  lead,
}: {
  lead: { id: number; buyerType: string | null; financeType: string | null; timeline: string | null; budgetMin: number | null; budgetMax: number | null; expectedValueAed: number | null };
}) {
  const { result, pending, run } = useResult();
  const err = (k: string) => (result && !result.ok ? result.fieldErrors?.[k] : undefined);

  return (
    <form action={(fd) => run(() => updateLeadDetails(lead.id, fd))} className="grid gap-5 sm:grid-cols-2">
      <Field label="Buyer type" htmlFor="buyerType" error={err("buyerType")}>
        <select id="buyerType" name="buyerType" defaultValue={lead.buyerType ?? ""} className={selectClass}>
          <option value="">Unknown</option>
          <option value="end-user">End user</option>
          <option value="investor">Investor</option>
        </select>
      </Field>
      <Field label="Financing" htmlFor="financeType" error={err("financeType")}>
        <select id="financeType" name="financeType" defaultValue={lead.financeType ?? ""} className={selectClass}>
          <option value="">Unknown</option>
          <option value="cash">Cash</option>
          <option value="mortgage">Mortgage</option>
          <option value="undecided">Undecided</option>
        </select>
      </Field>
      <Field label="Timeline" htmlFor="timeline" error={err("timeline")}>
        <select id="timeline" name="timeline" defaultValue={lead.timeline ?? ""} className={selectClass}>
          <option value="">Unknown</option>
          <option value="immediate">Immediate</option>
          <option value="1-3 months">1–3 months</option>
          <option value="3-6 months">3–6 months</option>
          <option value="6+ months">6+ months</option>
        </select>
      </Field>
      <Field label="Expected value (AED)" htmlFor="expectedValueAed" error={err("expectedValueAed")}>
        <input id="expectedValueAed" name="expectedValueAed" type="number" min={0} step={1} defaultValue={lead.expectedValueAed ?? ""} className={inputClass} />
      </Field>
      <Field label="Budget from (AED)" htmlFor="budgetMin" error={err("budgetMin")}>
        <input id="budgetMin" name="budgetMin" type="number" min={0} step={1} defaultValue={lead.budgetMin ?? ""} className={inputClass} />
      </Field>
      <Field label="Budget to (AED)" htmlFor="budgetMax" error={err("budgetMax")}>
        <input id="budgetMax" name="budgetMax" type="number" min={0} step={1} defaultValue={lead.budgetMax ?? ""} className={inputClass} />
      </Field>
      <div className="flex items-center gap-4 sm:col-span-2">
        <AdminButton type="submit" size="sm" disabled={pending}>
          {pending ? "Saving" : "Save & rescore"}
        </AdminButton>
        <Message result={result} />
      </div>
    </form>
  );
}

/* --------------------------------- Notes ---------------------------------- */

export function NoteForm({ leadId }: { leadId: number }) {
  const { result, pending, run } = useResult();
  return (
    <form
      action={(fd) => run(() => addLeadNote(leadId, fd))}
      onSubmit={(e) => {
        const form = e.currentTarget;
        setTimeout(() => form.reset(), 0);
      }}
      className="space-y-3"
    >
      <textarea name="note" rows={3} placeholder="Add a note, call summary or next step" className={inputClass + " resize-y"} required />
      <div className="flex items-center gap-4">
        <AdminButton type="submit" size="sm" variant="outline" disabled={pending}>
          {pending ? "Adding" : "Add note"}
        </AdminButton>
        <Message result={result} />
      </div>
    </form>
  );
}

/* -------------------------------- Viewings -------------------------------- */

export function ViewingForm({ leadId, properties, agents, isAdmin, defaultPropertyId, defaultAgentId }: { leadId: number; properties: Option[]; agents: Agent[]; isAdmin: boolean; defaultPropertyId: number | null; defaultAgentId: number | null }) {
  const { result, pending, run } = useResult();
  const err = (k: string) => (result && !result.ok ? result.fieldErrors?.[k] : undefined);
  const tomorrow = new Date(Date.now() + 86_400_000);
  tomorrow.setHours(11, 0, 0, 0);

  return (
    <form action={(fd) => run(() => scheduleViewing(leadId, fd))} className="grid gap-5 sm:grid-cols-2">
      <Field label="Property" htmlFor="v-property" error={err("propertyId")} className="sm:col-span-2">
        <select id="v-property" name="propertyId" defaultValue={defaultPropertyId ?? ""} className={selectClass}>
          <option value="">Select a property</option>
          {properties.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Date and time" htmlFor="v-when" error={err("scheduledAt")}>
        <input id="v-when" name="scheduledAt" type="datetime-local" defaultValue={toDatetimeLocal(tomorrow)} className={inputClass} required />
      </Field>
      {isAdmin && (
        <Field label="Agent" htmlFor="v-agent" error={err("agentId")}>
          <select id="v-agent" name="agentId" defaultValue={defaultAgentId ?? ""} className={selectClass}>
            <option value="">Me</option>
            {agents.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </Field>
      )}
      <div className="flex items-center gap-4 sm:col-span-2">
        <AdminButton type="submit" size="sm" disabled={pending}>
          {pending ? "Scheduling" : "Schedule viewing"}
        </AdminButton>
        <Message result={result} />
      </div>
    </form>
  );
}
