import "server-only";
import { and, asc, desc, eq, gte, ilike, lte, min, ne, or, type SQL } from "drizzle-orm";
import { getDb } from "@/db";
import { developers, projects, properties, type Developer, type Project, type Property } from "@/db/schema";

/** Data access for the public website. */

export type PropertyFilters = {
  q?: string;
  listingType?: "ready" | "off-plan";
  type?: Property["type"];
  community?: string;
  bedrooms?: number; // minimum
  minPrice?: number;
  maxPrice?: number;
  sort?: "newest" | "price-asc" | "price-desc";
};

export type ProjectWithDeveloper = Project & { developer: Developer | null };

/* -------------------------------- Properties ------------------------------ */

export async function getFeaturedProperties(limit = 6): Promise<Property[]> {
  const db = await getDb();
  return db.query.properties.findMany({
    where: and(eq(properties.featured, true), ne(properties.status, "sold")),
    orderBy: [desc(properties.id)],
    limit,
  });
}

export async function getProperties(filters: PropertyFilters = {}): Promise<Property[]> {
  const { q, listingType, type, community, bedrooms, minPrice, maxPrice, sort = "newest" } = filters;
  const db = await getDb();

  const conditions: SQL[] = [];
  if (listingType) conditions.push(eq(properties.listingType, listingType));
  if (type) conditions.push(eq(properties.type, type));
  if (community) conditions.push(eq(properties.community, community));
  if (bedrooms !== undefined) conditions.push(gte(properties.bedrooms, bedrooms));
  if (minPrice !== undefined) conditions.push(gte(properties.priceAed, minPrice));
  if (maxPrice !== undefined) conditions.push(lte(properties.priceAed, maxPrice));
  if (q) conditions.push(or(ilike(properties.title, `%${q}%`), ilike(properties.community, `%${q}%`))!);

  const orderBy =
    sort === "price-asc" ? asc(properties.priceAed) : sort === "price-desc" ? desc(properties.priceAed) : desc(properties.id);

  return db.query.properties.findMany({
    where: conditions.length ? and(...conditions) : undefined,
    orderBy: [orderBy],
  });
}

export async function getPropertyBySlug(slug: string): Promise<(Property & { project: ProjectWithDeveloper | null }) | null> {
  const db = await getDb();
  const row = await db.query.properties.findFirst({
    where: eq(properties.slug, slug),
    with: { project: { with: { developer: true } } },
  });
  return row ?? null;
}

export async function getSimilarProperties(property: Property, limit = 3): Promise<Property[]> {
  const db = await getDb();
  return db.query.properties.findMany({
    where: and(
      ne(properties.id, property.id),
      ne(properties.status, "sold"),
      or(eq(properties.community, property.community), eq(properties.type, property.type))
    ),
    orderBy: [desc(properties.featured), desc(properties.id)],
    limit,
  });
}

export async function getCommunities(): Promise<string[]> {
  const db = await getDb();
  const rows = await db.selectDistinct({ community: properties.community }).from(properties).orderBy(asc(properties.community));
  return rows.map((r) => r.community);
}

/* --------------------------------- Projects ------------------------------- */

export async function getProjects(limit?: number): Promise<ProjectWithDeveloper[]> {
  const db = await getDb();
  return db.query.projects.findMany({
    with: { developer: true },
    orderBy: [asc(projects.handoverDate)],
    limit,
  });
}

export async function getProjectBySlug(slug: string): Promise<ProjectWithDeveloper | null> {
  const db = await getDb();
  const row = await db.query.projects.findFirst({ where: eq(projects.slug, slug), with: { developer: true } });
  return row ?? null;
}

export async function getProjectUnits(projectId: number): Promise<Property[]> {
  const db = await getDb();
  return db.query.properties.findMany({
    where: eq(properties.projectId, projectId),
    orderBy: [asc(properties.priceAed)],
  });
}

/** Lowest price per project, used for "From AED X" on project cards. */
export async function getProjectStartingPrices(): Promise<Record<number, number>> {
  const db = await getDb();
  const rows = await db
    .select({ projectId: properties.projectId, price: min(properties.priceAed) })
    .from(properties)
    .groupBy(properties.projectId);
  const out: Record<number, number> = {};
  for (const r of rows) if (r.projectId != null && r.price != null) out[r.projectId] = r.price;
  return out;
}

export async function getDevelopers(): Promise<Developer[]> {
  const db = await getDb();
  return db.select().from(developers).orderBy(asc(developers.name));
}
