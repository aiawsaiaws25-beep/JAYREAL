import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { requireUser } from "@/auth";
import { adminListProjects } from "@/lib/admin-queries";
import { AdminLink, EmptyState, PageTitle, Panel, Table, Td, Th } from "@/components/admin/ui";
import { formatDate, titleCase } from "@/lib/utils";

export const metadata: Metadata = { title: "Projects" };

export default async function AdminProjectsPage() {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/admin");
  const rows = await adminListProjects();

  return (
    <div className="space-y-8">
      <PageTitle label={`${rows.length} projects`} title="Projects">
        <AdminLink href="/admin/projects/new" variant="dark" size="sm">
          New project
        </AdminLink>
      </PageTitle>
      <Panel padded={false}>
        {rows.length === 0 ? (
          <EmptyState>No projects yet.</EmptyState>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Project</Th>
                <Th>Developer</Th>
                <Th>Community</Th>
                <Th>Status</Th>
                <Th>Handover</Th>
                <Th>Payment plan</Th>
                <Th>Units</Th>
                <Th />
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className="transition-colors hover:bg-offwhite">
                  <Td>
                    <Link href={`/admin/projects/${p.id}`} className="font-normal text-charcoal hover:text-gold">
                      {p.name}
                    </Link>
                  </Td>
                  <Td className="text-xs text-warmgray">{p.developer?.name ?? "—"}</Td>
                  <Td className="text-xs text-warmgray">{p.community}</Td>
                  <Td>{titleCase(p.status)}</Td>
                  <Td>{formatDate(p.handoverDate, { month: "short", year: "numeric" })}</Td>
                  <Td>{p.paymentPlan ?? "—"}</Td>
                  <Td>{p.units}</Td>
                  <Td className="text-right">
                    <Link href={`/projects/${p.slug}`} target="_blank" className="label text-[0.55rem] text-warmgray hover:text-gold">
                      View
                    </Link>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Panel>
    </div>
  );
}
