"use client";

import { useState, useTransition } from "react";
import { updateViewing } from "@/app/actions/admin";
import { AdminButton, inputClass, selectClass } from "./ui";

export function ViewingStatusForm({ viewingId, status, feedback }: { viewingId: number; status: string; feedback: string | null }) {
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, start] = useTransition();

  return (
    <form
      action={(fd) =>
        start(async () => {
          const r = await updateViewing(viewingId, fd);
          setMsg(r.ok ? "Saved" : r.message);
        })
      }
      className="flex flex-col gap-2 sm:flex-row sm:items-center"
    >
      <select name="status" defaultValue={status} className={selectClass + " sm:w-36"}>
        <option value="scheduled">Scheduled</option>
        <option value="done">Done</option>
        <option value="no-show">No-show</option>
        <option value="cancelled">Cancelled</option>
      </select>
      <input name="feedback" defaultValue={feedback ?? ""} placeholder="Feedback" className={inputClass + " sm:w-64"} />
      <AdminButton type="submit" size="sm" variant="outline" disabled={pending}>
        Save
      </AdminButton>
      {msg && <span className="text-xs font-light text-warmgray">{msg}</span>}
    </form>
  );
}
