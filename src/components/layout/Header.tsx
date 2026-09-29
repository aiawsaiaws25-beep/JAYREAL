"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on route change and lock body scroll while open.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Pages without a full-bleed hero start on white, so the header must be solid from the top.
  const noHero = /^\/properties\/[^/]+$/.test(pathname);
  const solid = scrolled || open || noHero;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[var(--ease-luxury)]",
        solid ? "bg-white shadow-[0_1px_0_0_rgba(0,0,0,0.04),0_8px_30px_-12px_rgba(0,0,0,0.12)]" : "bg-transparent"
      )}
    >
      <Container size="wide" className={cn("flex items-center justify-between transition-all duration-500", solid ? "py-4" : "py-7")}>
        <Logo variant={solid ? "dark" : "light"} size="sm" />

        <nav className="hidden items-center gap-10 lg:flex" aria-label="Primary">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "label relative pb-1 text-[0.625rem] transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-gold after:transition-all after:duration-500 hover:after:w-full",
                solid ? "text-charcoal hover:text-gold" : "text-white/90 hover:text-white",
                pathname === item.href && "after:w-full"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Button
            href={siteConfig.cta.href}
            size="sm"
            variant={solid ? "outline-dark" : "outline-light"}
            className="hidden md:inline-flex"
          >
            {siteConfig.cta.label}
          </Button>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className={cn("p-2 transition-colors lg:hidden", solid ? "text-charcoal" : "text-white")}
          >
            {open ? <X size={22} strokeWidth={1.25} /> : <Menu size={22} strokeWidth={1.25} />}
          </button>
        </div>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 top-[4.5rem] z-40 flex flex-col bg-white lg:hidden"
          >
            <nav className="flex flex-1 flex-col items-center justify-center gap-8" aria-label="Mobile">
              {siteConfig.nav.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={item.href}
                    className="font-serif text-4xl font-light text-charcoal transition-colors hover:text-gold"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="mt-6"
              >
                <Button href={siteConfig.cta.href} variant="outline-dark">
                  {siteConfig.cta.label}
                </Button>
              </motion.div>
            </nav>
            <div className="pb-10 text-center">
              <Logo variant="dark" size="sm" href={null} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
