export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatAED(amount: number) {
  return `AED ${new Intl.NumberFormat("en-AE", { maximumFractionDigits: 0 }).format(amount)}`;
}

/** Compact AED for cards/labels, e.g. "AED 2.45M". */
export function formatAEDShort(amount: number) {
  if (amount >= 1_000_000) return `AED ${(amount / 1_000_000).toFixed(amount % 1_000_000 === 0 ? 0 : 2).replace(/\.?0+$/, "")}M`;
  if (amount >= 1_000) return `AED ${Math.round(amount / 1_000)}K`;
  return `AED ${amount}`;
}

export function formatDate(date: Date | string | null | undefined, opts: Intl.DateTimeFormatOptions = { month: "long", year: "numeric" }) {
  if (!date) return "TBA";
  return new Intl.DateTimeFormat("en-GB", opts).format(new Date(date));
}

export function formatNumber(n: number) {
  return new Intl.NumberFormat("en-AE").format(n);
}

export function titleCase(s: string) {
  return s.replace(/(^|[\s-])\S/g, (m) => m.toUpperCase()).replace(/-/g, " ");
}
