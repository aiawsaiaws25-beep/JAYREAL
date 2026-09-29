/**
 * Lead scoring, 0–100. Recalculated on every create and update.
 *
 *   finance: cash +25, mortgage +15
 *   timeline: immediate +20, 1-3 months +15, 3-6 months +5
 *   budget given +15, and +10 more if budget_max >= 2,000,000 AED
 *   phone provided +10
 *   linked to a property or project +10
 *   source valuation / callback / mortgage_calc +10
 */

export type ScoreInput = {
  financeType?: "cash" | "mortgage" | "undecided" | null;
  timeline?: "immediate" | "1-3 months" | "3-6 months" | "6+ months" | null;
  budgetMin?: number | null;
  budgetMax?: number | null;
  phone?: string | null;
  propertyId?: number | null;
  projectId?: number | null;
  source?: string | null;
};

export type ScoreBadge = "HOT" | "WARM" | "COLD";

export type ScoreBreakdown = { label: string; points: number };

export function scoreLead(lead: ScoreInput): { score: number; breakdown: ScoreBreakdown[] } {
  const breakdown: ScoreBreakdown[] = [];
  const add = (label: string, points: number) => breakdown.push({ label, points });

  if (lead.financeType === "cash") add("Cash buyer", 25);
  else if (lead.financeType === "mortgage") add("Mortgage buyer", 15);

  if (lead.timeline === "immediate") add("Immediate timeline", 20);
  else if (lead.timeline === "1-3 months") add("1–3 month timeline", 15);
  else if (lead.timeline === "3-6 months") add("3–6 month timeline", 5);

  const hasBudget = (lead.budgetMin ?? 0) > 0 || (lead.budgetMax ?? 0) > 0;
  if (hasBudget) {
    add("Budget provided", 15);
    if ((lead.budgetMax ?? 0) >= 2_000_000) add("Budget AED 2M+", 10);
  }

  if (lead.phone && lead.phone.trim().length >= 7) add("Phone provided", 10);

  if (lead.propertyId || lead.projectId) add("Linked to a listing", 10);

  if (lead.source === "valuation" || lead.source === "callback" || lead.source === "mortgage_calc") {
    add("High-intent source", 10);
  }

  const score = Math.min(100, breakdown.reduce((sum, b) => sum + b.points, 0));
  return { score, breakdown };
}

export function scoreBadge(score: number): ScoreBadge {
  if (score >= 70) return "HOT";
  if (score >= 40) return "WARM";
  return "COLD";
}
