import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "dark" | "light" | "gold" | "outline-dark" | "outline-light";
type Size = "sm" | "md" | "lg";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

type LinkProps = CommonProps & { href: string; target?: string; rel?: string };
type NativeProps = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & { href?: undefined };

export type ButtonProps = LinkProps | NativeProps;

const base =
  "inline-flex items-center justify-center rounded-none border font-sans font-normal uppercase tracking-[0.25em] transition-all duration-500 ease-[var(--ease-luxury)] focus:outline-none focus-visible:ring-1 focus-visible:ring-gold focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  dark: "bg-charcoal text-white border-charcoal hover:bg-gold hover:border-gold",
  light: "bg-white text-charcoal border-white hover:bg-charcoal hover:text-white hover:border-charcoal",
  gold: "bg-gold text-white border-gold hover:bg-charcoal hover:border-charcoal",
  "outline-dark": "bg-transparent text-charcoal border-charcoal hover:bg-charcoal hover:text-white",
  "outline-light": "bg-transparent text-white border-white hover:bg-white hover:text-charcoal",
};

const sizes: Record<Size, string> = {
  sm: "text-[0.625rem] px-5 py-2.5",
  md: "text-[0.6875rem] px-7 py-3.5",
  lg: "text-xs px-9 py-4",
};

export function Button(props: ButtonProps) {
  const { variant = "dark", size = "md", className, children } = props;
  const classes = cn(base, variants[variant], sizes[size], className);

  if (typeof props.href === "string") {
    const { href, target, rel } = props;
    return (
      <Link href={href} target={target} rel={rel} className={classes}>
        {children}
      </Link>
    );
  }

  const { variant: _variant, size: _size, className: _className, children: _children, href: _href, ...rest } =
    props;
  void _variant;
  void _size;
  void _className;
  void _children;
  void _href;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
