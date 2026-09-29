import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { MortgageCalculator } from "@/components/sections/MortgageCalculator";
import { LeadForm } from "@/components/forms/LeadForm";
import { IMAGES } from "@/db/seed-data";

export const metadata: Metadata = {
  title: "Dubai Mortgage Calculator",
  description: "Estimate your monthly mortgage payment and upfront purchase costs for a Dubai property, then speak to an advisor.",
  alternates: { canonical: "/mortgage-calculator" },
  openGraph: { title: "Dubai Mortgage Calculator", description: "Estimate your monthly mortgage payment and upfront purchase costs for a Dubai property, then speak to an advisor.", url: "/mortgage-calculator" },
};

export default function MortgageCalculatorPage() {
  return (
    <>
      <PageHero
        label="Finance"
        title="Mortgage Calculator"
        subtitle="Estimate your monthly repayment and the upfront costs of buying in Dubai."
        image={IMAGES.downtown}
        imageAlt="Downtown Dubai"
        size="sm"
      />

      <section className="bg-white py-section md:py-section-lg">
        <Container size="wide">
          <AnimatedSection>
            <MortgageCalculator />
          </AnimatedSection>
        </Container>
      </section>

      <section className="bg-offwhite py-section md:py-section-lg">
        <Container size="wide">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <AnimatedSection className="lg:col-span-5">
              <SectionLabel>Mortgage Advice</SectionLabel>
              <SectionTitle>Speak to an Advisor</SectionTitle>
              <p className="mt-8 max-w-md text-sm font-light leading-relaxed text-warmgray md:text-base">
                Our partners compare rates across UAE banks for residents and non-residents, and arrange pre-approval
                before you view. Leave your details and we will call to discuss your options.
              </p>
            </AnimatedSection>
            <AnimatedSection className="lg:col-span-7" delay={0.1}>
              <LeadForm
                source="mortgage_calc"
                fields={["buyerType", "budget", "timeline", "message"]}
                defaultValues={{ financeType: "mortgage" }}
                messagePlaceholder="Tell us about your situation, e.g. resident or non-resident, salaried or self-employed"
                submitLabel="Request a Call"
                successTitle="Request received"
              />
            </AnimatedSection>
          </div>
        </Container>
      </section>
    </>
  );
}
