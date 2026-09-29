import { z } from "zod";

export const LEAD_SOURCES = ["form", "property_page", "project_page", "brochure", "mortgage_calc", "valuation", "callback"] as const;
export const BUYER_TYPES = ["end-user", "investor"] as const;
export const FINANCE_TYPES = ["cash", "mortgage", "undecided"] as const;
export const TIMELINES = ["immediate", "1-3 months", "3-6 months", "6+ months"] as const;
export const PROPERTY_TYPES = ["apartment", "villa", "townhouse", "penthouse"] as const;

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : undefined));

const optionalEnum = <T extends readonly [string, ...string[]]>(values: T) =>
  z
    .enum(values)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? (v as T[number]) : undefined));

const optionalInt = z
  .union([z.number(), z.string()])
  .optional()
  .transform((v) => {
    if (v === undefined || v === "") return undefined;
    const n = typeof v === "number" ? v : Number(String(v).replace(/[^0-9.]/g, ""));
    return Number.isFinite(n) ? Math.round(n) : undefined;
  });

/**
 * One schema for every public lead form. Each form renders a subset of fields;
 * the server action validates the full payload against this same schema.
 */
export const leadSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name").max(160),
  email: z.string().trim().email("Please enter a valid email address").max(200),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number")
    .max(40)
    .regex(/^[+0-9()\s-]+$/, "Please enter a valid phone number"),
  message: optionalText(2000),
  buyerType: optionalEnum(BUYER_TYPES),
  financeType: optionalEnum(FINANCE_TYPES),
  budgetMin: optionalInt,
  budgetMax: optionalInt,
  timeline: optionalEnum(TIMELINES),
  source: z.enum(LEAD_SOURCES).default("form"),
  propertyId: optionalInt,
  projectId: optionalInt,

  // Context fields used by specific forms (folded into the message on the server).
  preferredDate: optionalText(40),
  preferredTime: optionalText(40),
  propertyType: optionalEnum(PROPERTY_TYPES),
  community: optionalText(120),
  bedrooms: optionalInt,
  areaSqft: optionalInt,

  // Honeypot: real users never fill this in.
  website: z.string().max(0, "Spam detected").optional().or(z.literal("")),
});

export type LeadInput = z.input<typeof leadSchema>;
export type LeadValues = z.output<typeof leadSchema>;

export const newsletterSchema = z.object({
  email: z.string().trim().email(),
  website: z.string().max(0).optional().or(z.literal("")),
});
