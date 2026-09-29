"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatAEDShort, titleCase } from "@/lib/utils";
import { STAGE_LABELS } from "./ui";
import type { LeadStage } from "@/db/schema";

/*
 * Single-series charts, one hue each, thin marks, recessive axes, hover tooltips.
 * Text always uses ink tokens; the mark colour carries identity.
 */
const INK = "#1a1a1a";
const MUTED = "#6b6b6b";
const LINE = "#e6e2dc";
const GOLD = "#b8975a";

const axisProps = {
  tick: { fontSize: 10, fill: MUTED, fontFamily: "var(--font-inter)" },
  axisLine: { stroke: LINE },
  tickLine: false as const,
};

type TipProps = { active?: boolean; payload?: ReadonlyArray<{ value?: number | string }>; label?: string | number; format?: (v: number) => string };

function Tip({ active, payload, label, format }: TipProps) {
  if (!active || !payload?.length) return null;
  const v = Number(payload[0].value ?? 0);
  return (
    <div className="border border-line bg-white px-3 py-2 text-xs font-light text-charcoal shadow-[0_10px_30px_-16px_rgba(26,26,26,0.3)]">
      <p className="label text-[0.5rem] text-warmgray">{label}</p>
      <p className="mt-1 font-serif text-lg">{format ? format(v) : v}</p>
    </div>
  );
}

export function LeadsBySourceChart({ data }: { data: { source: string; total: number }[] }) {
  const rows = data.map((d) => ({ name: titleCase(d.source.replace(/_/g, " ")), total: d.total }));
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: -20 }} barCategoryGap="28%">
        <CartesianGrid vertical={false} stroke={LINE} strokeDasharray="2 4" />
        <XAxis dataKey="name" {...axisProps} interval={0} angle={-20} textAnchor="end" height={48} />
        <YAxis {...axisProps} allowDecimals={false} />
        <Tooltip cursor={{ fill: "#f7f5f2" }} content={<Tip />} />
        <Bar dataKey="total" fill={INK} radius={[4, 4, 0, 0]} maxBarSize={28} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function StageFunnelChart({ data }: { data: { stage: LeadStage; total: number }[] }) {
  const rows = data.map((d) => ({ name: STAGE_LABELS[d.stage], total: d.total, stage: d.stage }));
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={rows} layout="vertical" margin={{ top: 4, right: 24, bottom: 4, left: 8 }} barCategoryGap="22%">
        <CartesianGrid horizontal={false} stroke={LINE} strokeDasharray="2 4" />
        <XAxis type="number" {...axisProps} allowDecimals={false} />
        <YAxis type="category" dataKey="name" {...axisProps} width={80} />
        <Tooltip cursor={{ fill: "#f7f5f2" }} content={<Tip />} />
        <Bar dataKey="total" radius={[0, 4, 4, 0]} maxBarSize={18}>
          {rows.map((r) => (
            <Cell key={r.stage} fill={r.stage === "won" ? GOLD : r.stage === "lost" ? LINE : INK} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function MonthlySalesChart({ data }: { data: { label: string; sales: number; total: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }} barCategoryGap="30%">
        <CartesianGrid vertical={false} stroke={LINE} strokeDasharray="2 4" />
        <XAxis dataKey="label" {...axisProps} />
        <YAxis {...axisProps} tickFormatter={(v: number) => formatAEDShort(v).replace("AED ", "")} width={48} />
        <Tooltip cursor={{ fill: "#f7f5f2" }} content={<Tip format={(v) => formatAEDShort(v)} />} />
        <Bar dataKey="sales" fill={GOLD} radius={[4, 4, 0, 0]} maxBarSize={32} />
      </BarChart>
    </ResponsiveContainer>
  );
}
