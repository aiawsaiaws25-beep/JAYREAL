"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { submitLead, type LeadActionState } from "@/app/actions/leads";

const THANK_YOU = "Thank you. A Jay Real Estate advisor will contact you within 24 hours.";
import { BUYER_TYPES, FINANCE_TYPES, PROPERTY_TYPES, TIMELINES, leadSchema, type LeadInput, type LeadValues } from "@/lib/validations";
import { Button } from "@/components/ui/Button";
import { FieldWrap, Honeypot, Input, Select, Textarea } from "./fields";
import { cn } from "@/lib/utils";

export type LeadField =
  | "message"
  | "buyerType"
  | "financeType"
  | "budget"
  | "timeline"
  | "preferredDate"
  | "preferredTime"
  | "propertyType"
  | "community"
  | "bedrooms"
  | "areaSqft";

type LeadFormProps = {
  source: LeadValues["source"];
  fields?: LeadField[];
  propertyId?: number;
  projectId?: number;
  submitLabel?: string;
  successTitle?: string;
  messagePlaceholder?: string;
  defaultValues?: Partial<LeadInput>;
  tone?: "dark" | "light";
  columns?: 1 | 2;
  className?: string;
  onSuccess?: () => void;
};

const labelFor = (v: string) => v.charAt(0).toUpperCase() + v.slice(1).replace(/-/g, " ");

