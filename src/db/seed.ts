import { sql } from "drizzle-orm";
import bcrypt from "bcryptjs";
import type { Database } from "./index";
import * as schema from "./schema";
import {
  seedDeals,
  seedDevelopers,
  seedLeadNotes,
  seedLeads,
  seedProjects,
  seedProperties,
  seedUsers,
  seedViewings,
} from "./seed-data";
import { scoreLead } from "@/lib/scoring";

const TABLES = ["developers", "projects", "properties", "users", "leads", "lead_notes", "viewings", "deals"];

/** Truncates every table and loads the fixture dataset. Shared by scripts/seed.ts and the local PGlite bootstrap. */
export async function seedDatabase(db: Database, log: (msg: string) => void = () => {}) {
  log("Clearing existing data");
  await db.execute(sql.raw(`TRUNCATE TABLE ${TABLES.join(", ")} RESTART IDENTITY CASCADE`));

  log("Inserting developers");
  await db.insert(schema.developers).values(seedDevelopers);
  log("Inserting projects");
  await db.insert(schema.projects).values(seedProjects);
  log("Inserting properties");
  await db.insert(schema.properties).values(seedProperties);

  log("Inserting users");
  const users = await Promise.all(
    seedUsers.map(async ({ password, ...u }) => ({ ...u, passwordHash: await bcrypt.hash(password, 10) }))
  );
  await db.insert(schema.users).values(users);

  log("Inserting leads");
  await db.insert(schema.leads).values(seedLeads.map((l) => ({ ...l, score: scoreLead(l).score })));
  log("Inserting lead notes");
  await db.insert(schema.leadNotes).values(seedLeadNotes);
  log("Inserting viewings");
  await db.insert(schema.viewings).values(seedViewings);
  log("Inserting deals");
  await db.insert(schema.deals).values(seedDeals);

  for (const table of TABLES) {
    await db.execute(
      sql.raw(`SELECT setval(pg_get_serial_sequence('${table}', 'id'), COALESCE((SELECT MAX(id) FROM ${table}), 1))`)
    );
  }

  return {
    developers: seedDevelopers.length,
    projects: seedProjects.length,
    properties: seedProperties.length,
    users: users.length,
    leads: seedLeads.length,
    notes: seedLeadNotes.length,
    viewings: seedViewings.length,
    deals: seedDeals.length,
  };
}
