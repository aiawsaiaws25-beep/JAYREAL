import Link from "next/link";
import { cn, formatAED, titleCase } from "@/lib/utils";
import { scoreBadge, type ScoreBadge as Badge } from "@/lib/scoring";
import type { LeadStage } from "@/db/schema";

/* Shared admin primitives: calm, hairline, serif numbers. */

export function PageTitle({ label, title, children }: { label: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="label text-gold">{label}</p>
        <h1 className="mt-2 font-serif text-4xl font-light text-charcoal md:text-5xl">{title}</h1>
      </div>
      {children && <div className="flex flex-wrap items-center gap-3">{children}</div>}
    </div>
  );
}

export function Panel({ title, action, className, children, padded = true }: { title?: string; action?: React.ReactNode; className?: string; children: React.ReactNode; padded?: boolean }) {
  return (
    <section className={cn("min-w-0 border border-line bg-white", className)}>
      {(title || action) && (
        <header className="flex items-center justify-between gap-4 border-b border-line px-6 py-4">
          {title && <h2 className="label text-charcoal">{title}</h2>}
          {action}
        </header>
      )}
      <div className={cn(padded && "p-6")}>{children}</div>
    </section>
  );
}

export function StatCard({ label, value, hint, href }: { label: string; value: string; hint?: string; href?: string }) {
  const inner = (
    <>
      <p className="label text-[0.6rem] text-warmgray">{label}</p>
      <p className="mt-3 font-serif text-4xl font-light leading-none text-charcoal md:text-5xl">{value}</p>
      {hint && <p className="mt-3 text-xs font-light text-warmgray">{hint}</p>}
    </>
  );
  const cls = "block border border-line bg-white p-6 transition-colors duration-500";
  return href ? (
    <Link href={href} className={cn(cls, "hover:border-gold")}>
      {inner}
    </Link>
  ) : (
    <div className={cls}>{inner}</div>
  );
}

const badgeStyles: Record<Badge, string> = {
  HOT: "border-gold text-gold",
  WARM: "border-charcoal text-charcoal",
  COLD: "border-line text-warmgray",
};

export function ScoreBadge({ score, className }: { score: number; className?: string }) {
  const badge = scoreBadge(score);
  return (
    <span className={cn("label inline-flex items-center gap-2 border px-2 py-1 text-[0.55rem]", badgeStyles[badge], className)}>
      <span>{badge}</span>
      <span className="font-sans tabular-nums">{score}</span>
    </span>
  );
}

export const STAGE_LABELS: Record<LeadStage, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  viewing: "Viewing",
  offer: "Offer",
  mou_signed: "MOU Signed",
  financing: "Financing",
  transfer: "Transfer",
  won: "Won",
  lost: "Lost",
};

export function StageChip({ stage }: { stage: LeadStage }) {
  const tone = stage === "won" ? "border-gold text-gold" : stage === "lost" ? "border-line text-warmgray" : "border-line text-charcoal";
  return <span className={cn("label inline-block border px-2 py-1 text-[0.55rem]", tone)}>{STAGE_LABELS[stage]}</span>;
}

export function SourceLabel({ source }: { source: string }) {
  return <span className="text-xs font-light text-warmgray">{titleCase(source.replace(/_/g, " "))}</span>;
}

export function Money({ value, className }: { value: number | null | undefined; className?: string }) {
  return <span className={cn("tabular-nums", className)}>{value ? formatAED(value) : "—"}</span>;
}

type BtnProps = { variant?: "dark" | "outline" | "ghost" | "gold"; size?: "sm" | "md"; className?: string; children: React.ReactNode };
const btnBase = "inline-flex items-center justify-center gap-2 border font-sans font-normal uppercase tracking-[0.2em] transition-all duration-500 disabled:opacity-50 disabled:pointer-events-none";
const btnVariants = {
  dark: "border-charcoal bg-charcoal text-white hover:border-gold hover:bg-gold",
  gold: "border-gold bg-gold text-white hover:border-charcoal hover:bg-charcoal",
  outline: "border-charcoal bg-transparent text-charcoal hover:bg-charcoal hover:text-white",
  ghost: "border-transparent bg-transparent text-warmgray hover:text-charcoal",
};
const btnSizes = { sm: "px-4 py-2 text-[0.6rem]", md: "px-6 py-3 text-[0.65rem]" };

export function AdminButton({ variant = "dark", size = "md", className, children, ...rest }: BtnProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(btnBase, btnVariants[variant], btnSizes[size], className)} {...rest}>
      {children}
    </button>
  );
}

export function AdminLink({ variant = "outline", size = "md", className, children, href }: BtnProps & { href: string }) {
  return (
    <Link href={href} className={cn(btnBase, btnVariants[variant], btnSizes[size], className)}>
      {children}
    </Link>
  );
}

export function Table({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className="overflow-x-auto">
      <table className={cn("w-full min-w-[720px] text-left text-sm font-light text-charcoal", className)}>{children}</table>
    </div>
  );
}

export function Th({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <th className={cn("label whitespace-nowrap border-b border-line px-4 py-3 text-[0.55rem] font-normal text-warmgray", className)}>{children}</th>;
}

export function Td({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <td className={cn("border-b border-line px-4 py-3.5 align-middle", className)}>{children}</td>;
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return <p className="px-6 py-14 text-center text-sm font-light text-warmgray">{children}</p>;
}

export const inputClass =
  "w-full rounded-none border border-line bg-white px-3 py-2.5 text-sm font-light text-charcoal placeholder:text-warmgray/60 focus:border-charcoal focus:outline-none";
export const selectClass = inputClass + " appearance-none pr-8";

export function Field({ label, htmlFor, error, children, className }: { label: string; htmlFor: string; error?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={htmlFor} className="label text-[0.55rem] text-warmgray">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-xs font-light text-gold" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function timeAgo(date: Date | string) {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function formatDateTime(date: Date | string) {
  return new Date(date).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function toDatetimeLocal(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
