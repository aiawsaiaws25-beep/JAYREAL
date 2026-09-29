import { AnimatedGroup, AnimatedItem, AnimatedSection } from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PropertyCard } from "@/components/ui/PropertyCard";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getFeaturedProperties } from "@/lib/queries";
import { formatNumber, titleCase } from "@/lib/utils";

export async function FeaturedProperties() {
  const items = await getFeaturedProperties(6);

  return (
    <section className="bg-white py-section md:py-section-lg">
      <Container size="wide">
        <AnimatedSection className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel>Discover</SectionLabel>
            <SectionTitle>Featured Properties</SectionTitle>
          </div>
          <p className="max-w-md text-sm font-light leading-relaxed text-warmgray md:text-base">
            A curated selection of ready homes across Dubai&apos;s most desirable addresses.
          </p>
        </AnimatedSection>

        <AnimatedGroup className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          {items.map((p) => (
            <AnimatedItem key={p.id}>
              <PropertyCard
                name={p.title}
                community={p.community}
                startingPrice={p.priceAed}
                pricePrefix=""
                image={p.imageUrl}
                href={`/properties/${p.slug}`}
                type={titleCase(p.listingType)}
                meta={`${p.bedrooms === 0 ? "Studio" : `${p.bedrooms} bed`} · ${p.bathrooms} bath · ${formatNumber(p.areaSqft)} sq ft`}
              />
            </AnimatedItem>
          ))}
        </AnimatedGroup>

        <AnimatedSection className="mt-16 flex justify-center md:mt-20">
          <Button href="/properties" variant="outline-dark">
            View All Properties
          </Button>
        </AnimatedSection>
      </Container>
    </section>
  );
}
