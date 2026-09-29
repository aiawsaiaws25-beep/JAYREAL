import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { requireUser } from "@/auth";
import { adminGetProperty, adminListProjects } from "@/lib/admin-queries";
import { PropertyForm } from "@/components/admin/PropertyForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { PageTitle, Panel } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Edit property" };

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/admin");
  const { id } = await params;
  const property = await adminGetProperty(Number(id));
  if (!property) notFound();
  const projects = await adminListProjects();

  return (
    <div className="space-y-8">
      <PageTitle label="Properties" title={property.title}>
        <DeleteButton kind="property" id={property.id} label={property.title} />
      </PageTitle>
      <Panel>
        <PropertyForm property={property} projects={projects} />
      </Panel>
    </div>
  );
}
