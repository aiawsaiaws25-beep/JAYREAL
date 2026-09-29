import { AnimatedGroup, AnimatedItem, AnimatedSection } from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getProjectStartingPrices, getProjects } from "@/lib/queries";

export async function FeaturedProjects() {
  const [projects, prices] = await Promise.all([getProjects(4), getProjectStartingPrices()]);

  return (
    <section className="bg-offwhite py-section md:py-section-lg">
      <Container size="wide">
        <AnimatedSection className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel>Off-Plan Projects</SectionLabel>
            <SectionTitle>New Launches</SectionTitle>
          </div>
          <p className="max-w-md text-sm font-light leading-relaxed text-warmgray md:text-base">
            Flexible payment plans and early pricing from Dubai&apos;s leading developers.
          </p>
        </AnimatedSection>

        <AnimatedGroup className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {projects.map((p) => (
            <AnimatedItem key={p.id}>
              <ProjectCard project={p} startingPrice={prices[p.id]} />
            </AnimatedItem>
          ))}
        </AnimatedGroup>

        <AnimatedSection className="mt-16 flex justify-center md:mt-20">
          <Button href="/projects" variant="outline-dark">
            View All Projects
          </Button>
        </AnimatedSection>
      </Container>
    </section>
  );
}
