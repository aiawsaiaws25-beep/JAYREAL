import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireUser } from "@/auth";
import { adminListProjects } from "@/lib/admin-queries";
import { PropertyForm } from "@/components/admin/PropertyForm";
import { PageTitle, Panel } from "@/components/admin/ui";

export const metadata: Metadata = { title: "New property" };

export default async function NewPropertyPage() {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/admin");
  const projects = await adminListProjects();
  return (
    <div className="space-y-8">
      <PageTitle label="Properties" title="New Property" />
      <Panel>
        <PropertyForm property={null} projects={projects} />
      </Panel>
    </div>
  );
}
