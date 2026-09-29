import Image from "next/image";
import Link from "next/link";
import { cn, formatAED } from "@/lib/utils";

export type PropertyCardProps = {
  name: string;
  community: string;
  startingPrice: number;
  image: string | null;
  href: string;
  type?: string;
  meta?: string;
  pricePrefix?: string;
  className?: string;
};

export function PropertyCard({
  name,
  community,
  startingPrice,
  image,
  href,
  type,
  meta,
  pricePrefix = "From",
  className,
}: PropertyCardProps) {
  return (
    <Link href={href} className={cn("group block", className)}>
      <div className="relative aspect-[3/4] overflow-hidden bg-offwhite">
        {image && (
          <Image
            src={image}
            alt={name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-[1600ms] ease-[var(--ease-luxury)] group-hover:scale-[1.06]"
          />
        )}
        {type && (
          <span className="label absolute left-4 top-4 bg-white/90 px-3 py-1.5 text-[0.55rem] text-charcoal backdrop-blur">
            {type}
          </span>
        )}
      </div>
      <div className="pt-6">
        <span className="gold-line mb-4 transition-all duration-500 group-hover:w-16" />
        <h3 className="font-serif text-2xl font-light text-charcoal md:text-3xl">{name}</h3>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <p className="label text-warmgray">{community}</p>
          <p className="label text-charcoal">
            {pricePrefix} {formatAED(startingPrice)}
          </p>
        </div>
        {meta && <p className="mt-2 text-xs font-light text-warmgray">{meta}</p>}
      </div>
    </Link>
  );
}
