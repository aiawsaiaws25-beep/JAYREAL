"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveProperty, type ActionResult } from "@/app/actions/admin";
import { AdminButton, Field, inputClass, selectClass } from "./ui";
import type { Property } from "@/db/schema";

type ProjectOption = { id: number; name: string };

export function PropertyForm({ property, projects }: { property: Property | null; projects: ProjectOption[] }) {
  const router = useRouter();
  const [result, setResult] = useState<ActionResult | null>(null);
  const [pending, start] = useTransition();
  const err = (k: string) => (result && !result.ok ? result.fieldErrors?.[k] : undefined);

  return (
    <form
      action={(fd) =>
        start(async () => {
          const r = await saveProperty(property?.id ?? null, fd);
          setResult(r);
          if (r.ok) router.push("/admin/properties");
        })
      }
      className="grid gap-6 md:grid-cols-2"
    >
      <Field label="Title" htmlFor="title" error={err("title")} className="md:col-span-2">
        <input id="title" name="title" defaultValue={property?.title ?? ""} className={inputClass} required />
      </Field>
      <Field label="Slug" htmlFor="slug" error={err("slug")}>
        <input id="slug" name="slug" defaultValue={property?.slug ?? ""} placeholder="marina-gate-2br-sea-view" className={inputClass} required />
      </Field>
      <Field label="Community" htmlFor="community" error={err("community")}>
        <input id="community" name="community" defaultValue={property?.community ?? ""} className={inputClass} required />
      </Field>
      <Field label="Listing type" htmlFor="listingType" error={err("listingType")}>
        <select id="listingType" name="listingType" defaultValue={property?.listingType ?? "ready"} className={selectClass}>
          <option value="ready">Ready</option>
          <option value="off-plan">Off-plan</option>
        </select>
      </Field>
      <Field label="Project" htmlFor="projectId" error={err("projectId")}>
        <select id="projectId" name="projectId" defaultValue={property?.projectId ?? ""} className={selectClass}>
          <option value="">None</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Type" htmlFor="type" error={err("type")}>
        <select id="type" name="type" defaultValue={property?.type ?? "apartment"} className={selectClass}>
          <option value="apartment">Apartment</option>
          <option value="villa">Villa</option>
          <option value="townhouse">Townhouse</option>
          <option value="penthouse">Penthouse</option>
        </select>
      </Field>
      <Field label="Status" htmlFor="status" error={err("status")}>
        <select id="status" name="status" defaultValue={property?.status ?? "available"} className={selectClass}>
          <option value="available">Available</option>
          <option value="reserved">Reserved</option>
          <option value="sold">Sold</option>
        </select>
      </Field>
      <Field label="Price (AED)" htmlFor="priceAed" error={err("priceAed")}>
        <input id="priceAed" name="priceAed" type="number" min={1} step={1} defaultValue={property?.priceAed ?? ""} className={inputClass} required />
      </Field>
      <Field label="Area (sq ft)" htmlFor="areaSqft" error={err("areaSqft")}>
        <input id="areaSqft" name="areaSqft" type="number" min={1} defaultValue={property?.areaSqft ?? ""} className={inputClass} required />
      </Field>
      <Field label="Bedrooms" htmlFor="bedrooms" error={err("bedrooms")}>
        <input id="bedrooms" name="bedrooms" type="number" min={0} defaultValue={property?.bedrooms ?? 0} className={inputClass} required />
      </Field>
      <Field label="Bathrooms" htmlFor="bathrooms" error={err("bathrooms")}>
        <input id="bathrooms" name="bathrooms" type="number" min={0} defaultValue={property?.bathrooms ?? 0} className={inputClass} required />
      </Field>
      <Field label="Image URL" htmlFor="imageUrl" error={err("imageUrl")} className="md:col-span-2">
        <input id="imageUrl" name="imageUrl" type="url" defaultValue={property?.imageUrl ?? ""} placeholder="https://images.unsplash.com/..." className={inputClass} />
      </Field>
      <label className="flex items-center gap-3 text-sm font-light text-charcoal md:col-span-2">
        <input type="checkbox" name="featured" defaultChecked={property?.featured ?? false} className="h-4 w-4 accent-[#b8975a]" />
        Featured on the home page
      </label>
      <div className="flex items-center gap-4 md:col-span-2">
        <AdminButton type="submit" disabled={pending}>
          {pending ? "Saving" : property ? "Save changes" : "Create property"}
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
