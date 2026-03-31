import type { ReactNode } from "react";

export function EmptyPanel({ title, note, action }: { title: string; note: string; action?: ReactNode }) {
  return (
    <div className="rounded-[26px] border border-dashed border-[var(--line)] bg-[var(--surface)] px-5 py-6 text-center shadow-sm backdrop-blur-md">
      <div className="text-base font-semibold text-[var(--text)]">{title}</div>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{note}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}


