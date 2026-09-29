import Link from "next/link";
import { PageTitle, Panel } from "@/components/admin/ui";

export default function AdminNotFound() {
  return (
    <div className="space-y-8">
      <PageTitle label="404" title="Not Found" />
      <Panel>
        <p className="text-sm font-light leading-relaxed text-warmgray">This record does not exist or you do not have access to it.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/admin/leads" className="label inline-flex items-center border border-charcoal bg-charcoal px-6 py-3 text-[0.65rem] text-white transition-colors hover:border-gold hover:bg-gold">
            Leads
          </Link>
          <Link href="/admin" className="label inline-flex items-center border border-charcoal px-6 py-3 text-[0.65rem] text-charcoal transition-colors hover:bg-charcoal hover:text-white">
            Dashboard
          </Link>
        </div>
      </Panel>
    </div>
  );
}
