"use client";

import { useMemo, useState } from "react";
import { formatAED } from "@/lib/utils";
import { cn } from "@/lib/utils";

/*
 * All fee defaults are editable and shown as estimates. They approximate typical
 * Dubai purchase costs but are not advice; buyers should confirm with their bank
 * and the Dubai Land Department.
 */
const DEFAULTS = {
  price: 3_000_000,
  downPaymentPct: 20,
  ratePct: 4.5,
  years: 25,
  dldFeePct: 4,
  agencyFeePct: 2,
  mortgageRegPct: 0.25,
  bankArrangementPct: 1,
  valuationFee: 3_150,
  trusteeFee: 4_200,
};

type Values = typeof DEFAULTS;

const inputClass =
  "w-full rounded-none border-0 border-b border-line bg-transparent py-3 text-right font-serif text-2xl font-light text-charcoal focus:border-charcoal focus:outline-none";

function NumberField({
  id,
  label,
  value,
  onChange,
  suffix,
  step = 1,
  min = 0,
  small,
}: {
  id: keyof Values;
  label: string;
  value: number;
  onChange: (v: number) => void;
  suffix?: string;
  step?: number;
  min?: number;
  small?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="label text-[0.6rem] text-warmgray">
        {label}
      </label>
      <div className="flex items-baseline gap-3">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={min}
          step={step}
          value={Number.isFinite(value) ? value : ""}
          onChange={(e) => onChange(e.target.valueAsNumber)}
          className={cn(inputClass, small && "text-lg")}
        />
        {suffix && <span className="label shrink-0 text-[0.6rem] text-warmgray">{suffix}</span>}
      </div>
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={cn("flex items-baseline justify-between gap-6 border-b border-line py-3", strong && "border-charcoal")}>
      <dt className={cn("text-sm font-light", strong ? "text-charcoal" : "text-warmgray")}>{label}</dt>
      <dd className={cn("font-serif font-light text-charcoal", strong ? "text-2xl" : "text-lg")}>{value}</dd>
    </div>
  );
}

export function MortgageCalculator() {
  const [v, setV] = useState<Values>(DEFAULTS);
  const set = (k: keyof Values) => (n: number) => setV((prev) => ({ ...prev, [k]: n }));

  const result = useMemo(() => {
    const price = v.price || 0;
    const downPayment = (price * (v.downPaymentPct || 0)) / 100;
    const loan = Math.max(price - downPayment, 0);
    const monthlyRate = (v.ratePct || 0) / 100 / 12;
    const n = Math.max((v.years || 0) * 12, 1);
    const monthly = monthlyRate === 0 ? loan / n : (loan * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -n));
    const totalRepaid = monthly * n;
    const totalInterest = totalRepaid - loan;

    const dld = (price * (v.dldFeePct || 0)) / 100;
    const agency = (price * (v.agencyFeePct || 0)) / 100;
    const mortgageReg = (loan * (v.mortgageRegPct || 0)) / 100;
    const bankFee = (loan * (v.bankArrangementPct || 0)) / 100;
    const upfront = downPayment + dld + agency + mortgageReg + bankFee + (v.valuationFee || 0) + (v.trusteeFee || 0);

    return { downPayment, loan, monthly, totalInterest, totalRepaid, dld, agency, mortgageReg, bankFee, upfront };
  }, [v]);

  const money = (n: number) => formatAED(Math.round(n));

  return (
    <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
      {/* Inputs */}
      <div className="lg:col-span-7">
        <p className="label text-gold">Your purchase</p>
        <div className="mt-6 grid gap-8 sm:grid-cols-2">
          <NumberField id="price" label="Property price" value={v.price} onChange={set("price")} suffix="AED" step={50_000} />
          <NumberField id="downPaymentPct" label="Down payment" value={v.downPaymentPct} onChange={set("downPaymentPct")} suffix="%" step={1} />
          <NumberField id="ratePct" label="Interest rate" value={v.ratePct} onChange={set("ratePct")} suffix="% p.a." step={0.05} />
          <NumberField id="years" label="Term" value={v.years} onChange={set("years")} suffix="years" step={1} min={1} />
        </div>

        <details className="group mt-12 border-t border-line pt-8">
          <summary className="label flex cursor-pointer list-none items-center justify-between text-charcoal">
            <span>Upfront cost assumptions (estimates, editable)</span>
            <span className="text-warmgray transition-transform duration-500 group-open:rotate-45">+</span>
          </summary>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <NumberField id="dldFeePct" label="DLD transfer fee" value={v.dldFeePct} onChange={set("dldFeePct")} suffix="% of price" step={0.25} small />
            <NumberField id="agencyFeePct" label="Agency fee" value={v.agencyFeePct} onChange={set("agencyFeePct")} suffix="% of price" step={0.25} small />
            <NumberField id="mortgageRegPct" label="Mortgage registration" value={v.mortgageRegPct} onChange={set("mortgageRegPct")} suffix="% of loan" step={0.05} small />
            <NumberField id="bankArrangementPct" label="Bank arrangement fee" value={v.bankArrangementPct} onChange={set("bankArrangementPct")} suffix="% of loan" step={0.25} small />
            <NumberField id="valuationFee" label="Valuation fee" value={v.valuationFee} onChange={set("valuationFee")} suffix="AED" step={50} small />
            <NumberField id="trusteeFee" label="Trustee office fee" value={v.trusteeFee} onChange={set("trusteeFee")} suffix="AED" step={50} small />
          </div>
          <p className="mt-6 text-xs font-light leading-relaxed text-warmgray">
            These are indicative figures for a typical Dubai purchase and can vary by bank, property and buyer status. They
            are estimates only and do not constitute financial advice.
          </p>
        </details>
      </div>

      {/* Results */}
      <div className="lg:col-span-5">
        <div className="border border-line bg-white p-8 md:p-10">
          <p className="label text-gold">Estimated monthly payment</p>
          <p className="mt-4 font-serif text-5xl font-light text-charcoal md:text-6xl" aria-live="polite">
            {money(result.monthly)}
          </p>
          <p className="mt-2 text-xs font-light text-warmgray">
            Over {v.years || 0} years at {v.ratePct || 0}% on a loan of {money(result.loan)}
          </p>

          <dl className="mt-10">
            <Row label="Down payment" value={money(result.downPayment)} />
            <Row label="DLD transfer fee" value={money(result.dld)} />
            <Row label="Agency fee" value={money(result.agency)} />
            <Row label="Mortgage registration" value={money(result.mortgageReg)} />
            <Row label="Bank arrangement fee" value={money(result.bankFee)} />
            <Row label="Valuation and trustee fees" value={money((v.valuationFee || 0) + (v.trusteeFee || 0))} />
            <Row label="Estimated upfront costs" value={money(result.upfront)} strong />
          </dl>

          <dl className="mt-8">
            <Row label="Total interest over term" value={money(result.totalInterest)} />
            <Row label="Total repaid" value={money(result.totalRepaid)} />
          </dl>

          <p className="mt-6 text-[0.65rem] font-light leading-relaxed text-warmgray">
            All figures are estimates for guidance only. Final terms depend on lender approval, eligibility and prevailing rates.
          </p>
        </div>
      </div>
    </div>
  );
}
