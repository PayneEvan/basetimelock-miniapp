"use client";

import Link from "next/link";
import { useState } from "react";
import { useAccount } from "wagmi";

import { EmptyPanel } from "@/components/locks/empty-panel";
import { LockCard } from "@/components/locks/lock-card";
import { useTimeLockData } from "@/lib/use-time-lock-data";

const filters = ["all", "matured", "pending"] as const;

export function RecordsScreen() {
  const { address, isConnected } = useAccount();
  const { locks, isLoading } = useTimeLockData(address);
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");

  const filteredLocks = locks
    .filter((lock) => {
      if (filter === "all") return true;
      if (filter === "matured") return lock.isMatured;
      return !lock.isMatured;
    })
    .sort((left, right) => left.unlockAt - right.unlockAt);

  return (
    <div className="space-y-4">
      <section className="rounded-[30px] border border-[var(--line)] bg-[var(--surface-strong)] p-5 shadow-[var(--shadow)] backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">Record View</div>
            <div className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[var(--text)]">{locks.length} locks</div>
          </div>
          <Link href="/create" className="rounded-full bg-[var(--primary-soft)] px-4 py-2 text-xs font-semibold text-[var(--primary)]">
            New Lock
          </Link>
        </div>
        <div className="mt-4 flex gap-2 rounded-[22px] bg-white/80 p-1">
          {filters.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`flex-1 rounded-[18px] px-3 py-2 text-sm font-semibold ${filter === item ? "bg-[var(--text)] text-white" : "text-[var(--muted)]"}`}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      {!isConnected ? <EmptyPanel title="Connect to load records" note="Your records stay on-chain. Connect a wallet to query the current lock array." /> : null}
      {isConnected && isLoading ? <EmptyPanel title="Loading records" note="Reading each lock and token metadata from Base." /> : null}
      {isConnected && !isLoading && filteredLocks.length === 0 ? (
        <EmptyPanel title="No records in this view" note="Try another filter or create a new lock." action={<Link href="/create" className="rounded-full bg-[var(--text)] px-4 py-2 text-xs font-semibold text-white">Create Lock</Link>} />
      ) : null}
      {isConnected && !isLoading && filteredLocks.map((lock) => <LockCard key={lock.index} lock={lock} />)}
    </div>
  );
}


