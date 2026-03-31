import Link from "next/link";

import type { LockItem } from "@/lib/use-time-lock-data";
import { cn, formatAmount, formatCountdown, formatDateTime, shortenAddress } from "@/lib/utils/format";

export function LockCard({ lock }: { lock: LockItem }) {
  return (
    <Link
      href={`/locks/${lock.index}`}
      className="block rounded-[28px] border border-[var(--line)] bg-[var(--surface-strong)] px-5 py-5 shadow-sm backdrop-blur-md transition hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--muted)]">#{lock.index}</div>
          <div className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[var(--text)]">
            {formatAmount(lock.amount, lock.decimals)} {lock.symbol}
          </div>
        </div>
        <div
          className={cn(
            "rounded-full px-3 py-1 text-xs font-semibold",
            lock.isMatured ? "bg-[var(--success-soft)] text-[var(--success)]" : "bg-[var(--primary-soft)] text-[var(--primary)]",
          )}
        >
          {lock.isMatured ? "Matured" : "Pending"}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-2xl bg-white/70 px-3 py-3">
          <div className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">Unlock</div>
          <div className="mt-1 font-medium text-[var(--text)]">{formatDateTime(lock.unlockAt)}</div>
          <div className="mt-1 text-xs text-[var(--muted)]">{formatCountdown(lock.unlockAt)}</div>
        </div>
        <div className="rounded-2xl bg-white/70 px-3 py-3">
          <div className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">Token</div>
          <div className="mt-1 font-medium text-[var(--text)]">{lock.symbol}</div>
          <div className="mt-1 text-xs text-[var(--muted)]">{lock.isEth ? "Native ETH" : shortenAddress(lock.token)}</div>
        </div>
      </div>
    </Link>
  );
}


