"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

const EASE = [0.22, 1, 0.36, 1] as const;

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=2400&q=80";

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-end overflow-hidden bg-charcoal text-white">
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.4, ease: EASE }}
      >
        <Image
          src={HERO_IMAGE}
          alt="Dubai skyline at dusk"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      <div
        className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-charcoal/20 to-charcoal/85"
        aria-hidden
      />

      <Container size="wide" className="relative z-10 pb-20 pt-40 md:pb-28">
        <motion.p
          className="label text-white/70"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
        >
          Dubai &middot; Ready &amp; Off-Plan
        </motion.p>
        <motion.h1
          className="mt-6 max-w-4xl font-serif text-5xl font-light leading-[1.02] tracking-[0.02em] text-balance sm:text-6xl md:text-7xl lg:text-8xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.45, ease: EASE }}
        >
          Live Where Luxury Meets the Skyline
        </motion.h1>
        <motion.p
          className="mt-8 max-w-xl text-base font-light leading-relaxed text-white/75 md:text-lg"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7, ease: EASE }}
        >
          Exclusive homes and off-plan investments across Dubai&apos;s most sought-after communities
        </motion.p>
        <motion.div
          className="mt-12 flex flex-col gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.9, ease: EASE }}
        >
          <Button href="/properties" variant="light">
            Explore Properties
          </Button>
          <Button href="/register-interest" variant="outline-light">
            Register Interest
          </Button>
        </motion.div>
      </Container>

      <motion.div
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        aria-hidden
      >
        <span className="label text-[0.55rem] text-white/50">Scroll</span>
        <span className="block h-10 w-px overflow-hidden bg-white/20">
          <motion.span
            className="block h-full w-full bg-gold"
            animate={{ y: ["-100%", "100%"] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </section>
  );
}
