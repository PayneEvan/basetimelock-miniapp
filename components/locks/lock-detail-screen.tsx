"use client";

import Link from "next/link";
import { useAccount } from "wagmi";

import { EmptyPanel } from "@/components/locks/empty-panel";
import { WithdrawButton } from "@/components/locks/withdraw-button";
import { useTimeLockData } from "@/lib/use-time-lock-data";
import { formatAmount, formatCountdown, formatDateTime, shortenAddress } from "@/lib/utils/format";

export function LockDetailScreen({ index }: { index: number }) {
  const { address, isConnected } = useAccount();
  const { locks, refetch } = useTimeLockData(address);
  const lock = locks.find((item) => item.index === index);

  if (!isConnected) {
    return <EmptyPanel title="Connect to inspect" note="Lock detail uses your live user array and current lock indexes." />;
  }

  if (!lock) {
    return <EmptyPanel title="Lock not found" note="This index may have shifted after a withdrawal. Open records to refresh the current array." action={<Link href="/records" className="rounded-full bg-[var(--text)] px-4 py-2 text-xs font-semibold text-white">Open Records</Link>} />;
  }

  return (
    <div className="space-y-4">
      <section className="rounded-[32px] border border-[var(--line)] bg-[var(--surface-strong)] p-5 shadow-[var(--shadow)] backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">Lock #{lock.index}</div>
            <div className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-[var(--text)]">{formatAmount(lock.amount, lock.decimals)} {lock.symbol}</div>
          </div>
          <div className={`rounded-full px-3 py-1 text-xs font-semibold ${lock.isMatured ? "bg-[var(--success-soft)] text-[var(--success)]" : "bg-[var(--primary-soft)] text-[var(--primary)]"}`}>
            {lock.isMatured ? "Matured" : "Pending"}
          </div>
        </div>

        <div className="mt-5 grid gap-3">
          <div className="rounded-[24px] bg-white/75 p-4">
            <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">Unlock Schedule</div>
            <div className="mt-2 text-lg font-semibold text-[var(--text)]">{formatDateTime(lock.unlockAt)}</div>
            <div className="mt-1 text-sm text-[var(--muted)]">{formatCountdown(lock.unlockAt)}</div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[24px] bg-white/75 p-4">
              <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">Token</div>
              <div className="mt-2 text-sm font-semibold text-[var(--text)]">{lock.symbol}</div>
              <div className="mt-1 text-xs text-[var(--muted)]">{lock.isEth ? "Native ETH" : shortenAddress(lock.token)}</div>
            </div>
            <div className="rounded-[24px] bg-white/75 p-4">
              <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">Type</div>
              <div className="mt-2 text-sm font-semibold text-[var(--text)]">{lock.isEth ? "ETH Lock" : "ERC20 Lock"}</div>
              <div className="mt-1 text-xs text-[var(--muted)]">Tracked live</div>
            </div>
          </div>
        </div>
      </section>

      <WithdrawButton maturedCount={lock.isMatured ? 1 : 0} onDone={() => void refetch()} />
    </div>
  );
}


