import { cn } from "@/lib/utils";

type SectionLabelProps = {
  children: React.ReactNode;
  className?: string;
  tone?: "gold" | "gray" | "light";
  align?: "left" | "center";
};

const tones = {
  gold: "text-gold",
  gray: "text-warmgray",
  light: "text-white/70",
};

export function SectionLabel({ children, className, tone = "gold", align = "left" }: SectionLabelProps) {
  return (
    <p className={cn("label mb-4", tones[tone], align === "center" && "text-center", className)}>{children}</p>
  );
}
