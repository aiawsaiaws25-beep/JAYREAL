import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { LeadForm } from "@/components/forms/LeadForm";
import { getProjectBySlug, getProjectUnits } from "@/lib/queries";
import { formatAED, formatDate, formatNumber, titleCase } from "@/lib/utils";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project not found" };
  const description = project.description?.slice(0, 160);
  return {
    title: `${project.name} | ${project.community}`,
    description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: project.name,
      description,
      url: `/projects/${project.slug}`,
      images: project.imageUrl ? [{ url: project.imageUrl, width: 1600, height: 1067, alt: project.name }] : undefined,
    },
  };
}

function paymentPlanSteps(plan: string | null): Array<{ label: string; value: string }> {
  if (!plan) return [];
  const m = plan.match(/^(\d+)\s*\/\s*(\d+)$/);
  if (m) {
    return [
      { label: "During construction", value: `${m[1]}%` },
      { label: "On handover", value: `${m[2]}%` },
    ];
  }
  return [{ label: "Payment plan", value: plan }];
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const units = await getProjectUnits(project.id);
  const available = units.filter((u) => u.status === "available");
  const startingPrice = units.length ? Math.min(...units.map((u) => u.priceAed)) : undefined;
  const plan = paymentPlanSteps(project.paymentPlan);

  const facts = [
    { label: "Developer", value: project.developer?.name ?? "TBA" },
    { label: "Community", value: project.community },
    { label: "Status", value: titleCase(project.status) },
    { label: "Handover", value: formatDate(project.handoverDate) },
    { label: "Payment plan", value: project.paymentPlan ?? "On request" },
    { label: "Starting from", value: startingPrice ? formatAED(startingPrice) : "On request" },
  ];

  return (
    <>
      <PageHero
        label={`${project.developer?.name ?? "Off-Plan"} · ${project.community}`}
        title={project.name}
        subtitle={`${titleCase(project.status)} · Handover ${formatDate(project.handoverDate)}${startingPrice ? ` · From ${formatAED(startingPrice)}` : ""}`}
        image={project.imageUrl ?? ""}
        imageAlt={project.name}
        size="lg"
      >
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a
            href="#brochure"
            className="inline-flex items-center justify-center border border-white bg-white px-7 py-3.5 text-[0.6875rem] font-normal uppercase tracking-[0.25em] text-charcoal transition-all duration-500 hover:border-charcoal hover:bg-charcoal hover:text-white"
          >
            Download Brochure
          </a>
          <a
            href="#units"
            className="inline-flex items-center justify-center border border-white bg-transparent px-7 py-3.5 text-[0.6875rem] font-normal uppercase tracking-[0.25em] text-white transition-all duration-500 hover:bg-white hover:text-charcoal"
          >
            Available Units
          </a>
        </div>
      </PageHero>

      {/* Overview */}
      <section className="bg-white py-section md:py-section-lg">
        <Container size="wide">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <AnimatedSection className="lg:col-span-7">
              <SectionLabel>The Project</SectionLabel>
              <SectionTitle>Overview</SectionTitle>
              <p className="mt-8 max-w-2xl text-base font-light leading-relaxed text-warmgray md:text-lg">{project.description}</p>
            </AnimatedSection>
            <AnimatedSection className="lg:col-span-5" delay={0.1}>
              <dl className="border-t border-line">
                {facts.map((f) => (
                  <div key={f.label} className="flex items-baseline justify-between gap-6 border-b border-line py-4">
                    <dt className="label text-[0.6rem] text-warmgray">{f.label}</dt>
                    <dd className="text-right text-sm font-light text-charcoal">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </AnimatedSection>
          </div>
        </Container>
      </section>

      {/* Payment plan + handover */}
      <section className="bg-charcoal py-section text-white md:py-section-lg">
        <Container size="wide">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <AnimatedSection className="lg:col-span-5">
              <SectionLabel>Payment Plan</SectionLabel>
              <SectionTitle tone="light">{project.paymentPlan ?? "Flexible"} Plan</SectionTitle>
              <p className="mt-8 max-w-md text-sm font-light leading-relaxed text-white/65 md:text-base">
                Instalments are paid to a regulated escrow account against construction milestones. Ask your advisor for the
                full schedule and any post-handover options.
              </p>
            </AnimatedSection>
            <AnimatedSection className="grid gap-px bg-white/10 sm:grid-cols-3 lg:col-span-7" delay={0.1}>
              {plan.map((s) => (
                <div key={s.label} className="bg-charcoal p-8 md:p-10">
                  <p className="font-serif text-5xl font-light text-gold md:text-6xl">{s.value}</p>
                  <span className="gold-line my-5" />
                  <p className="text-sm font-light text-white/70">{s.label}</p>
                </div>
              ))}
              <div className="bg-charcoal p-8 md:p-10">
                <p className="font-serif text-4xl font-light text-gold md:text-5xl">{formatDate(project.handoverDate, { month: "short", year: "numeric" })}</p>
                <span className="gold-line my-5" />
                <p className="text-sm font-light text-white/70">Anticipated handover</p>
              </div>
            </AnimatedSection>
          </div>
        </Container>
      </section>

      {/* Available units */}
      <section id="units" className="scroll-mt-20 bg-white py-section md:py-section-lg">
        <Container size="wide">
          <AnimatedSection className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <SectionLabel>Availability</SectionLabel>
              <SectionTitle>Available Units</SectionTitle>
            </div>
            <p className="label text-warmgray">
              {available.length} of {units.length} units available
            </p>
          </AnimatedSection>

          <AnimatedSection className="mt-12 overflow-x-auto" delay={0.1}>
            {units.length === 0 ? (
              <p className="text-sm font-light text-warmgray">Unit releases are announced to registered buyers first. Request the brochure to be notified.</p>
            ) : (
              <table className="w-full min-w-[640px] border-t border-line text-left">
                <thead>
                  <tr className="label text-[0.6rem] text-warmgray">
                    <th className="py-4 font-normal">Unit</th>
                    <th className="py-4 font-normal">Type</th>
                    <th className="py-4 font-normal">Beds</th>
                    <th className="py-4 font-normal">Area</th>
                    <th className="py-4 font-normal">Price</th>
                    <th className="py-4 font-normal">Status</th>
                    <th className="py-4" />
                  </tr>
                </thead>
                <tbody>
                  {units.map((u) => (
                    <tr key={u.id} className="border-t border-line text-sm font-light text-charcoal">
                      <td className="py-5 pr-4 font-serif text-xl">{u.title}</td>
                      <td className="py-5 pr-4">{titleCase(u.type)}</td>
                      <td className="py-5 pr-4">{u.bedrooms === 0 ? "Studio" : u.bedrooms}</td>
                      <td className="py-5 pr-4">{formatNumber(u.areaSqft)} sq ft</td>
                      <td className="py-5 pr-4">{formatAED(u.priceAed)}</td>
                      <td className="py-5 pr-4">
                        <span className={u.status === "available" ? "text-gold" : "text-warmgray"}>{titleCase(u.status)}</span>
                      </td>
                      <td className="py-5 text-right">
                        <Link href={`/properties/${u.slug}`} className="label text-[0.6rem] text-charcoal transition-colors hover:text-gold">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </AnimatedSection>
        </Container>
      </section>

      {/* Brochure */}
      <section id="brochure" className="scroll-mt-20 bg-offwhite py-section md:py-section-lg">
        <Container size="wide">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <AnimatedSection className="lg:col-span-5">
              <SectionLabel>Brochure</SectionLabel>
              <SectionTitle>Download the Brochure</SectionTitle>
              <p className="mt-8 max-w-md text-sm font-light leading-relaxed text-warmgray md:text-base">
                Floor plans, finishes, the full payment schedule and current pricing. Leave your details and we will send the
                brochure and keep you informed of new releases.
              </p>
            </AnimatedSection>
            <AnimatedSection className="lg:col-span-7" delay={0.1}>
              <LeadForm
                source="brochure"
                projectId={project.id}
                fields={["buyerType", "timeline"]}
                submitLabel="Get the Brochure"
                successTitle="Brochure on its way"
              />
            </AnimatedSection>
          </div>
        </Container>
      </section>
    </>
  );
}
