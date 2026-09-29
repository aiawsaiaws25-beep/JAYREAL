import {
  boolean,
  integer,
  numeric,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/* ---------------------------------- Enums --------------------------------- */

export const projectStatusEnum = pgEnum("project_status", ["off-plan", "under-construction", "ready"]);
export const listingTypeEnum = pgEnum("listing_type", ["ready", "off-plan"]);
export const propertyTypeEnum = pgEnum("property_type", ["apartment", "villa", "townhouse", "penthouse"]);
export const propertyStatusEnum = pgEnum("property_status", ["available", "reserved", "sold"]);
export const buyerTypeEnum = pgEnum("buyer_type", ["end-user", "investor"]);
export const financeTypeEnum = pgEnum("finance_type", ["cash", "mortgage", "undecided"]);
export const timelineEnum = pgEnum("timeline", ["immediate", "1-3 months", "3-6 months", "6+ months"]);
export const leadSourceEnum = pgEnum("lead_source", [
  "form",
  "property_page",
  "project_page",
  "brochure",
  "mortgage_calc",
  "valuation",
  "callback",
]);
export const leadStageEnum = pgEnum("lead_stage", [
  "new",
  "contacted",
  "qualified",
  "viewing",
  "offer",
  "mou_signed",
  "financing",
  "transfer",
  "won",
  "lost",
]);
export const viewingStatusEnum = pgEnum("viewing_status", ["scheduled", "done", "no-show", "cancelled"]);
export const userRoleEnum = pgEnum("user_role", ["admin", "agent"]);

/* --------------------------------- Tables --------------------------------- */

export const developers = pgTable("developers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  logoUrl: text("logo_url"),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  developerId: integer("developer_id").references(() => developers.id, { onDelete: "set null" }),
  community: varchar("community", { length: 120 }).notNull(),
  handoverDate: timestamp("handover_date", { withTimezone: false }),
  status: projectStatusEnum("status").notNull().default("off-plan"),
  paymentPlan: varchar("payment_plan", { length: 120 }),
  description: text("description"),
  imageUrl: text("image_url"),
});

export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  listingType: listingTypeEnum("listing_type").notNull().default("ready"),
  projectId: integer("project_id").references(() => projects.id, { onDelete: "set null" }),
  type: propertyTypeEnum("type").notNull(),
  priceAed: integer("price_aed").notNull(),
  bedrooms: integer("bedrooms").notNull().default(0),
  bathrooms: integer("bathrooms").notNull().default(0),
  areaSqft: integer("area_sqft").notNull(),
  community: varchar("community", { length: 120 }).notNull(),
  imageUrl: text("image_url"),
  featured: boolean("featured").notNull().default(false),
  status: propertyStatusEnum("status").notNull().default("available"),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  email: varchar("email", { length: 200 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: userRoleEnum("role").notNull().default("agent"),
  monthlyTargetAed: integer("monthly_target_aed").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  fullName: varchar("full_name", { length: 160 }).notNull(),
  email: varchar("email", { length: 200 }).notNull(),
  phone: varchar("phone", { length: 40 }).notNull(),
  message: text("message"),
  buyerType: buyerTypeEnum("buyer_type"),
  financeType: financeTypeEnum("finance_type"),
  budgetMin: integer("budget_min"),
  budgetMax: integer("budget_max"),
  timeline: timelineEnum("timeline"),
  source: leadSourceEnum("source").notNull().default("form"),
  propertyId: integer("property_id").references(() => properties.id, { onDelete: "set null" }),
  projectId: integer("project_id").references(() => projects.id, { onDelete: "set null" }),
  stage: leadStageEnum("stage").notNull().default("new"),
  score: integer("score").notNull().default(0),
  assignedTo: integer("assigned_to").references(() => users.id, { onDelete: "set null" }),
  expectedValueAed: integer("expected_value_aed"),
  viewedAt: timestamp("viewed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const leadNotes = pgTable("lead_notes", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id")
    .notNull()
    .references(() => leads.id, { onDelete: "cascade" }),
  userId: integer("user_id").references(() => users.id, { onDelete: "set null" }),
  note: text("note").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const viewings = pgTable("viewings", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id")
    .notNull()
    .references(() => leads.id, { onDelete: "cascade" }),
  propertyId: integer("property_id").references(() => properties.id, { onDelete: "set null" }),
  agentId: integer("agent_id").references(() => users.id, { onDelete: "set null" }),
  scheduledAt: timestamp("scheduled_at").notNull(),
  status: viewingStatusEnum("status").notNull().default("scheduled"),
  feedback: text("feedback"),
});

export const deals = pgTable("deals", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id")
    .notNull()
    .references(() => leads.id, { onDelete: "cascade" }),
  propertyId: integer("property_id").references(() => properties.id, { onDelete: "set null" }),
  agentId: integer("agent_id").references(() => users.id, { onDelete: "set null" }),
  salePriceAed: integer("sale_price_aed").notNull(),
  commissionPercent: numeric("commission_percent", { precision: 5, scale: 2 }).notNull().default("2"),
  commissionAed: integer("commission_aed").notNull(),
  closedAt: timestamp("closed_at").notNull().defaultNow(),
});

