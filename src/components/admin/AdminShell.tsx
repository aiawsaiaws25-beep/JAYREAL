import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { NotificationBell } from "./NotificationBell";
import { AdminNav } from "./AdminNav";
import { AutoRefresh } from "./AutoRefresh";
import { logout } from "@/app/actions/auth";
import { getNewLeadNotifications } from "@/lib/admin-queries";
import { isLocalDatabase } from "@/db";

type User = { id: number; name: string; email: string; role: "admin" | "agent" };

export async function AdminShell({ user, children }: { user: User; children: React.ReactNode }) {
  const notifications = await getNewLeadNotifications(user);

  return (
    <div className="flex min-h-screen bg-offwhite text-charcoal">
      <AutoRefresh intervalMs={60_000} />

      <aside className="hidden w-60 shrink-0 flex-col border-r border-line bg-white lg:flex">
        <div className="border-b border-line px-6 py-7">
          <Logo variant="dark" size="sm" href="/admin" />
        </div>
        <AdminNav role={user.role} />
        <div className="mt-auto border-t border-line px-6 py-5">
          <Link href="/" className="label text-[0.55rem] text-warmgray transition-colors hover:text-gold">
            View website
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-line bg-white px-5 py-4 md:px-8">
          <div className="flex items-center gap-4 lg:hidden">
            <Logo variant="dark" size="sm" href="/admin" />
          </div>
          <div className="hidden lg:block">
            {isLocalDatabase() && <span className="label text-[0.55rem] text-warmgray">Local database (PGlite)</span>}
          </div>
          <div className="flex items-center gap-5">
            <NotificationBell count={notifications.count} latest={notifications.latest} />
            <div className="hidden text-right sm:block">
              <p className="text-sm font-light text-charcoal">{user.name}</p>
              <p className="label text-[0.5rem] text-warmgray">{user.role}</p>
            </div>
            <form action={logout}>
              <button type="submit" className="label border border-line px-3 py-2 text-[0.55rem] text-charcoal transition-colors hover:border-gold hover:text-gold">
                Sign out
              </button>
            </form>
          </div>
        </header>

        <div className="border-b border-line bg-white px-4 py-2 lg:hidden">
          <AdminNav role={user.role} horizontal />
        </div>

        <main className="flex-1 px-5 py-8 md:px-8 md:py-10">{children}</main>
      </div>
    </div>
  );
}
