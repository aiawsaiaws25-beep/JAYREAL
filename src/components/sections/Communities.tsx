import Image from "next/image";
import Link from "next/link";
import { AnimatedGroup, AnimatedItem, AnimatedSection } from "@/components/ui/AnimatedSection";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { COMMUNITIES } from "@/db/seed-data";
import { cn } from "@/lib/utils";

export function Communities() {
  return (
    <section className="bg-white py-section md:py-section-lg">
      <Container size="wide">
        <AnimatedSection className="max-w-2xl">
          <SectionLabel>Communities</SectionLabel>
          <SectionTitle>Where You Could Live</SectionTitle>
        </AnimatedSection>

        <AnimatedGroup className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
          {COMMUNITIES.map((c, i) => (
            <AnimatedItem key={c.slug} className={cn(i === 0 && "sm:col-span-2 lg:col-span-2")}>
              <Link
                href={`/properties?community=${encodeURIComponent(c.name)}`}
                className={cn("group relative block overflow-hidden bg-offwhite", i === 0 ? "aspect-[16/9] sm:aspect-[2/1]" : "aspect-[4/3]")}
              >
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-[1600ms] ease-[var(--ease-luxury)] group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" aria-hidden />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-8">
                  <span className="gold-line mb-4 w-8 transition-all duration-500 group-hover:w-14" />
                  <h3 className="font-serif text-2xl font-light md:text-3xl">{c.name}</h3>
                  <p className="mt-1 text-xs font-light text-white/70">{c.blurb}</p>
                </div>
              </Link>
            </AnimatedItem>
          ))}
        </AnimatedGroup>
      </Container>
    </section>
  );
}