/* -------------------------------- Relations ------------------------------- */

export const developersRelations = relations(developers, ({ many }) => ({
  projects: many(projects),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  developer: one(developers, { fields: [projects.developerId], references: [developers.id] }),
  properties: many(properties),
  leads: many(leads),
}));

export const propertiesRelations = relations(properties, ({ one, many }) => ({
  project: one(projects, { fields: [properties.projectId], references: [projects.id] }),
  leads: many(leads),
  viewings: many(viewings),
}));

export const usersRelations = relations(users, ({ many }) => ({
  leads: many(leads),
  notes: many(leadNotes),
  viewings: many(viewings),
  deals: many(deals),
}));

export const leadsRelations = relations(leads, ({ one, many }) => ({
  property: one(properties, { fields: [leads.propertyId], references: [properties.id] }),
  project: one(projects, { fields: [leads.projectId], references: [projects.id] }),
  agent: one(users, { fields: [leads.assignedTo], references: [users.id] }),
  notes: many(leadNotes),
  viewings: many(viewings),
  deals: many(deals),
}));

export const leadNotesRelations = relations(leadNotes, ({ one }) => ({
  lead: one(leads, { fields: [leadNotes.leadId], references: [leads.id] }),
  user: one(users, { fields: [leadNotes.userId], references: [users.id] }),
}));

export const viewingsRelations = relations(viewings, ({ one }) => ({
  lead: one(leads, { fields: [viewings.leadId], references: [leads.id] }),
  property: one(properties, { fields: [viewings.propertyId], references: [properties.id] }),
  agent: one(users, { fields: [viewings.agentId], references: [users.id] }),
}));

export const dealsRelations = relations(deals, ({ one }) => ({
  lead: one(leads, { fields: [deals.leadId], references: [leads.id] }),
  property: one(properties, { fields: [deals.propertyId], references: [properties.id] }),
  agent: one(users, { fields: [deals.agentId], references: [users.id] }),
}));

/* ---------------------------------- Types --------------------------------- */

export type Developer = typeof developers.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type Property = typeof properties.$inferSelect;
export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
export type LeadNote = typeof leadNotes.$inferSelect;
export type Viewing = typeof viewings.$inferSelect;
export type Deal = typeof deals.$inferSelect;
export type User = typeof users.$inferSelect;

export type ProjectStatus = (typeof projectStatusEnum.enumValues)[number];
export type ListingType = (typeof listingTypeEnum.enumValues)[number];
export type PropertyType = (typeof propertyTypeEnum.enumValues)[number];
export type PropertyStatus = (typeof propertyStatusEnum.enumValues)[number];
export type LeadStage = (typeof leadStageEnum.enumValues)[number];
export type LeadSource = (typeof leadSourceEnum.enumValues)[number];
