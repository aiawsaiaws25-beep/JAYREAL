/**
 * Seed the database with the fixture dataset.
 *
 *   npm run db:push   # Neon: create tables first (PGlite migrates itself)
 *   npm run db:seed
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config();

import { getDb, hasDatabase } from "../src/db";
import { seedDatabase } from "../src/db/seed";

async function main() {
  console.log(hasDatabase() ? "Seeding Neon Postgres" : "Seeding local PGlite database (./.pglite)");
  const db = await getDb();
  const counts = await seedDatabase(db, (m) => console.log(`- ${m}`));
  console.log("Done:", counts);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
