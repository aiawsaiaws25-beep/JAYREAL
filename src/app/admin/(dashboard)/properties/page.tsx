import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { requireUser } from "@/auth";
import { adminListProperties } from "@/lib/admin-queries";
import { AdminLink, EmptyState, PageTitle, Panel, Table, Td, Th } from "@/components/admin/ui";
import { formatAED, formatNumber, titleCase } from "@/lib/utils";

export const metadata: Metadata = { title: "Properties" };

export default async function AdminPropertiesPage() {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/admin");
  const rows = await adminListProperties();

  return (
    <div className="space-y-8">
      <PageTitle label={`${rows.length} listings`} title="Properties">
        <AdminLink href="/admin/properties/new" variant="dark" size="sm">
          New property
        </AdminLink>
      </PageTitle>
      <Panel padded={false}>
        {rows.length === 0 ? (
          <EmptyState>No properties yet.</EmptyState>
        ) : (
          <Table className="min-w-[900px]">
            <thead>
              <tr>
                <Th>Title</Th>
                <Th>Community</Th>
                <Th>Type</Th>
                <Th>Listing</Th>
                <Th>Beds</Th>
                <Th>Area</Th>
                <Th>Price</Th>
                <Th>Status</Th>
                <Th>Featured</Th>
                <Th />
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className="transition-colors hover:bg-offwhite">
                  <Td>
                    <Link href={`/admin/properties/${p.id}`} className="font-normal text-charcoal hover:text-gold">
                      {p.title}
                    </Link>
                    {p.project && <div className="text-xs text-warmgray">{p.project.name}</div>}
                  </Td>
                  <Td className="text-xs text-warmgray">{p.community}</Td>
                  <Td>{titleCase(p.type)}</Td>
                  <Td>{titleCase(p.listingType)}</Td>
                  <Td>{p.bedrooms === 0 ? "Studio" : p.bedrooms}</Td>
                  <Td>{formatNumber(p.areaSqft)} sq ft</Td>
                  <Td className="tabular-nums">{formatAED(p.priceAed)}</Td>
                  <Td className={p.status === "sold" ? "text-warmgray" : p.status === "reserved" ? "text-gold" : undefined}>{titleCase(p.status)}</Td>
                  <Td>{p.featured ? "Yes" : "—"}</Td>
                  <Td className="text-right">
                    <Link href={`/properties/${p.slug}`} target="_blank" className="label text-[0.55rem] text-warmgray hover:text-gold">
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
