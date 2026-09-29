import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { PropertyCard } from "@/components/ui/PropertyCard";
import { AnimatedGroup, AnimatedItem } from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/Button";
import { PropertyFilters } from "@/components/sections/PropertyFilters";
import { getCommunities, getProperties, type PropertyFilters as Filters } from "@/lib/queries";
import { IMAGES } from "@/db/seed-data";
import { PROPERTY_TYPES } from "@/lib/validations";
import { formatNumber, titleCase } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Properties for Sale in Dubai",
  description: "Browse ready and off-plan apartments, villas, townhouses and penthouses for sale across Dubai's finest communities.",
  alternates: { canonical: "/properties" },
  openGraph: { title: "Properties for Sale in Dubai", description: "Browse ready and off-plan apartments, villas, townhouses and penthouses for sale across Dubai's finest communities.", url: "/properties" },
};

type SearchParams = Record<string, string | string[] | undefined>;

function parseFilters(sp: SearchParams): Filters {
  const one = (k: string) => (Array.isArray(sp[k]) ? sp[k]?.[0] : sp[k]) || undefined;
  const num = (k: string) => {
    const v = one(k);
    if (v === undefined) return undefined;
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  };
  const type = one("type");
  const listingType = one("listingType");
  const sort = one("sort");
  return {
    q: one("q"),
    listingType: listingType === "ready" || listingType === "off-plan" ? listingType : undefined,
    type: PROPERTY_TYPES.includes(type as (typeof PROPERTY_TYPES)[number]) ? (type as Filters["type"]) : undefined,
    community: one("community"),
    bedrooms: num("bedrooms"),
    minPrice: num("minPrice"),
    maxPrice: num("maxPrice"),
    sort: sort === "price-asc" || sort === "price-desc" ? sort : "newest",
  };
}

export default async function PropertiesPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const filters = parseFilters(await searchParams);
  const [items, communities] = await Promise.all([getProperties(filters), getCommunities()]);

  const heading = filters.community ? `Homes in ${filters.community}` : filters.listingType === "off-plan" ? "Off-Plan Homes" : "Properties for Sale";

  return (
    <>
      <PageHero
        label="Properties"
        title={heading}
        subtitle="Apartments, villas, townhouses and penthouses, ready to move in or under development."
        image={IMAGES.marina}
        imageAlt="Dubai Marina towers"
        size="sm"
      />

      <section className="bg-white py-16 md:py-24">
        <Container size="wide">
          <PropertyFilters filters={filters} communities={communities} />

          <div className="mt-10 flex items-baseline justify-between">
            <p className="label text-warmgray">
              {items.length} {items.length === 1 ? "property" : "properties"}
            </p>
          </div>

          {items.length === 0 ? (
            <div className="mt-16 border border-line px-8 py-20 text-center">
              <span className="gold-line mx-auto mb-6" />
              <h2 className="font-serif text-3xl font-light text-charcoal">No properties match your search</h2>
              <p className="mt-4 text-sm font-light text-warmgray">Adjust your filters or register your interest and we will source options privately.</p>
              <div className="mt-8 flex justify-center gap-4">
                <Button href="/properties" variant="outline-dark">
                  Clear Filters
                </Button>
                <Button href="/#register-interest">Register Interest</Button>
              </div>
            </div>
          ) : (
            <AnimatedGroup className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12" stagger={0.06}>
              {items.map((p) => (
                <AnimatedItem key={p.id}>
                  <PropertyCard
                    name={p.title}
                    community={p.community}
                    startingPrice={p.priceAed}
                    pricePrefix=""
                    image={p.imageUrl}
                    href={`/properties/${p.slug}`}
                    type={p.status === "available" ? titleCase(p.listingType) : titleCase(p.status)}
                    meta={`${p.bedrooms === 0 ? "Studio" : `${p.bedrooms} bed`} · ${p.bathrooms} bath · ${formatNumber(p.areaSqft)} sq ft · ${titleCase(p.type)}`}
                  />
                </AnimatedItem>
              ))}
            </AnimatedGroup>
          )}
        </Container>
      </section>
    </>
  );
}