export function LeadForm({
  source,
  fields = ["message"],
  propertyId,
  projectId,
  submitLabel = "Submit",
  successTitle = "Thank you",
  messagePlaceholder = "Tell us what you are looking for",
  defaultValues,
  tone = "dark",
  columns = 2,
  className,
  onSuccess,
}: LeadFormProps) {
  const [state, setState] = useState<LeadActionState>({ status: "idle" });
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<LeadInput, unknown, LeadValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: { source, propertyId, projectId, website: "", ...defaultValues },
  });

  const has = (f: LeadField) => fields.includes(f);
  const light = tone === "light";

  const onSubmit = (values: LeadValues) => {
    startTransition(async () => {
      const result = await submitLead({ ...values, source, propertyId, projectId });
      setState(result);
      if (result.status === "error" && result.fieldErrors) {
        for (const [key, message] of Object.entries(result.fieldErrors)) {
          setError(key as keyof LeadInput, { message });
        }
      }
      if (result.status === "success") {
        reset();
        onSuccess?.();
      }
    });
  };

  if (state.status === "success") {
    return (
      <div className={cn("border px-8 py-12 text-center", light ? "border-white/20" : "border-line", className)} role="status">
        <span className="gold-line mx-auto mb-6" />
        <h3 className={cn("font-serif text-3xl font-light", light ? "text-white" : "text-charcoal")}>{successTitle}</h3>
        <p className={cn("mt-4 text-sm font-light leading-relaxed", light ? "text-white/70" : "text-warmgray")}>
          {THANK_YOU}
        </p>
      </div>
    );
  }

  const err = (k: keyof LeadInput) => errors[k]?.message as string | undefined;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className={cn("relative", className)}>
      <Honeypot {...register("website")} />
      <input type="hidden" {...register("source")} value={source} />

      <div className={cn("grid gap-x-8 gap-y-7", columns === 2 && "md:grid-cols-2")}>
        <FieldWrap label="Full name" htmlFor="fullName" error={err("fullName")} tone={tone}>
          <Input id="fullName" placeholder="Your name" autoComplete="name" tone={tone} invalid={!!errors.fullName} {...register("fullName")} />
        </FieldWrap>
        <FieldWrap label="Email" htmlFor="email" error={err("email")} tone={tone}>
          <Input id="email" type="email" placeholder="you@example.com" autoComplete="email" tone={tone} invalid={!!errors.email} {...register("email")} />
        </FieldWrap>
        <FieldWrap label="Phone" htmlFor="phone" error={err("phone")} tone={tone}>
          <Input id="phone" type="tel" placeholder="+971 50 000 0000" autoComplete="tel" tone={tone} invalid={!!errors.phone} {...register("phone")} />
        </FieldWrap>

        {has("buyerType") && (
          <FieldWrap label="I am" htmlFor="buyerType" error={err("buyerType")} tone={tone}>
            <Select id="buyerType" tone={tone} {...register("buyerType")}>
              <option value="">Select</option>
              {BUYER_TYPES.map((v) => (
                <option key={v} value={v}>
                  {labelFor(v)}
                </option>
              ))}
            </Select>
          </FieldWrap>
        )}

        {has("financeType") && (
          <FieldWrap label="Financing" htmlFor="financeType" error={err("financeType")} tone={tone}>
            <Select id="financeType" tone={tone} {...register("financeType")}>
              <option value="">Select</option>
              {FINANCE_TYPES.map((v) => (
                <option key={v} value={v}>
                  {labelFor(v)}
                </option>
              ))}
            </Select>
          </FieldWrap>
        )}

        {has("budget") && (
          <>
            <FieldWrap label="Budget from (AED)" htmlFor="budgetMin" error={err("budgetMin")} tone={tone}>
              <Input id="budgetMin" inputMode="numeric" placeholder="2,000,000" tone={tone} {...register("budgetMin")} />
            </FieldWrap>
            <FieldWrap label="Budget to (AED)" htmlFor="budgetMax" error={err("budgetMax")} tone={tone}>
              <Input id="budgetMax" inputMode="numeric" placeholder="5,000,000" tone={tone} {...register("budgetMax")} />
            </FieldWrap>
          </>
        )}

        {has("timeline") && (
          <FieldWrap label="Timeline" htmlFor="timeline" error={err("timeline")} tone={tone}>
            <Select id="timeline" tone={tone} {...register("timeline")}>
              <option value="">Select</option>
              {TIMELINES.map((v) => (
                <option key={v} value={v}>
                  {labelFor(v)}
                </option>
              ))}
            </Select>
          </FieldWrap>
        )}

        {has("preferredDate") && (
          <FieldWrap label="Preferred date" htmlFor="preferredDate" error={err("preferredDate")} tone={tone}>
            <Input id="preferredDate" type="date" tone={tone} {...register("preferredDate")} />
          </FieldWrap>
        )}

        {has("preferredTime") && (
          <FieldWrap label="Preferred time" htmlFor="preferredTime" error={err("preferredTime")} tone={tone}>
            <Select id="preferredTime" tone={tone} {...register("preferredTime")}>
              <option value="">Select</option>
              <option value="Morning">Morning</option>
              <option value="Afternoon">Afternoon</option>
              <option value="Evening">Evening</option>
            </Select>
          </FieldWrap>
        )}

        {has("propertyType") && (
          <FieldWrap label="Property type" htmlFor="propertyType" error={err("propertyType")} tone={tone}>
            <Select id="propertyType" tone={tone} {...register("propertyType")}>
              <option value="">Select</option>
              {PROPERTY_TYPES.map((v) => (
                <option key={v} value={v}>
                  {labelFor(v)}
                </option>
              ))}
            </Select>
          </FieldWrap>
        )}

        {has("community") && (
          <FieldWrap label="Community" htmlFor="community" error={err("community")} tone={tone}>
            <Input id="community" placeholder="e.g. Dubai Marina" tone={tone} {...register("community")} />
          </FieldWrap>
        )}

        {has("bedrooms") && (
          <FieldWrap label="Bedrooms" htmlFor="bedrooms" error={err("bedrooms")} tone={tone}>
            <Input id="bedrooms" inputMode="numeric" placeholder="3" tone={tone} {...register("bedrooms")} />
          </FieldWrap>
        )}

        {has("areaSqft") && (
          <FieldWrap label="Area (sq ft)" htmlFor="areaSqft" error={err("areaSqft")} tone={tone}>
            <Input id="areaSqft" inputMode="numeric" placeholder="1,500" tone={tone} {...register("areaSqft")} />
          </FieldWrap>
        )}

        {has("message") && (
          <FieldWrap label="Message" htmlFor="message" error={err("message")} tone={tone} className="md:col-span-2">
            <Textarea id="message" placeholder={messagePlaceholder} tone={tone} {...register("message")} />
          </FieldWrap>
        )}
      </div>

      {state.status === "error" && (
        <p className="mt-6 text-xs font-light text-gold" role="alert">
          {state.message}
        </p>
      )}

      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" variant={light ? "light" : "dark"} disabled={pending}>
          {pending ? "Sending" : submitLabel}
        </Button>
        <p className={cn("text-[0.65rem] font-light leading-relaxed", light ? "text-white/45" : "text-warmgray")}>
          By submitting you agree to be contacted by Jay Real Estate. We never share your details.
        </p>
      </div>
    </form>
  );
}
