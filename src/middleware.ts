import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

/** Protects /admin (except /admin/login) using the edge-safe config. */
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: ["/admin/:path*"],
};
