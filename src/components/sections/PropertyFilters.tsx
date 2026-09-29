import Link from "next/link";
import { PROPERTY_TYPES } from "@/lib/validations";
import { titleCase } from "@/lib/utils";
import type { PropertyFilters as Filters } from "@/lib/queries";

const PRICE_STEPS = [500_000, 1_000_000, 2_000_000, 3_000_000, 5_000_000, 10_000_000, 20_000_000, 50_000_000];

const selectClass =
  "w-full appearance-none rounded-none border-0 border-b border-line bg-transparent py-3 pr-6 text-sm font-light text-charcoal focus:border-charcoal focus:outline-none";

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div className="relative flex flex-col">
      <label htmlFor={htmlFor} className="label text-[0.6rem] text-warmgray">
        {label}
      </label>
      {children}
      <span className="pointer-events-none absolute bottom-4 right-0 text-warmgray" aria-hidden>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M1 3l4 4 4-4" />
        </svg>
      </span>
    </div>
  );
}

const priceLabel = (p: number) => `AED ${p >= 1_000_000 ? `${p / 1_000_000}M` : `${p / 1_000}K`}`;

/** Server-rendered GET form; the URL is the single source of truth for filters. */
export function PropertyFilters({ filters, communities }: { filters: Filters; communities: string[] }) {
  const hasFilters = Object.values(filters).some((v) => v !== undefined && v !== "newest");

  return (
    <form action="/properties" method="get" className="border-b border-line pb-10">
      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-7 lg:items-end">
        <Field label="Listing" htmlFor="f-listing">
          <select id="f-listing" name="listingType" className={selectClass} defaultValue={filters.listingType ?? ""}>
            <option value="">Ready &amp; Off-Plan</option>
            <option value="ready">Ready</option>
            <option value="off-plan">Off-Plan</option>
          </select>
        </Field>
        <Field label="Community" htmlFor="f-community">
          <select id="f-community" name="community" className={selectClass} defaultValue={filters.community ?? ""}>
            <option value="">All communities</option>
            {communities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Type" htmlFor="f-type">
          <select id="f-type" name="type" className={selectClass} defaultValue={filters.type ?? ""}>
            <option value="">Any type</option>
            {PROPERTY_TYPES.map((t) => (
              <option key={t} value={t}>
                {titleCase(t)}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Bedrooms" htmlFor="f-beds">
          <select id="f-beds" name="bedrooms" className={selectClass} defaultValue={filters.bedrooms?.toString() ?? ""}>
            <option value="">Any</option>
            <option value="0">Studio+</option>
            {[1, 2, 3, 4, 5].map((b) => (
              <option key={b} value={b}>
                {b}+
              </option>
            ))}
          </select>
        </Field>
        <Field label="Min price" htmlFor="f-min">
          <select id="f-min" name="minPrice" className={selectClass} defaultValue={filters.minPrice?.toString() ?? ""}>
            <option value="">No min</option>
            {PRICE_STEPS.map((p) => (
              <option key={p} value={p}>
                {priceLabel(p)}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Max price" htmlFor="f-max">
          <select id="f-max" name="maxPrice" className={selectClass} defaultValue={filters.maxPrice?.toString() ?? ""}>
            <option value="">No max</option>
            {PRICE_STEPS.map((p) => (
              <option key={p} value={p}>
                {priceLabel(p)}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Sort" htmlFor="f-sort">
          <select id="f-sort" name="sort" className={selectClass} defaultValue={filters.sort ?? "newest"}>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </Field>
      </div>
      <div className="mt-8 flex items-center gap-8">
        <button
          type="submit"
          className="inline-flex items-center justify-center border border-charcoal bg-charcoal px-7 py-3.5 text-[0.6875rem] font-normal uppercase tracking-[0.25em] text-white transition-all duration-500 hover:border-gold hover:bg-gold"
        >
          Apply Filters
        </button>
        {hasFilters && (
          <Link href="/properties" className="label text-[0.6rem] text-warmgray transition-colors hover:text-gold">
            Clear all
          </Link>
        )}
      </div>
    </form>
  );
}
