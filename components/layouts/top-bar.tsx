"use client";

import { usePathname } from "next/navigation";

import { ConnectChip } from "@/components/wallet/connect-chip";
import { NetworkPill } from "@/components/wallet/network-pill";

const titleMap: Record<string, string> = {
  "/": "Overview",
  "/create": "Create Lock",
  "/records": "Records",
  "/me": "My Space",
};

export function TopBar() {
  const pathname = usePathname();
  const title = pathname.startsWith("/locks/") ? "Lock Detail" : (titleMap[pathname] ?? "BaseTimeLock");

  return (
    <header className="mb-5 flex items-start justify-between gap-3">
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">BaseTimeLock</div>
        <h1 className="mt-2 text-[28px] font-semibold tracking-[-0.04em] text-[var(--text)]">{title}</h1>
      </div>
      <div className="flex flex-col items-end gap-2">
        <NetworkPill />
        <ConnectChip />
      </div>
    </header>
  );
}


