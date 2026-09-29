/**
 * Create or update an admin user.
 *
 *   npm run admin:create -- --email admin@example.com --password "Strong pass" --name "Jay Admin"
 *
 * --email falls back to ADMIN_EMAIL from the environment; password and name are CLI-only.
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config();

import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { getDb } from "../src/db";
import { users } from "../src/db/schema";

function arg(name: string) {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 ? process.argv[i + 1] : undefined;
}

async function main() {
  const email = (arg("email") ?? process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
  const password = arg("password");
  const name = arg("name") ?? "Administrator";

  if (!email || !password) {
    console.error("Usage: npm run admin:create -- --email <email> --password <password> [--name <name>]");
    process.exit(1);
  }
  if (password.length < 8) {
    console.error("Password must be at least 8 characters.");
    process.exit(1);
  }

  const db = await getDb();
  const passwordHash = await bcrypt.hash(password, 10);
  const existing = await db.query.users.findFirst({ where: eq(users.email, email) });

  if (existing) {
    await db.update(users).set({ name, passwordHash, role: "admin" }).where(eq(users.id, existing.id));
    console.log(`Updated admin ${email} (id ${existing.id}).`);
  } else {
    const [row] = await db.insert(users).values({ name, email, passwordHash, role: "admin" }).returning({ id: users.id });
    console.log(`Created admin ${email} (id ${row.id}).`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
