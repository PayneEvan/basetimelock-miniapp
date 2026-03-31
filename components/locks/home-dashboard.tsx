"use client";

import Link from "next/link";
import { useAccount } from "wagmi";

import { EmptyPanel } from "@/components/locks/empty-panel";
import { LockCard } from "@/components/locks/lock-card";
import { WithdrawButton } from "@/components/locks/withdraw-button";
import { MAX_LOCKS_PER_USER } from "@/lib/config/contracts";
import { useTimeLockData } from "@/lib/use-time-lock-data";
import { formatCountdown, formatDateTime } from "@/lib/utils/format";

function StatCard({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-[26px] border border-[var(--line)] bg-[var(--surface-strong)] p-4 shadow-sm backdrop-blur-md">
      <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--muted)]">{label}</div>
      <div className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[var(--text)]">{value}</div>
      <div className="mt-1 text-xs text-[var(--muted)]">{note}</div>
    </div>
  );
}

export function HomeDashboard() {
  const { address, isConnected } = useAccount();
  const { locks, summary, isLoading, refetch } = useTimeLockData(address);
  const recent = [...locks].sort((left, right) => right.unlockAt - left.unlockAt).slice(0, 3);

  return (
    <div className="space-y-4">
      <section className="rounded-[32px] border border-[var(--line)] bg-[var(--surface-strong)] px-5 py-5 shadow-[var(--shadow)] backdrop-blur-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">Status First</div>
            <div className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-[var(--text)]">{summary.maturedCount}</div>
            <div className="mt-1 text-sm text-[var(--muted)]">Locks ready to withdraw</div>
          </div>
          <Link href="/create" className="rounded-full bg-[var(--primary-soft)] px-4 py-2 text-xs font-semibold text-[var(--primary)]">
            Create Lock
          </Link>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <StatCard label="Matured" value={`${summary.maturedCount}`} note="Ready now" />
          <StatCard label="Total" value={`${summary.totalCount}`} note={`${MAX_LOCKS_PER_USER - summary.totalCount} slots left`} />
          <StatCard
            label="Next Unlock"
            value={summary.nextUnlock ? formatCountdown(summary.nextUnlock.unlockAt) : "None"}
            note={summary.nextUnlock ? formatDateTime(summary.nextUnlock.unlockAt) : "No pending locks"}
          />
          <StatCard label="Sync" value={isConnected ? "Live" : "Idle"} note={isConnected ? "On-chain state" : "Connect to load"} />
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <WithdrawButton maturedCount={summary.maturedCount} onDone={() => void refetch()} />
          <Link
            href="/records"
            className="flex items-center justify-center rounded-[22px] border border-[var(--line)] bg-white/80 px-4 py-4 text-sm font-semibold text-[var(--text)]"
          >
            View Records
          </Link>
        </div>
      </section>

      {!isConnected ? (
        <EmptyPanel title="Wallet not connected" note="The dashboard stays visible first. Connect when you want your live lock state." />
      ) : null}

      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="text-sm font-semibold text-[var(--text)]">Recent Locks</div>
          <button type="button" onClick={() => void refetch()} className="text-xs font-semibold text-[var(--primary)]">
            Refresh
          </button>
        </div>
        {isLoading ? <EmptyPanel title="Loading locks" note="Pulling your on-chain lock list from Base." /> : null}
        {!isLoading && recent.length === 0 ? (
          <EmptyPanel title="No locks yet" note="Create your first ETH or ERC20 lock to start tracking maturity." action={<Link href="/create" className="rounded-full bg-[var(--text)] px-4 py-2 text-xs font-semibold text-white">Create first lock</Link>} />
        ) : null}
        {!isLoading && recent.map((lock) => <LockCard key={lock.index} lock={lock} />)}
      </section>
    </div>
  );
}


