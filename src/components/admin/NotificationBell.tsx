"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { ScoreBadge, SourceLabel, timeAgo } from "./ui";
import { cn, formatAEDShort } from "@/lib/utils";

type Item = { id: number; fullName: string; source: string; score: number; createdAt: Date; expectedValueAed: number | null };

export function NotificationBell({ count, latest }: { count: number; latest: Item[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={`${count} new leads`}
        aria-expanded={open}
        className="relative flex h-10 w-10 items-center justify-center border border-line text-charcoal transition-colors hover:border-gold"
      >
        <Bell size={16} strokeWidth={1.25} />
        {count > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center bg-gold px-1 text-[0.6rem] font-normal tabular-nums text-white">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-40 w-80 border border-line bg-white shadow-[0_20px_50px_-24px_rgba(26,26,26,0.35)]">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <p className="label text-[0.55rem] text-charcoal">New leads</p>
            <span className="label text-[0.55rem] text-warmgray">{count} unread</span>
          </div>
          {latest.length === 0 ? (
            <p className="px-4 py-8 text-center text-xs font-light text-warmgray">You are up to date.</p>
          ) : (
            <ul className="max-h-96 overflow-y-auto">
              {latest.map((l) => (
                <li key={l.id} className="border-b border-line last:border-b-0">
                  <Link href={`/admin/leads/${l.id}`} onClick={() => setOpen(false)} className={cn("block px-4 py-3 transition-colors hover:bg-offwhite")}>
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate text-sm font-normal text-charcoal">{l.fullName}</p>
                      <ScoreBadge score={l.score} />
                    </div>
                    <div className="mt-1 flex items-center justify-between gap-3 text-xs font-light text-warmgray">
                      <SourceLabel source={l.source} />
                      <span>
                        {l.expectedValueAed ? `${formatAEDShort(l.expectedValueAed)} · ` : ""}
                        {timeAgo(l.createdAt)}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <div className="border-t border-line px-4 py-3">
            <Link href="/admin/leads?stage=new" onClick={() => setOpen(false)} className="label text-[0.55rem] text-charcoal transition-colors hover:text-gold">
              View all new leads
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
