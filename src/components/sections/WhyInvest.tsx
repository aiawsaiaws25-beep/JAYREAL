import Image from "next/image";
import { AnimatedGroup, AnimatedItem, AnimatedSection } from "@/components/ui/AnimatedSection";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { IMAGES } from "@/db/seed-data";

const reasons = [
  {
    stat: "0%",
    title: "Tax-Free Ownership",
    body: "No income tax, no capital gains tax and no annual property tax on residential ownership. Your rental income stays yours.",
  },
  {
    stat: "6–9%",
    title: "Strong Rental Yields",
    body: "Gross yields in established communities regularly outperform London, New York and Singapore, with a deep tenant market.",
  },
  {
    stat: "10 yr",
    title: "Golden Visa Eligibility",
    body: "Property investment from AED 2 million qualifies you and your family for the UAE's renewable 10-year Golden Visa.",
  },
  {
    stat: "100%",
    title: "Freehold for All Nationalities",
    body: "Foreign investors enjoy full freehold ownership in designated areas, with transparent registration through the Dubai Land Department.",
  },
];

export function WhyInvest() {
  return (
    <section className="bg-charcoal py-section text-white md:py-section-lg">
      <Container size="wide">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
          <AnimatedSection className="lg:col-span-5">
            <SectionLabel>Why Dubai</SectionLabel>
            <SectionTitle tone="light">Why Invest in Dubai</SectionTitle>
            <p className="mt-8 max-w-md text-sm font-light leading-relaxed text-white/65 md:text-base">
              A global city with a stable currency, world-class infrastructure and a regulatory framework built to protect
              buyers. Dubai continues to attract capital, talent and residents from every corner of the world.
            </p>
            <div className="relative mt-12 aspect-[4/3] overflow-hidden">
              <Image src={IMAGES.downtown} alt="Downtown Dubai at dusk" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            </div>
          </AnimatedSection>

          <AnimatedGroup className="grid gap-px bg-white/10 sm:grid-cols-2 lg:col-span-7" stagger={0.1}>
            {reasons.map((r) => (
              <AnimatedItem key={r.title} className="bg-charcoal p-8 md:p-10">
                <p className="font-serif text-5xl font-light text-gold md:text-6xl">{r.stat}</p>
                <span className="gold-line my-5" />
                <h3 className="font-serif text-2xl font-light">{r.title}</h3>
                <p className="mt-3 text-sm font-light leading-relaxed text-white/60">{r.body}</p>
              </AnimatedItem>
            ))}
          </AnimatedGroup>
        </div>
      </Container>
    </section>
  );
}
