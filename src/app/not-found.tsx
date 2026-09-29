import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Logo } from "@/components/ui/Logo";

export const metadata: Metadata = { title: "Page Not Found", robots: { index: false } };

/** Global fallback for routes outside the public and admin groups. */
export default function NotFound() {
  return (
    <section className="flex min-h-screen items-center bg-offwhite">
      <Container className="text-center">
        <div className="mb-12 flex justify-center">
          <Logo variant="dark" />
        </div>
        <SectionLabel align="center">404</SectionLabel>
        <h1 className="font-serif text-5xl font-light text-charcoal md:text-7xl">Page Not Found</h1>
        <p className="mx-auto mt-6 max-w-md text-sm font-light leading-relaxed text-warmgray">
          The page you are looking for has moved or no longer exists.
        </p>
        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <Button href="/">Home</Button>
          <Button href="/properties" variant="outline-dark">
            Properties
          </Button>
        </div>
      </Container>
    </section>
  );
}
