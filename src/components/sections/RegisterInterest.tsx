import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { LeadForm } from "@/components/forms/LeadForm";
import { siteConfig } from "@/lib/site";

export function RegisterInterest() {
  return (
    <section id="register-interest" className="scroll-mt-20 bg-offwhite py-section md:py-section-lg">
      <Container size="wide">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <AnimatedSection className="lg:col-span-5">
            <SectionLabel>Register Interest</SectionLabel>
            <SectionTitle>Let Us Find Your Home</SectionTitle>
            <p className="mt-8 max-w-md text-sm font-light leading-relaxed text-warmgray md:text-base">
              Tell us a little about what you are looking for. A dedicated advisor will curate a shortlist of ready and
              off-plan options, with pricing and availability, within one working day.
            </p>
            <dl className="mt-10 space-y-5 text-sm font-light">
              <div>
                <dt className="label text-[0.6rem] text-warmgray">Call</dt>
                <dd className="mt-1 text-charcoal">{siteConfig.phone}</dd>
              </div>
              <div>
                <dt className="label text-[0.6rem] text-warmgray">Email</dt>
                <dd className="mt-1 text-charcoal">{siteConfig.email}</dd>
              </div>
              <div>
                <dt className="label text-[0.6rem] text-warmgray">Office</dt>
                <dd className="mt-1 text-charcoal">{siteConfig.address}</dd>
              </div>
            </dl>
          </AnimatedSection>

          <AnimatedSection className="lg:col-span-7" delay={0.1}>
            <LeadForm
              source="form"
              fields={["buyerType", "financeType", "budget", "timeline", "message"]}
              submitLabel="Register Interest"
              successTitle="Thank you for registering"
            />
          </AnimatedSection>
        </div>
      </Container>
    </section>
  );
}
