"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden bg-offwhite md:aspect-[16/9]">
        <AnimatePresence mode="wait">
          <motion.div
            key={images[active]}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image src={images[active]} alt={`${alt} ${active + 1}`} fill priority={active === 0} sizes="(min-width: 1024px) 66vw, 100vw" className="object-cover" />
          </motion.div>
        </AnimatePresence>
        <span className="label absolute bottom-4 right-4 bg-white/90 px-3 py-1.5 text-[0.55rem] text-charcoal backdrop-blur">
          {active + 1} / {images.length}
        </span>
      </div>
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-3">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1}`}
              className={cn(
                "relative aspect-[4/3] overflow-hidden bg-offwhite transition-opacity duration-500",
                i === active ? "opacity-100 ring-1 ring-gold" : "opacity-60 hover:opacity-100"
              )}
            >
              <Image src={src} alt="" fill sizes="20vw" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
