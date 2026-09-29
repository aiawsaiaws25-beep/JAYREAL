import { Container } from "@/components/ui/Container";
import { COMMUNITIES } from "@/db/seed-data";
import { PROPERTY_TYPES } from "@/lib/validations";
import { titleCase } from "@/lib/utils";

const PRICE_STEPS = [1_000_000, 2_000_000, 3_000_000, 5_000_000, 10_000_000, 20_000_000, 50_000_000];

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

/** Plain GET form. Works without JavaScript and lands on /properties with URL filters. */
export function SearchBar() {
  return (
    <div className="relative z-20 -mt-14 md:-mt-16">
      <Container size="wide">
        <form action="/properties" method="get" className="border border-line bg-white p-6 shadow-[0_20px_60px_-30px_rgba(26,26,26,0.25)] md:p-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5 lg:items-end">
            <Field label="Listing" htmlFor="s-listing">
              <select id="s-listing" name="listingType" className={selectClass} defaultValue="">
                <option value="">Ready &amp; Off-Plan</option>
                <option value="ready">Ready</option>
                <option value="off-plan">Off-Plan</option>
              </select>
            </Field>
            <Field label="Community" htmlFor="s-community">
              <select id="s-community" name="community" className={selectClass} defaultValue="">
                <option value="">All communities</option>
                {COMMUNITIES.map((c) => (
                  <option key={c.slug} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Type" htmlFor="s-type">
              <select id="s-type" name="type" className={selectClass} defaultValue="">
                <option value="">Any type</option>
                {PROPERTY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {titleCase(t)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Max price" htmlFor="s-max">
              <select id="s-max" name="maxPrice" className={selectClass} defaultValue="">
                <option value="">No limit</option>
                {PRICE_STEPS.map((p) => (
                  <option key={p} value={p}>
                    AED {p >= 1_000_000 ? `${p / 1_000_000}M` : p}
                  </option>
                ))}
              </select>
            </Field>
            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center border border-charcoal bg-charcoal px-7 text-[0.6875rem] font-normal uppercase tracking-[0.25em] text-white transition-all duration-500 hover:border-gold hover:bg-gold"
            >
              Search
            </button>
          </div>
        </form>
      </Container>
    </div>
  );
}
