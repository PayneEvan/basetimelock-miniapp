"use client";

import { useMemo } from "react";
import { useAccount, useConnect } from "wagmi";

import { shortenAddress } from "@/lib/utils/format";

export function ConnectChip() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();

  const primaryConnector = useMemo(
    () => connectors.find((connector) => connector.id.toLowerCase().includes("coinbase")) ?? connectors[0],
    [connectors],
  );

  if (isConnected) {
    return <div className="rounded-full bg-[var(--surface-strong)] px-3 py-2 text-xs font-semibold text-[var(--text)] shadow-sm">{shortenAddress(address)}</div>;
  }

  return (
    <button
      type="button"
      onClick={() => primaryConnector && connect({ connector: primaryConnector })}
      disabled={!primaryConnector || isPending}
      className="rounded-full bg-[var(--text)] px-4 py-2 text-xs font-semibold text-white transition disabled:opacity-50"
    >
      {isPending ? "Connecting" : "Connect"}
    </button>
  );
}


