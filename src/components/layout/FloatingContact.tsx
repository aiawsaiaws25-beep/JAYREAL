"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Phone, X } from "lucide-react";
import { LeadForm } from "@/components/forms/LeadForm";
import { siteConfig } from "@/lib/site";

function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2m0 1.67c4.55 0 8.24 3.7 8.24 8.24s-3.69 8.24-8.24 8.24c-1.53 0-3.02-.42-4.32-1.21l-.31-.18-3.12.82.83-3.04-.2-.32a8.2 8.2 0 0 1-1.26-4.31c0-4.54 3.7-8.24 8.24-8.24m-3.2 4.42c-.18 0-.47.07-.72.34-.25.27-.95.93-.95 2.27s.97 2.63 1.11 2.81c.13.18 1.88 2.87 4.55 4.02 2.22.96 2.67.77 3.15.72.48-.04 1.55-.63 1.77-1.24.22-.61.22-1.13.15-1.24-.07-.11-.24-.18-.51-.31-.27-.14-1.58-.78-1.82-.87-.25-.09-.43-.13-.6.13-.18.27-.7.87-.86 1.05-.16.18-.32.2-.59.07-.27-.14-1.13-.42-2.16-1.33-.8-.71-1.34-1.59-1.5-1.86-.16-.27-.02-.41.12-.55.12-.12.27-.31.4-.47.13-.16.18-.27.27-.45.09-.18.04-.34-.02-.47-.07-.13-.6-1.45-.82-1.98-.22-.52-.44-.45-.6-.46h-.51" />
    </svg>
  );
}

export function FloatingContact() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const wa = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent("Hello Jay Real Estate, I would like to enquire about a property.")}`;

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3 md:bottom-8 md:right-8">
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="flex h-12 w-12 items-center justify-center border border-charcoal bg-charcoal text-white shadow-[0_10px_30px_-12px_rgba(26,26,26,0.4)] transition-all duration-500 hover:border-gold hover:bg-gold"
        >
          <WhatsAppIcon />
        </a>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Request a callback"
          className="flex h-12 w-12 items-center justify-center border border-charcoal bg-white text-charcoal shadow-[0_10px_30px_-12px_rgba(26,26,26,0.4)] transition-all duration-500 hover:border-gold hover:bg-gold hover:text-white"
        >
          <Phone size={18} strokeWidth={1.25} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center bg-charcoal/60 p-4 backdrop-blur-sm md:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="callback-title"
              className="relative w-full max-w-lg bg-white p-8 md:p-10"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="absolute right-4 top-4 p-2 text-warmgray transition-colors hover:text-charcoal"
              >
                <X size={18} strokeWidth={1.25} />
              </button>
              <p className="label text-gold">Callback</p>
              <h2 id="callback-title" className="mt-3 font-serif text-3xl font-light text-charcoal">
                Request a Call
              </h2>
              <p className="mt-3 text-sm font-light text-warmgray">Leave your details and an advisor will call you back at a time that suits you.</p>
              <div className="mt-8">
                <LeadForm
                  source="callback"
                  fields={["preferredTime"]}
                  columns={1}
                  submitLabel="Request Callback"
                  successTitle="We will call you shortly"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
