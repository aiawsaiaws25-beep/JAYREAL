import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { authConfig } from "./auth.config";
import { getDb } from "@/db";
import { users } from "@/db/schema";

const credentialsSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(raw) {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;

        const db = await getDb();
        const user = await db.query.users.findFirst({ where: eq(users.email, email.toLowerCase()) });
        if (!user) return null;

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        return { id: String(user.id), name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
});

/** Session user or null. */
export async function getSessionUser() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return { id: Number(session.user.id), name: session.user.name ?? "", email: session.user.email ?? "", role: session.user.role };
}

/** Throws if not signed in. Optionally requires the admin role. */
export async function requireUser(role?: "admin") {
  const user = await getSessionUser();
  if (!user) throw new Error("Not authenticated");
  if (role && user.role !== role) throw new Error("Not authorised");
  return user;
}
