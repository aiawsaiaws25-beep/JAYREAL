"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AdminButton, PageTitle, Panel } from "@/components/admin/ui";

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="space-y-8">
      <PageTitle label="Error" title="Something Went Wrong" />
      <Panel>
        <p className="text-sm font-light leading-relaxed text-warmgray">
          The page could not be loaded. Try again, or return to the dashboard.
          {error.digest && <span className="label mt-3 block text-[0.55rem]">Reference {error.digest}</span>}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <AdminButton onClick={reset}>Try again</AdminButton>
          <Link href="/admin" className="label inline-flex items-center border border-charcoal px-6 py-3 text-[0.65rem] text-charcoal transition-colors hover:bg-charcoal hover:text-white">
            Dashboard
          </Link>
        </div>
      </Panel>
    </div>
  );
}
