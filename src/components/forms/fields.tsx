"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

/* Minimal, hairline form controls that follow the design system. */

const control =
  "w-full rounded-none border-0 border-b bg-transparent py-3 text-sm font-light text-charcoal placeholder:text-warmgray/60 focus:outline-none transition-colors duration-300";

type FieldWrapProps = {
  label: string;
  htmlFor: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
  tone?: "dark" | "light";
};

export function FieldWrap({ label, htmlFor, error, className, children, tone = "dark" }: FieldWrapProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      <label htmlFor={htmlFor} className={cn("label text-[0.6rem]", tone === "light" ? "text-white/60" : "text-warmgray")}>
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-2 text-xs font-light text-gold" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean; tone?: "dark" | "light" };

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ className, invalid, tone = "dark", ...props }, ref) {
  return (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        control,
        tone === "light" ? "border-white/25 text-white placeholder:text-white/35 focus:border-gold" : "border-line focus:border-charcoal",
        invalid && "border-gold",
        className
      )}
      {...props}
    />
  );
});

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean; tone?: "dark" | "light" };

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select({ className, invalid, tone = "dark", children, ...props }, ref) {
  return (
    <div className="relative">
      <select
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(
          control,
          "appearance-none pr-6",
          tone === "light" ? "border-white/25 text-white focus:border-gold [&>option]:text-charcoal" : "border-line focus:border-charcoal",
          invalid && "border-gold",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-warmgray" aria-hidden>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M1 3l4 4 4-4" />
        </svg>
      </span>
    </div>
  );
});

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean; tone?: "dark" | "light" };

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea({ className, invalid, tone = "dark", ...props }, ref) {
  return (
    <textarea
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        control,
        "min-h-24 resize-y",
        tone === "light" ? "border-white/25 text-white placeholder:text-white/35 focus:border-gold" : "border-line focus:border-charcoal",
        invalid && "border-gold",
        className
      )}
      {...props}
    />
  );
});

/** Visually hidden honeypot. Bots fill it, humans never see it. */
export function Honeypot(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
      <label htmlFor="website">Website</label>
      <input id="website" type="text" tabIndex={-1} autoComplete="off" {...props} />
    </div>
  );
}
