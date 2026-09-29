import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { LeadForm } from "@/components/forms/LeadForm";
import { IMAGES } from "@/db/seed-data";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Speak to Jay Real Estate about buying, selling or investing in Dubai property.",
  alternates: { canonical: "/contact" },
  openGraph: { title: "Contact", description: "Speak to Jay Real Estate about buying, selling or investing in Dubai property.", url: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero label="Contact" title="Let Us Talk" subtitle="Call, write or visit. We reply to every enquiry within one working day." image={IMAGES.skyline} imageAlt="Dubai skyline" size="sm" />

      <section className="bg-white py-section md:py-section-lg">
        <Container size="wide">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <AnimatedSection className="lg:col-span-5">
              <SectionLabel>Get in Touch</SectionLabel>
              <SectionTitle>Our Office</SectionTitle>
              <dl className="mt-10 space-y-6 text-sm font-light">
                <div>
                  <dt className="label text-[0.6rem] text-warmgray">Address</dt>
                  <dd className="mt-1 text-charcoal">{siteConfig.address}</dd>
                </div>
                <div>
                  <dt className="label text-[0.6rem] text-warmgray">Phone</dt>
                  <dd className="mt-1 text-charcoal">{siteConfig.phone}</dd>
                </div>
                <div>
                  <dt className="label text-[0.6rem] text-warmgray">Email</dt>
                  <dd className="mt-1 text-charcoal">{siteConfig.email}</dd>
                </div>
                <div>
                  <dt className="label text-[0.6rem] text-warmgray">Hours</dt>
                  <dd className="mt-1 text-charcoal">Monday to Saturday, 9am to 7pm</dd>
                </div>
              </dl>
            </AnimatedSection>
            <AnimatedSection className="lg:col-span-7" delay={0.1}>
              <LeadForm
                source="form"
                fields={["message"]}
                messagePlaceholder="How can we help?"
                submitLabel="Send Message"
                successTitle="Message received"
              />
            </AnimatedSection>
          </div>
        </Container>
      </section>
    </>
  );
}
