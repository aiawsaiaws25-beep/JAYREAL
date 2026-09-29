import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoProps = {
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  className?: string;
  href?: string | null;
};

const sizes = {
  sm: { word: "text-2xl", sub: "text-[0.5rem]", line: "w-8 my-1" },
  md: { word: "text-3xl", sub: "text-[0.55rem]", line: "w-10 my-1.5" },
  lg: { word: "text-5xl", sub: "text-[0.65rem]", line: "w-14 my-2" },
};

export function Logo({ variant = "dark", size = "md", className, href = "/" }: LogoProps) {
  const color = variant === "light" ? "text-white" : "text-charcoal";
  const s = sizes[size];

  const mark = (
    <span
      className={cn(
        "inline-flex flex-col items-center leading-none select-none transition-colors duration-500",
        color,
        className
      )}
    >
      <span className={cn("font-serif font-light tracking-[0.35em] indent-[0.35em]", s.word)}>JAY</span>
      <span className={cn("h-px bg-gold", s.line)} aria-hidden />
      <span className={cn("font-sans font-normal uppercase tracking-[0.45em] indent-[0.45em]", s.sub)}>
        Real Estate
      </span>
    </span>
  );

  if (!href) return mark;
  return (
    <Link href={href} aria-label="Jay Real Estate - Home" className="inline-block">
      {mark}
    </Link>
  );
}
