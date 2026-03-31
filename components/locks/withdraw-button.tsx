"use client";

import { useState } from "react";
import { usePublicClient, useWriteContract } from "wagmi";

import { baseTimeLockAbi } from "@/lib/abis/base-time-lock";
import { BASE_TIME_LOCK_ADDRESS } from "@/lib/config/contracts";
import { getDataSuffix } from "@/lib/attribution";

export function WithdrawButton({
  maturedCount,
  onDone,
  className,
}: {
  maturedCount: number;
  onDone?: () => void;
  className?: string;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const publicClient = usePublicClient();
  const { writeContractAsync, isPending } = useWriteContract();

  async function handleWithdraw() {
    try {
      if (!publicClient) {
        setMessage("Public client unavailable.");
        return;
      }

      setMessage("Submitting withdrawal...");
      const hash = await writeContractAsync({
        address: BASE_TIME_LOCK_ADDRESS,
        abi: baseTimeLockAbi,
        functionName: "withdrawMatured",
        dataSuffix: getDataSuffix(),
      });
      setMessage("Waiting for confirmation...");
      await publicClient.waitForTransactionReceipt({ hash });
      setMessage("Withdrawal complete.");
      onDone?.();
    } catch (error) {
      const nextMessage = error instanceof Error ? error.message : "Withdraw failed.";
      setMessage(nextMessage);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleWithdraw}
        disabled={maturedCount === 0 || isPending}
        className={className ?? "w-full rounded-[22px] bg-[var(--text)] px-4 py-4 text-sm font-semibold text-white disabled:opacity-50"}
      >
        {isPending ? "Processing" : maturedCount > 0 ? `Withdraw Matured (${maturedCount})` : "No Matured Locks"}
      </button>
      {message ? <p className="mt-2 text-xs text-[var(--muted)]">{message}</p> : null}
    </div>
  );
}