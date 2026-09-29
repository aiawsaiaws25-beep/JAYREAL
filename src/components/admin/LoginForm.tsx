"use client";

import { useActionState } from "react";
import { login } from "@/app/actions/auth";
import { FieldWrap, Input } from "@/components/forms/fields";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <form action={action} className="space-y-7">
      <FieldWrap label="Email" htmlFor="email">
        <Input id="email" name="email" type="email" autoComplete="email" placeholder="you@jayrealestate.example" required />
      </FieldWrap>
      <FieldWrap label="Password" htmlFor="password">
        <Input id="password" name="password" type="password" autoComplete="current-password" required />
      </FieldWrap>
      {state?.error && (
        <p className="text-xs font-light text-gold" role="alert">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center border border-charcoal bg-charcoal px-7 py-3.5 text-[0.6875rem] font-normal uppercase tracking-[0.25em] text-white transition-all duration-500 hover:border-gold hover:bg-gold disabled:opacity-50"
      >
        {pending ? "Signing in" : "Sign In"}
      </button>
    </form>
  );
}
