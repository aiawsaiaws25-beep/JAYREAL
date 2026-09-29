import type { MetadataRoute } from "next";
import { getProjects, getProperties } from "@/lib/queries";
import { siteConfig } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/properties`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/projects`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/mortgage-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/sell-your-property`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  try {
    const [properties, projects] = await Promise.all([getProperties(), getProjects()]);
    return [
      ...staticRoutes,
      ...properties.map((p) => ({ url: `${base}/properties/${p.slug}`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 })),
      ...projects.map((p) => ({ url: `${base}/projects/${p.slug}`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 })),
    ];
  } catch {
    return staticRoutes;
  }
}
