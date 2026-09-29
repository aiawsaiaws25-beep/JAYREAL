"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveProject, type ActionResult } from "@/app/actions/admin";
import { AdminButton, Field, inputClass, selectClass } from "./ui";
import type { Developer, Project } from "@/db/schema";

export function ProjectForm({ project, developers }: { project: Project | null; developers: Developer[] }) {
  const router = useRouter();
  const [result, setResult] = useState<ActionResult | null>(null);
  const [pending, start] = useTransition();
  const err = (k: string) => (result && !result.ok ? result.fieldErrors?.[k] : undefined);
  const handover = project?.handoverDate ? new Date(project.handoverDate).toISOString().slice(0, 10) : "";

  return (
    <form
      action={(fd) =>
        start(async () => {
          const r = await saveProject(project?.id ?? null, fd);
          setResult(r);
          if (r.ok) router.push("/admin/projects");
        })
      }
      className="grid gap-6 md:grid-cols-2"
    >
      <Field label="Name" htmlFor="name" error={err("name")} className="md:col-span-2">
        <input id="name" name="name" defaultValue={project?.name ?? ""} className={inputClass} required />
      </Field>
      <Field label="Slug" htmlFor="slug" error={err("slug")}>
        <input id="slug" name="slug" defaultValue={project?.slug ?? ""} placeholder="marina-horizon-residences" className={inputClass} required />
      </Field>
      <Field label="Community" htmlFor="community" error={err("community")}>
        <input id="community" name="community" defaultValue={project?.community ?? ""} className={inputClass} required />
      </Field>
      <Field label="Developer" htmlFor="developerId" error={err("developerId")}>
        <select id="developerId" name="developerId" defaultValue={project?.developerId ?? ""} className={selectClass}>
          <option value="">None</option>
          {developers.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Status" htmlFor="status" error={err("status")}>
        <select id="status" name="status" defaultValue={project?.status ?? "off-plan"} className={selectClass}>
          <option value="off-plan">Off-plan</option>
          <option value="under-construction">Under construction</option>
          <option value="ready">Ready</option>
        </select>
      </Field>
      <Field label="Handover date" htmlFor="handoverDate" error={err("handoverDate")}>
        <input id="handoverDate" name="handoverDate" type="date" defaultValue={handover} className={inputClass} />
      </Field>
      <Field label="Payment plan" htmlFor="paymentPlan" error={err("paymentPlan")}>
        <input id="paymentPlan" name="paymentPlan" defaultValue={project?.paymentPlan ?? ""} placeholder="60/40" className={inputClass} />
      </Field>
      <Field label="Image URL" htmlFor="imageUrl" error={err("imageUrl")} className="md:col-span-2">
        <input id="imageUrl" name="imageUrl" type="url" defaultValue={project?.imageUrl ?? ""} className={inputClass} />
      </Field>
      <Field label="Description" htmlFor="description" error={err("description")} className="md:col-span-2">
        <textarea id="description" name="description" rows={5} defaultValue={project?.description ?? ""} className={inputClass + " resize-y"} />
      </Field>
      <div className="flex items-center gap-4 md:col-span-2">
        <AdminButton type="submit" disabled={pending}>
          {pending ? "Saving" : project ? "Save changes" : "Create project"}
        </AdminButton>
        {result && !result.ok && (
          <p className="text-xs font-light text-gold" role="alert">
            {result.message}
          </p>
        )}
      </div>
    </form>
  );
}
