"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { X } from "lucide-react";
import { createDeal } from "@/app/actions/admin";
import { AdminButton, Field, inputClass, selectClass } from "./ui";
import { formatAED } from "@/lib/utils";

export type DealLead = {
  id: number;
  fullName: string;
  propertyId: number | null;
  expectedValueAed: number | null;
  assignedTo: number | null;
};

type Option = { id: number; title: string; priceAed: number; status: string };
type Agent = { id: number; name: string };

export function DealModal({
  lead,
  properties,
  agents,
  isAdmin,
  onClose,
  onClosed,
}: {
  lead: DealLead;
  properties: Option[];
  agents: Agent[];
  isAdmin: boolean;
  onClose: () => void;
  onClosed?: () => void;
}) {
  const initialProperty = properties.find((p) => p.id === lead.propertyId);
  const [propertyId, setPropertyId] = useState<string>(lead.propertyId ? String(lead.propertyId) : "");
  const [salePrice, setSalePrice] = useState<number>(initialProperty?.priceAed ?? lead.expectedValueAed ?? 0);
  const [commissionPercent, setCommissionPercent] = useState<number>(2);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const commission = useMemo(() => Math.round((salePrice || 0) * ((commissionPercent || 0) / 100)), [salePrice, commissionPercent]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const onPropertyChange = (value: string) => {
    setPropertyId(value);
    const p = properties.find((x) => String(x.id) === value);
    if (p) setSalePrice(p.priceAed);
  };

  const submit = (formData: FormData) => {
    setError(null);
    start(async () => {
      const result = await createDeal(lead.id, formData);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      onClosed?.();
      onClose();
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-charcoal/60 p-4 backdrop-blur-sm md:items-center" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="deal-title" className="relative w-full max-w-lg bg-white p-8 md:p-10" onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={onClose} aria-label="Close" className="absolute right-4 top-4 p-2 text-warmgray transition-colors hover:text-charcoal">
          <X size={18} strokeWidth={1.25} />
        </button>
        <p className="label text-gold">Close deal</p>
        <h2 id="deal-title" className="mt-2 font-serif text-3xl font-light text-charcoal">
          {lead.fullName}
        </h2>
        <p className="mt-2 text-xs font-light text-warmgray">The lead moves to Won and the property is marked sold.</p>

        <form action={submit} className="mt-8 space-y-6">
          <Field label="Property" htmlFor="deal-property">
            <select id="deal-property" name="propertyId" value={propertyId} onChange={(e) => onPropertyChange(e.target.value)} className={selectClass}>
              <option value="">No linked property</option>
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} · {formatAED(p.priceAed)}
                  {p.status === "sold" ? " (sold)" : ""}
                </option>
              ))}
            </select>
          </Field>
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Sale price (AED)" htmlFor="deal-price">
              <input id="deal-price" name="salePriceAed" type="number" min={1} step={1} value={salePrice || ""} onChange={(e) => setSalePrice(e.target.valueAsNumber)} className={inputClass} required />
            </Field>
            <Field label="Commission %" htmlFor="deal-commission">
              <input id="deal-commission" name="commissionPercent" type="number" min={0} max={100} step={0.25} value={commissionPercent} onChange={(e) => setCommissionPercent(e.target.valueAsNumber)} className={inputClass} required />
            </Field>
          </div>
          {isAdmin && (
            <Field label="Closing agent" htmlFor="deal-agent">
              <select id="deal-agent" name="agentId" defaultValue={lead.assignedTo ?? ""} className={selectClass}>
                <option value="">Me</option>
                {agents.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </Field>
          )}
          <div className="border-t border-line pt-5">
            <p className="label text-[0.55rem] text-warmgray">Commission</p>
            <p className="mt-2 font-serif text-4xl font-light text-charcoal">{formatAED(commission)}</p>
          </div>
          {error && (
            <p className="text-xs font-light text-gold" role="alert">
              {error}
            </p>
          )}
          <div className="flex justify-end gap-3">
            <AdminButton type="button" variant="outline" onClick={onClose}>
              Cancel
            </AdminButton>
            <AdminButton type="submit" variant="gold" disabled={pending}>
              {pending ? "Closing" : "Mark as Won"}
            </AdminButton>
          </div>
        </form>
      </div>
    </div>
  );
}
