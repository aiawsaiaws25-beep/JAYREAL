import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireUser } from "@/auth";
import { adminListDevelopers } from "@/lib/admin-queries";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { PageTitle, Panel } from "@/components/admin/ui";

export const metadata: Metadata = { title: "New project" };

export default async function NewProjectPage() {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/admin");
  const developers = await adminListDevelopers();
  return (
    <div className="space-y-8">
      <PageTitle label="Projects" title="New Project" />
      <Panel>
        <ProjectForm project={null} developers={developers} />
      </Panel>
    </div>
  );
}
