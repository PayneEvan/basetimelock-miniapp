"use client";

import { useAccount } from "wagmi";
import { base } from "wagmi/chains";

export function NetworkPill() {
  const { chainId, isConnected } = useAccount();

  if (!isConnected) {
    return <div className="rounded-full bg-[var(--surface)] px-3 py-1 text-[11px] font-medium text-[var(--muted)]">Base Mainnet</div>;
  }

  const isBase = chainId === base.id;

  return (
    <div
      className={`rounded-full px-3 py-1 text-[11px] font-medium ${
        isBase ? "bg-[var(--success-soft)] text-[var(--success)]" : "bg-[var(--warning-soft)] text-[var(--warning)]"
      }`}
    >
      {isBase ? "On Base" : "Switch to Base"}
    </div>
  );
}


