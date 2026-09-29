import { cn } from "@/lib/utils";

type ContainerProps = {
  as?: "div" | "section" | "header" | "footer" | "nav";
  size?: "default" | "narrow" | "wide";
  className?: string;
  children: React.ReactNode;
};

const sizes = {
  narrow: "max-w-3xl",
  default: "max-w-7xl",
  wide: "max-w-[90rem]",
};

export function Container({ as: Tag = "div", size = "default", className, children }: ContainerProps) {
  return (
    <Tag className={cn("mx-auto w-full px-6 md:px-10 lg:px-12", sizes[size], className)}>{children}</Tag>
  );
}
