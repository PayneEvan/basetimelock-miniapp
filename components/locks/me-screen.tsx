"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { base } from "wagmi/chains";

import { BASE_TIME_LOCK_ADDRESS, BUILDER_CODE } from "@/lib/config/contracts";
import { useTimeLockData } from "@/lib/use-time-lock-data";
import { shortenAddress } from "@/lib/utils/format";

export function MeScreen() {
  const { address, chainId, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { summary } = useTimeLockData(address);

  const preferredConnectors = useMemo(
    () => connectors.filter((connector) => connector.id.toLowerCase().includes("coinbase") || connector.id.toLowerCase().includes("injected")),
    [connectors],
  );

  return (
    <div className="space-y-4">
      <section className="rounded-[32px] border border-[var(--line)] bg-[var(--surface-strong)] p-5 shadow-[var(--shadow)] backdrop-blur-xl">
        <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">Wallet State</div>
        <div className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[var(--text)]">{isConnected ? shortenAddress(address) : "Not connected"}</div>
        <div className="mt-2 text-sm text-[var(--muted)]">{chainId === base.id ? "Base Mainnet" : isConnected ? "Wrong network" : "Connect on Base"}</div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-[24px] bg-white/75 p-4">
            <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">Matured</div>
            <div className="mt-2 text-2xl font-semibold text-[var(--text)]">{summary.maturedCount}</div>
          </div>
          <div className="rounded-[24px] bg-white/75 p-4">
            <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">Total</div>
            <div className="mt-2 text-2xl font-semibold text-[var(--text)]">{summary.totalCount}</div>
          </div>
        </div>
      </section>

      <section className="rounded-[30px] border border-[var(--line)] bg-[var(--surface)] p-5">
        <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">Connectors</div>
        <div className="mt-4 grid gap-3">
          {preferredConnectors.map((connector) => (
            <button
              key={connector.id}
              type="button"
              onClick={() => connect({ connector })}
              disabled={isPending}
              className="rounded-[20px] border border-[var(--line)] bg-white px-4 py-3 text-left text-sm font-semibold text-[var(--text)] disabled:opacity-60"
            >
              Connect with {connector.name}
            </button>
          ))}
          {isConnected ? (
            <button type="button" onClick={() => disconnect()} className="rounded-[20px] bg-[var(--text)] px-4 py-3 text-sm font-semibold text-white">
              Disconnect
            </button>
          ) : null}
        </div>
      </section>

      <section className="rounded-[30px] border border-[var(--line)] bg-[var(--surface)] p-5">
        <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">Contract</div>
        <div className="mt-3 break-all text-sm font-medium text-[var(--text)]">{BASE_TIME_LOCK_ADDRESS}</div>
        <div className="mt-4 flex gap-3 text-sm font-semibold">
          <Link href="/create" className="text-[var(--primary)]">Create</Link>
          <Link href="/records" className="text-[var(--primary)]">Records</Link>
        </div>
      </section>

      <section className="rounded-[30px] border border-[var(--line)] bg-[var(--surface)] p-5">
        <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">Builder Code</div>
        <div className="mt-3 text-sm font-semibold text-[var(--text)]">{BUILDER_CODE}</div>
      </section>
    </div>
  );
}


