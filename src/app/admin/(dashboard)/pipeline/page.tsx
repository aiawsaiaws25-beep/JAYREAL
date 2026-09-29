import type { Metadata } from "next";
import { requireUser } from "@/auth";
import { getPipeline, listAgents, listPropertyOptions } from "@/lib/admin-queries";
import { Kanban } from "@/components/admin/Kanban";
import { PageTitle } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Pipeline" };

export default async function PipelinePage() {
  const user = await requireUser();
  const [columns, properties, agents] = await Promise.all([getPipeline(user), listPropertyOptions(), listAgents()]);

  return (
    <div className="space-y-8">
      <PageTitle label="Kanban" title="Pipeline">
        <span className="label text-[0.55rem] text-warmgray">Drag a lead to change its stage</span>
      </PageTitle>
      <Kanban columns={columns} properties={properties} agents={agents.filter((a) => a.role === "agent" || a.id === user.id)} isAdmin={user.role === "admin"} />
    </div>
  );
}
