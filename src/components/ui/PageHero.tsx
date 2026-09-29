import Image from "next/image";
import { Container } from "./Container";
import { SectionLabel } from "./SectionLabel";
import { SectionTitle } from "./SectionTitle";
import { cn } from "@/lib/utils";

type PageHeroProps = {
  label?: string;
  title: string;
  subtitle?: string;
  image: string;
  imageAlt?: string;
  size?: "sm" | "md" | "lg";
  children?: React.ReactNode;
  align?: "left" | "center";
};

const heights = {
  sm: "min-h-[50vh]",
  md: "min-h-[65vh]",
  lg: "min-h-[85vh]",
};

/** Cinematic full-bleed header for inner pages. Sits under the transparent Header. */
export function PageHero({ label, title, subtitle, image, imageAlt = "", size = "md", children, align = "left" }: PageHeroProps) {
  return (
    <section className={cn("relative flex items-end overflow-hidden bg-charcoal text-white", heights[size])}>
      <Image src={image} alt={imageAlt} fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-charcoal/25 to-charcoal/85" aria-hidden />
      <Container size="wide" className={cn("relative z-10 pb-16 pt-40 md:pb-20", align === "center" && "text-center")}>
        {label && (
          <SectionLabel tone="light" align={align}>
            {label}
          </SectionLabel>
        )}
        <SectionTitle as="h1" size="xl" tone="light" align={align} className="max-w-4xl">
          {title}
        </SectionTitle>
        {subtitle && (
          <p className={cn("mt-6 max-w-xl text-base font-light leading-relaxed text-white/75 md:text-lg", align === "center" && "mx-auto")}>
            {subtitle}
          </p>
        )}
        {children}
      </Container>
    </section>
  );
}
