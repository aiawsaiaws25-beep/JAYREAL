import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { AnimatedGroup, AnimatedItem, AnimatedSection } from "@/components/ui/AnimatedSection";
import { LeadForm } from "@/components/forms/LeadForm";
import { IMAGES } from "@/db/seed-data";

export const metadata: Metadata = {
  title: "Sell Your Property in Dubai",
  description: "Request a confidential valuation of your Dubai property from Jay Real Estate. Discreet marketing to qualified buyers.",
  alternates: { canonical: "/sell-your-property" },
  openGraph: { title: "Sell Your Property in Dubai", description: "Request a confidential valuation of your Dubai property from Jay Real Estate. Discreet marketing to qualified buyers.", url: "/sell-your-property" },
};

const steps = [
  { n: "01", title: "Valuation", body: "We assess recent transactions, current competition and the specifics of your home to agree a realistic asking price." },
  { n: "02", title: "Presentation", body: "Professional photography, floor plans and a considered listing across our channels and private buyer network." },
  { n: "03", title: "Qualified Buyers", body: "Every viewing is with a vetted buyer. We handle negotiation, the MOU and the transfer at the trustee office." },
];

export default function SellPage() {
  return (
    <>
      <PageHero
        label="Sell"
        title="Sell Your Property"
        subtitle="A confidential valuation and a discreet sale to the right buyer."
        image={IMAGES.villa5}
        imageAlt="Villa with pool at dusk"
        size="sm"
      />

      <section className="bg-white py-section md:py-section-lg">
        <Container size="wide">
          <AnimatedSection className="max-w-2xl">
            <SectionLabel>How It Works</SectionLabel>
            <SectionTitle>From Valuation to Transfer</SectionTitle>
          </AnimatedSection>
          <AnimatedGroup className="mt-16 grid gap-12 md:grid-cols-3" stagger={0.1}>
            {steps.map((s) => (
              <AnimatedItem key={s.n}>
                <p className="font-serif text-5xl font-light text-gold">{s.n}</p>
                <span className="gold-line my-5" />
                <h3 className="font-serif text-2xl font-light text-charcoal">{s.title}</h3>
                <p className="mt-3 text-sm font-light leading-relaxed text-warmgray">{s.body}</p>
              </AnimatedItem>
            ))}
          </AnimatedGroup>
        </Container>
      </section>

      <section className="bg-offwhite py-section md:py-section-lg">
        <Container size="wide">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <AnimatedSection className="lg:col-span-5">
              <SectionLabel>Valuation</SectionLabel>
              <SectionTitle>Request a Valuation</SectionTitle>
              <p className="mt-8 max-w-md text-sm font-light leading-relaxed text-warmgray md:text-base">
                Tell us about your property and we will prepare a written valuation with comparable sales, at no cost and
                with no obligation.
              </p>
            </AnimatedSection>
            <AnimatedSection className="lg:col-span-7" delay={0.1}>
              <LeadForm
                source="valuation"
                fields={["propertyType", "community", "bedrooms", "areaSqft", "timeline", "message"]}
                messagePlaceholder="Anything else we should know, e.g. upgrades, view, tenancy status"
                submitLabel="Request Valuation"
                successTitle="Valuation requested"
              />
            </AnimatedSection>
          </div>
        </Container>
      </section>
    </>
  );
}
