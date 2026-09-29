import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { AnimatedGroup, AnimatedItem, AnimatedSection } from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/Button";
import { IMAGES } from "@/db/seed-data";

export const metadata: Metadata = {
  title: "About Jay Real Estate",
  description: "An independent Dubai brokerage specialising in luxury ready homes and off-plan investments, built on discretion and advice.",
  alternates: { canonical: "/about" },
  openGraph: { title: "About Jay Real Estate", description: "An independent Dubai brokerage specialising in luxury ready homes and off-plan investments, built on discretion and advice.", url: "/about" },
};

const values = [
  { title: "Independent", body: "We are not tied to any developer. Our advice is shaped by your objectives, not by allocations." },
  { title: "Discreet", body: "Many of our best homes are never publicly listed. Our clients value privacy, and so do we." },
  { title: "Rigorous", body: "Every project we recommend is checked for escrow compliance, developer track record and resale depth." },
  { title: "Present", body: "One advisor from first call to key handover, and beyond it for leasing, resale or portfolio reviews." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero label="About" title="Advice Before Sales" subtitle="An independent brokerage for buyers who expect more than a listing." image={IMAGES.palm} imageAlt="Palm Jumeirah" size="sm" />

      <section className="bg-white py-section md:py-section-lg">
        <Container size="wide">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <AnimatedSection className="lg:col-span-6">
              <SectionLabel>Our Story</SectionLabel>
              <SectionTitle>Built on Long Relationships</SectionTitle>
              <div className="mt-8 space-y-5 text-base font-light leading-relaxed text-warmgray">
                <p>
                  Jay Real Estate was founded to give buyers in Dubai what the market rarely offers: patient, independent
                  advice. We work with a deliberately small number of clients at a time, so every search gets the attention
                  it deserves.
                </p>
                <p>
                  Our team combines local market knowledge with international experience in finance and development. We
                  represent end-users searching for a family home and investors building a portfolio, and we are candid
                  about which opportunities suit each.
                </p>
              </div>
              <div className="mt-10">
                <Button href="/contact" variant="outline-dark">
                  Get in Touch
                </Button>
              </div>
            </AnimatedSection>
            <AnimatedSection className="relative aspect-[4/5] overflow-hidden bg-offwhite lg:col-span-6" delay={0.1}>
              <Image src={IMAGES.living1} alt="Bright modern living room" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            </AnimatedSection>
          </div>
        </Container>
      </section>

      <section className="bg-offwhite py-section md:py-section-lg">
        <Container size="wide">
          <AnimatedSection className="max-w-2xl">
            <SectionLabel>How We Work</SectionLabel>
            <SectionTitle>What You Can Expect</SectionTitle>
          </AnimatedSection>
          <AnimatedGroup className="mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-4" stagger={0.1}>
            {values.map((v) => (
              <AnimatedItem key={v.title}>
                <span className="gold-line mb-5" />
                <h3 className="font-serif text-2xl font-light text-charcoal">{v.title}</h3>
                <p className="mt-3 text-sm font-light leading-relaxed text-warmgray">{v.body}</p>
              </AnimatedItem>
            ))}
          </AnimatedGroup>
        </Container>
      </section>
    </>
  );
}
