import { z } from "zod";

const int = (min = 0) => z.coerce.number().int().min(min);
const optionalInt = z.preprocess((v) => (v === "" || v === null || v === undefined ? undefined : v), z.coerce.number().int().min(0).optional());
const optionalText = z.preprocess((v) => (typeof v === "string" && v.trim() === "" ? undefined : v), z.string().trim().max(5000).optional());

export const STAGES = ["new", "contacted", "qualified", "viewing", "offer", "mou_signed", "financing", "transfer", "won", "lost"] as const;

export const slugSchema = z
  .string()
  .trim()
  .min(2)
  .max(200)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens");

export const propertyFormSchema = z.object({
  title: z.string().trim().min(3).max(200),
  slug: slugSchema,
  listingType: z.enum(["ready", "off-plan"]),
  projectId: optionalInt,
  type: z.enum(["apartment", "villa", "townhouse", "penthouse"]),
  priceAed: int(1),
  bedrooms: int(0),
  bathrooms: int(0),
  areaSqft: int(1),
  community: z.string().trim().min(2).max(120),
  imageUrl: z.preprocess((v) => (typeof v === "string" && v.trim() === "" ? undefined : v), z.string().url().optional()),
  featured: z.preprocess((v) => v === "on" || v === true || v === "true", z.boolean()),
  status: z.enum(["available", "reserved", "sold"]),
});
export type PropertyFormInput = z.input<typeof propertyFormSchema>;

export const projectFormSchema = z.object({
  name: z.string().trim().min(3).max(200),
  slug: slugSchema,
  developerId: optionalInt,
  community: z.string().trim().min(2).max(120),
  handoverDate: z.preprocess((v) => (typeof v === "string" && v.trim() === "" ? undefined : v), z.coerce.date().optional()),
  status: z.enum(["off-plan", "under-construction", "ready"]),
  paymentPlan: optionalText,
  description: optionalText,
  imageUrl: z.preprocess((v) => (typeof v === "string" && v.trim() === "" ? undefined : v), z.string().url().optional()),
});
export type ProjectFormInput = z.input<typeof projectFormSchema>;

export const leadDetailsSchema = z.object({
  buyerType: z.preprocess((v) => (v === "" ? undefined : v), z.enum(["end-user", "investor"]).optional()),
  financeType: z.preprocess((v) => (v === "" ? undefined : v), z.enum(["cash", "mortgage", "undecided"]).optional()),
  timeline: z.preprocess((v) => (v === "" ? undefined : v), z.enum(["immediate", "1-3 months", "3-6 months", "6+ months"]).optional()),
  budgetMin: optionalInt,
  budgetMax: optionalInt,
  expectedValueAed: optionalInt,
});

export const noteSchema = z.object({ note: z.string().trim().min(1).max(5000) });

export const viewingSchema = z.object({
  propertyId: optionalInt,
  agentId: optionalInt,
  scheduledAt: z.coerce.date(),
});

export const viewingUpdateSchema = z.object({
  status: z.enum(["scheduled", "done", "no-show", "cancelled"]),
  feedback: optionalText,
});

export const dealSchema = z.object({
  propertyId: optionalInt,
  agentId: optionalInt,
  salePriceAed: int(1),
  commissionPercent: z.coerce.number().min(0).max(100),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
});
