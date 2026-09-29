"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  { label: "Dashboard", href: "/admin", exact: true },
  { label: "Pipeline", href: "/admin/pipeline" },
  { label: "Leads", href: "/admin/leads" },
  { label: "Viewings", href: "/admin/viewings" },
  { label: "Agents", href: "/admin/agents" },
  { label: "Properties", href: "/admin/properties", admin: true },
  { label: "Projects", href: "/admin/projects", admin: true },
];

export function AdminNav({ role, horizontal }: { role: "admin" | "agent"; horizontal?: boolean }) {
  const pathname = usePathname();
  const visible = items.filter((i) => !i.admin || role === "admin");

  return (
    <nav aria-label="Admin" className={cn(horizontal ? "flex gap-1 overflow-x-auto" : "flex flex-col py-4")}>
      {visible.map((item) => {
        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "label relative whitespace-nowrap text-[0.6rem] transition-colors duration-300",
              horizontal ? "px-3 py-2" : "px-6 py-3.5",
              active ? "text-charcoal" : "text-warmgray hover:text-charcoal",
              active && !horizontal && "before:absolute before:left-0 before:top-1/2 before:h-5 before:w-px before:-translate-y-1/2 before:bg-gold",
              active && horizontal && "border-b border-gold"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
