import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { requireUser } from "@/auth";
import { adminGetProject, adminListDevelopers } from "@/lib/admin-queries";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { PageTitle, Panel } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Edit project" };

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/admin");
  const { id } = await params;
  const project = await adminGetProject(Number(id));
  if (!project) notFound();
  const developers = await adminListDevelopers();

  return (
    <div className="space-y-8">
      <PageTitle label="Projects" title={project.name}>
        <DeleteButton kind="project" id={project.id} label={project.name} />
      </PageTitle>
      <Panel>
        <ProjectForm project={project} developers={developers} />
      </Panel>
    </div>
  );
}
