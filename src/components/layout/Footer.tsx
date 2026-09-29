import Link from "next/link";
import { socialIcons } from "@/components/ui/SocialIcons";
import { Logo } from "@/components/ui/Logo";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/lib/site";

const columns = [
  {
    heading: "Properties",
    links: [
      { label: "Ready Homes", href: "/properties" },
      { label: "Off-Plan Projects", href: "/projects" },
      { label: "Villas", href: "/properties?type=villa" },
      { label: "Apartments", href: "/properties?type=apartment" },
      { label: "Penthouses", href: "/properties?type=penthouse" },
    ],
  },
  {
    heading: "Services",
    links: [
      { label: "Buy", href: "/properties" },
      { label: "Sell Your Property", href: "/sell-your-property" },
      { label: "Mortgage Calculator", href: "/mortgage-calculator" },
      { label: "Register Interest", href: "/#register-interest" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-charcoal text-white">
      <Container size="wide" className="pt-20 pb-10 md:pt-28">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          {/* Brand + newsletter */}
          <div className="lg:col-span-4">
            <Logo variant="light" size="md" />
            <p className="mt-8 max-w-sm text-sm font-light leading-relaxed text-white/60">
              Exclusive ready and off-plan homes across Dubai&apos;s most sought-after communities, curated with
              discretion and expertise.
            </p>
            <form className="mt-10 max-w-sm" action="#" method="post">
              <label htmlFor="newsletter-email" className="label block text-white/50">
                Newsletter
              </label>
              <div className="mt-4 flex border-b border-white/25 transition-colors focus-within:border-gold">
                <input
                  id="newsletter-email"
                  type="email"
                  name="email"
                  placeholder="Your email address"
                  className="w-full bg-transparent py-3 text-sm font-light text-white placeholder:text-white/35 focus:outline-none"
                />
                <button
                  type="submit"
                  className="label shrink-0 pl-4 text-[0.625rem] text-white/70 transition-colors hover:text-gold"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-6 lg:col-start-6">
            {columns.map((col) => (
              <div key={col.heading}>
                <h4 className="label font-sans text-gold">{col.heading}</h4>
                <ul className="mt-6 space-y-3.5">
                  {col.links.map((l) => (
                    <li key={l.href + l.label}>
                      <Link
                        href={l.href}
                        className="text-sm font-light text-white/65 transition-colors duration-300 hover:text-white"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Social */}
          <div className="flex gap-5 lg:col-span-2 lg:flex-col lg:items-end">
            {siteConfig.social.map((s) => {
              const Icon = socialIcons[s.label as keyof typeof socialIcons];
              return (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center border border-white/20 text-white/70 transition-all duration-500 hover:border-gold hover:text-gold"
                >
                  <Icon size={16} />
                </a>
              );
            })}
          </div>
        </div>

        <div className="mt-20 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="label text-[0.6rem] text-white/40">&copy; {new Date().getFullYear()} Jay Real Estate. All rights reserved.</p>
          <p className="label text-[0.6rem] text-white/40">Dubai, United Arab Emirates</p>
        </div>
      </Container>
    </footer>
  );
}
