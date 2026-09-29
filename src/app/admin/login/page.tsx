import type { Metadata } from "next";
import Image from "next/image";
import { Logo } from "@/components/ui/Logo";
import { LoginForm } from "@/components/admin/LoginForm";
import { IMAGES } from "@/db/seed-data";

export const metadata: Metadata = { title: "Sign in", robots: { index: false } };

export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden bg-charcoal lg:block">
        <Image src={IMAGES.skyline} alt="" fill sizes="50vw" className="object-cover opacity-80" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/30 to-charcoal/40" aria-hidden />
        <div className="absolute inset-x-0 bottom-0 p-14 text-white">
          <p className="label text-white/60">Lead Engine</p>
          <p className="mt-4 max-w-md font-serif text-4xl font-light leading-tight">Every enquiry, every viewing, every deal in one calm place.</p>
        </div>
      </div>
      <div className="flex items-center justify-center bg-white px-6 py-16">
        <div className="w-full max-w-sm">
          <Logo variant="dark" href={null} />
          <p className="label mt-12 text-gold">Admin</p>
          <h1 className="mt-3 font-serif text-4xl font-light text-charcoal">Sign In</h1>
          <div className="mt-10">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
