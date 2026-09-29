"use client";

import { useTransition } from "react";
import { deleteAndRedirect } from "@/app/actions/admin";
import { AdminButton } from "./ui";

export function DeleteButton({ kind, id, label }: { kind: "property" | "project"; id: number; label: string }) {
  const [pending, start] = useTransition();
  return (
    <AdminButton
      type="button"
      variant="ghost"
      size="sm"
      disabled={pending}
      onClick={() => {
        if (window.confirm(`Delete "${label}"? This cannot be undone.`)) start(() => deleteAndRedirect(kind, id));
      }}
    >
      {pending ? "Deleting" : "Delete"}
    </AdminButton>
  );
}
