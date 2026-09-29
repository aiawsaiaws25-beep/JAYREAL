import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe Auth.js config: no database or bcrypt imports.
 * Used by middleware for session checks; providers are attached in src/auth.ts.
 */
export const authConfig = {
  pages: { signIn: "/admin/login" },
  session: { strategy: "jwt", maxAge: 60 * 60 * 12 },
  trustHost: true,
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isLogin = pathname === "/admin/login";
      const isAdminArea = pathname.startsWith("/admin");
      const loggedIn = Boolean(auth?.user);

      if (isLogin) {
        return loggedIn ? Response.redirect(new URL("/admin", request.nextUrl)) : true;
      }
      if (isAdminArea) return loggedIn; // false -> redirect to pages.signIn
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name;
      }
      return token;
    },
    session({ session, token }) {
      if (token) {
        session.user.id = String(token.id);
        session.user.role = token.role as "admin" | "agent";
        session.user.name = (token.name as string) ?? session.user.name;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
