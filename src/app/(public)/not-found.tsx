import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";

export const metadata: Metadata = { title: "Page Not Found", robots: { index: false } };

export default function PublicNotFound() {
  return (
    <section className="flex min-h-screen items-center bg-offwhite pt-24">
      <Container className="text-center">
        <SectionLabel align="center">404</SectionLabel>
        <h1 className="font-serif text-5xl font-light text-charcoal md:text-7xl">Page Not Found</h1>
        <p className="mx-auto mt-6 max-w-md text-sm font-light leading-relaxed text-warmgray">
          The page you are looking for has moved or no longer exists. The properties below may be of interest.
        </p>
        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <Button href="/properties">Explore Properties</Button>
          <Button href="/" variant="outline-dark">
            Home
          </Button>
        </div>
      </Container>
    </section>
  );
}
