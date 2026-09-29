import { cn } from "@/lib/utils";

type SectionTitleProps = {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3";
  size?: "md" | "lg" | "xl";
  tone?: "dark" | "light";
  align?: "left" | "center";
  className?: string;
};

const sizes = {
  md: "text-3xl md:text-4xl",
  lg: "text-4xl md:text-5xl lg:text-6xl",
  xl: "text-5xl md:text-6xl lg:text-7xl xl:text-8xl",
};

export function SectionTitle({
  children,
  as: Tag = "h2",
  size = "lg",
  tone = "dark",
  align = "left",
  className,
}: SectionTitleProps) {
  return (
    <Tag
      className={cn(
        "font-serif font-light tracking-[0.02em] leading-[1.05] text-balance",
        sizes[size],
        tone === "light" ? "text-white" : "text-charcoal",
        align === "center" && "text-center mx-auto",
        className
      )}
    >
      {children}
    </Tag>
  );
}
