import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { AnimatedGroup, AnimatedItem, AnimatedSection } from "@/components/ui/AnimatedSection";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getProjectStartingPrices, getProjects } from "@/lib/queries";
import { IMAGES } from "@/db/seed-data";

export const metadata: Metadata = {
  title: "Off-Plan Projects in Dubai",
  description: "New launches and under-construction developments across Dubai with flexible payment plans and early pricing.",
  alternates: { canonical: "/projects" },
  openGraph: { title: "Off-Plan Projects in Dubai", description: "New launches and under-construction developments across Dubai with flexible payment plans and early pricing.", url: "/projects" },
};

export default async function ProjectsPage() {
  const [projects, prices] = await Promise.all([getProjects(), getProjectStartingPrices()]);

  return (
    <>
      <PageHero
        label="Off-Plan"
        title="New Developments"
        subtitle="Secure early pricing and flexible payment plans on Dubai's most anticipated launches."
        image={IMAGES.creek}
        imageAlt="Dubai skyline"
        size="sm"
      />

      <section className="bg-white py-section md:py-section-lg">
        <Container size="wide">
          <AnimatedSection className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <SectionLabel>Off-Plan Projects</SectionLabel>
              <SectionTitle>All Projects</SectionTitle>
            </div>
            <p className="max-w-md text-sm font-light leading-relaxed text-warmgray md:text-base">
              Every project is vetted for developer track record, escrow compliance and location fundamentals.
            </p>
          </AnimatedSection>

          <AnimatedGroup className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12" stagger={0.08}>
            {projects.map((p) => (
              <AnimatedItem key={p.id}>
                <ProjectCard project={p} startingPrice={prices[p.id]} />
              </AnimatedItem>
            ))}
          </AnimatedGroup>
        </Container>
      </section>
    </>
  );
}
