import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { PropertyCard } from "@/components/ui/PropertyCard";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Gallery } from "@/components/sections/Gallery";
import { LeadForm } from "@/components/forms/LeadForm";
import { getPropertyBySlug, getSimilarProperties } from "@/lib/queries";
import { GALLERY_FALLBACK } from "@/db/seed-data";
import { formatAED, formatNumber, titleCase } from "@/lib/utils";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) return { title: "Property not found" };
  const description = `${titleCase(property.type)} in ${property.community}, ${formatAED(property.priceAed)}. ${property.bedrooms} bedrooms, ${formatNumber(property.areaSqft)} sq ft.`;
  return {
    title: property.title,
    description,
    alternates: { canonical: `/properties/${property.slug}` },
    openGraph: {
      title: property.title,
      description,
      url: `/properties/${property.slug}`,
      images: property.imageUrl ? [{ url: property.imageUrl, width: 1600, height: 1067, alt: property.title }] : undefined,
    },
  };
}

export default async function PropertyPage({ params }: Params) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();

  const similar = await getSimilarProperties(property, 3);
  const images = [property.imageUrl, ...GALLERY_FALLBACK].filter((s): s is string => Boolean(s)).slice(0, 5);

  const specs = [
    { label: "Price", value: formatAED(property.priceAed) },
    { label: "Type", value: titleCase(property.type) },
    { label: "Bedrooms", value: property.bedrooms === 0 ? "Studio" : String(property.bedrooms) },
    { label: "Bathrooms", value: String(property.bathrooms) },
    { label: "Area", value: `${formatNumber(property.areaSqft)} sq ft` },
    { label: "Price per sq ft", value: formatAED(Math.round(property.priceAed / property.areaSqft)) },
    { label: "Listing", value: titleCase(property.listingType) },
    { label: "Status", value: titleCase(property.status) },
  ];

  return (
    <>
      {/* Spacer for the fixed header on a white page */}
      <div className="h-24 bg-white md:h-28" />

      <section className="bg-white pb-16 md:pb-24">
        <Container size="wide">
          <nav aria-label="Breadcrumb" className="label mb-8 flex flex-wrap gap-2 text-[0.6rem] text-warmgray">
            <Link href="/" className="transition-colors hover:text-gold">
              Home
            </Link>
            <span aria-hidden>/</span>
            <Link href="/properties" className="transition-colors hover:text-gold">
              Properties
            </Link>
            <span aria-hidden>/</span>
            <span className="text-charcoal">{property.community}</span>
          </nav>

          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-8">
              <Gallery images={images} alt={property.title} />
            </div>

            <aside className="lg:col-span-4">
              <SectionLabel>
                {titleCase(property.listingType)} &middot; {property.community}
              </SectionLabel>
              <h1 className="font-serif text-4xl font-light leading-[1.05] text-charcoal md:text-5xl">{property.title}</h1>
              <p className="mt-6 font-serif text-3xl font-light text-charcoal">{formatAED(property.priceAed)}</p>
              <p className="mt-2 text-sm font-light text-warmgray">
                {property.bedrooms === 0 ? "Studio" : `${property.bedrooms} bedrooms`} &middot; {property.bathrooms} bathrooms &middot;{" "}
                {formatNumber(property.areaSqft)} sq ft
              </p>

              {property.project && (
                <p className="mt-6 text-sm font-light text-warmgray">
                  Part of{" "}
                  <Link href={`/projects/${property.project.slug}`} className="text-charcoal underline decoration-gold underline-offset-4 transition-colors hover:text-gold">
                    {property.project.name}
                  </Link>
                  {property.project.developer ? ` by ${property.project.developer.name}` : ""}
                  {property.project.paymentPlan ? `, ${property.project.paymentPlan} payment plan` : ""}.
                </p>
              )}

              <div className="mt-10 flex flex-col gap-3">
                <a
                  href="#book-viewing"
                  className="inline-flex items-center justify-center border border-charcoal bg-charcoal px-7 py-3.5 text-[0.6875rem] font-normal uppercase tracking-[0.25em] text-white transition-all duration-500 hover:border-gold hover:bg-gold"
                >
                  Book a Viewing
                </a>
                <a
                  href="#enquire"
                  className="inline-flex items-center justify-center border border-charcoal bg-transparent px-7 py-3.5 text-[0.6875rem] font-normal uppercase tracking-[0.25em] text-charcoal transition-all duration-500 hover:bg-charcoal hover:text-white"
                >
                  Enquire
                </a>
              </div>

              <dl className="mt-12 border-t border-line">
                {specs.map((s) => (
                  <div key={s.label} className="flex items-baseline justify-between gap-6 border-b border-line py-3.5">
                    <dt className="label text-[0.6rem] text-warmgray">{s.label}</dt>
                    <dd className="text-sm font-light text-charcoal">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>
        </Container>
      </section>

      <section className="bg-offwhite py-section md:py-section-lg">
        <Container size="wide">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
            <AnimatedSection id="book-viewing" as="div" className="scroll-mt-28">
              <SectionLabel>Book a Viewing</SectionLabel>
              <SectionTitle size="md">See It in Person</SectionTitle>
              <p className="mt-6 max-w-md text-sm font-light leading-relaxed text-warmgray">
                Choose a preferred date and time. We will confirm availability and arrange a private viewing.
              </p>
              <div className="mt-10">
                <LeadForm
                  source="property_page"
                  propertyId={property.id}
                  fields={["preferredDate", "preferredTime"]}
                  submitLabel="Request Viewing"
                  successTitle="Viewing requested"
                />
              </div>
            </AnimatedSection>

            <AnimatedSection id="enquire" as="div" className="scroll-mt-28" delay={0.1}>
              <SectionLabel>Enquire</SectionLabel>
              <SectionTitle size="md">Ask About This Home</SectionTitle>
              <p className="mt-6 max-w-md text-sm font-light leading-relaxed text-warmgray">
                Questions on pricing, service charges, rental potential or payment terms. An advisor will reply within one working day.
              </p>
              <div className="mt-10">
                <LeadForm
                  source="property_page"
                  propertyId={property.id}
                  fields={["financeType", "message"]}
                  messagePlaceholder={`I am interested in ${property.title}`}
                  submitLabel="Send Enquiry"
                  successTitle="Enquiry received"
                />
              </div>
            </AnimatedSection>
          </div>
        </Container>
      </section>

      {similar.length > 0 && (
        <section className="bg-white py-section md:py-section-lg">
          <Container size="wide">
            <AnimatedSection>
              <SectionLabel>You May Also Like</SectionLabel>
              <SectionTitle>Similar Homes</SectionTitle>
            </AnimatedSection>
            <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
              {similar.map((p, i) => (
                <AnimatedSection key={p.id} delay={i * 0.08}>
                  <PropertyCard
                    name={p.title}
                    community={p.community}
                    startingPrice={p.priceAed}
                    pricePrefix=""
                    image={p.imageUrl}
                    href={`/properties/${p.slug}`}
                    type={titleCase(p.listingType)}
                  />
                </AnimatedSection>
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
