"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";

export default function PublicError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="flex min-h-screen items-center bg-offwhite pt-24">
      <Container className="text-center">
        <SectionLabel align="center">Something went wrong</SectionLabel>
        <h1 className="font-serif text-5xl font-light text-charcoal md:text-7xl">We Could Not Load This Page</h1>
        <p className="mx-auto mt-6 max-w-md text-sm font-light leading-relaxed text-warmgray">
          An unexpected error occurred. Please try again, or contact us directly and we will help.
        </p>
        {error.digest && <p className="label mt-4 text-[0.55rem] text-warmgray">Reference {error.digest}</p>}
        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <Button onClick={reset}>Try Again</Button>
          <Button href="/contact" variant="outline-dark">
            Contact Us
          </Button>
        </div>
      </Container>
    </section>
  );
}
