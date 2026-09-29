import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import * as schema from "./schema";

/**
 * Database client.
 *
 * Production / Neon: DATABASE_URL set -> Drizzle over the Neon HTTP driver.
 * Local development: DATABASE_URL unset -> Drizzle over PGlite (embedded Postgres),
 * persisted in ./.pglite, migrated from ./drizzle and seeded with the fixture data on
 * first boot. Both branches share the same schema and query API.
 */
export type Database = PgDatabase<PgQueryResultHKT, typeof schema>;

type GlobalWithDb = typeof globalThis & { __jayDb?: Promise<Database> };
const g = globalThis as GlobalWithDb;

export function hasDatabase() {
  return Boolean(process.env.DATABASE_URL);
}

export function isLocalDatabase() {
  return !hasDatabase();
}

async function createNeon(url: string): Promise<Database> {
  const { neon } = await import("@neondatabase/serverless");
  const { drizzle } = await import("drizzle-orm/neon-http");
  return drizzle(neon(url), { schema }) as unknown as Database;
}

async function createPglite(): Promise<Database> {
  const { PGlite } = await import("@electric-sql/pglite");
  const { drizzle } = await import("drizzle-orm/pglite");
  const { migrate } = await import("drizzle-orm/pglite/migrator");
  const path = await import("node:path");

  const client = new PGlite(path.join(process.cwd(), ".pglite"));
  await client.waitReady;
  const db = drizzle(client, { schema });
  await migrate(db, { migrationsFolder: path.join(process.cwd(), "drizzle") });

  const [{ count }] = await db.select({ count: schema.users.id }).from(schema.users).limit(1).then((r) => (r.length ? [{ count: 1 }] : [{ count: 0 }]));
  if (count === 0) {
    const { seedDatabase } = await import("./seed");
    await seedDatabase(db as unknown as Database);
    console.log("[db] PGlite initialised and seeded at ./.pglite");
  }
  return db as unknown as Database;
}

export function getDb(): Promise<Database> {
  if (!g.__jayDb) {
    const url = process.env.DATABASE_URL;
    g.__jayDb = url ? createNeon(url) : createPglite();
    g.__jayDb.catch(() => {
      g.__jayDb = undefined;
    });
  }
  return g.__jayDb;
}

export { schema };
