"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Address, parseEther, parseUnits } from "viem";
import { useAccount, usePublicClient, useSwitchChain, useWriteContract } from "wagmi";
import { base } from "wagmi/chains";

import { baseTimeLockAbi } from "@/lib/abis/base-time-lock";
import { erc20Abi } from "@/lib/abis/erc20";
import { BASE_TIME_LOCK_ADDRESS } from "@/lib/config/contracts";
import { getDataSuffix } from "@/lib/attribution";
import { formatDateTimeInput, isAddressLike, toUnlockTimestamp } from "@/lib/utils/format";

const modes = [
  { id: "eth", label: "ETH" },
  { id: "erc20", label: "ERC20" },
] as const;

export function CreateLockForm() {
  const router = useRouter();
  const { address, chainId, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { switchChainAsync, isPending: isSwitching } = useSwitchChain();
  const { writeContractAsync, isPending } = useWriteContract();

  const [mode, setMode] = useState<(typeof modes)[number]["id"]>("eth");
  const [ethAmount, setEthAmount] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");
  const [unlockAt, setUnlockAt] = useState(formatDateTimeInput());
  const [status, setStatus] = useState<string | null>(null);

  const tokenQuery = useQuery({
    queryKey: ["create-token", tokenAddress, address],
    enabled: Boolean(publicClient) && mode === "erc20" && Boolean(address) && isAddressLike(tokenAddress),
    queryFn: async () => {
      if (!publicClient || !address) {
        throw new Error("Wallet client unavailable.");
      }

      const token = tokenAddress as Address;
      const [symbol, decimals, allowance] = await Promise.all([
        publicClient.readContract({
          address: token,
          abi: erc20Abi,
          functionName: "symbol",
        }),
        publicClient.readContract({
          address: token,
          abi: erc20Abi,
          functionName: "decimals",
        }),
        publicClient.readContract({
          address: token,
          abi: erc20Abi,
          functionName: "allowance",
          args: [address, BASE_TIME_LOCK_ADDRESS],
        }),
      ]);

      return {
        symbol,
        decimals: Number(decimals),
        allowance,
      };
    },
  });

  async function ensureBase() {
    if (chainId === base.id) return true;
    await switchChainAsync({ chainId: base.id });
    return true;
  }

  async function handleSubmit() {
    try {
      if (!isConnected || !address) {
        setStatus("Connect a wallet first.");
        return;
      }

      if (!publicClient) {
        setStatus("Public client unavailable.");
        return;
      }

      const unlockTimestamp = toUnlockTimestamp(unlockAt);
      if (!unlockTimestamp || unlockTimestamp <= Math.floor(Date.now() / 1000)) {
        setStatus("Pick a future unlock time.");
        return;
      }

      setStatus("Checking network...");
      await ensureBase();

      if (mode === "eth") {
        const value = parseEther(ethAmount || "0");
        if (value <= 0n) {
          setStatus("Enter an ETH amount.");
          return;
        }

        setStatus("Submitting ETH lock...");
        const hash = await writeContractAsync({
          address: BASE_TIME_LOCK_ADDRESS,
          abi: baseTimeLockAbi,
          functionName: "depositETH",
          args: [BigInt(unlockTimestamp)],
          value,
          dataSuffix: getDataSuffix(),
        });
        setStatus("Waiting for confirmation...");
        await publicClient.waitForTransactionReceipt({ hash });
        setStatus("ETH lock created.");
        router.push("/records");
        return;
      }

      if (!isAddressLike(tokenAddress)) {
        setStatus("Enter a valid token address.");
        return;
      }

      const token = tokenAddress as Address;
      const tokenMeta = tokenQuery.data ?? (await tokenQuery.refetch()).data;
      if (!tokenMeta) {
        setStatus("Token metadata unavailable.");
        return;
      }

      const value = parseUnits(tokenAmount || "0", tokenMeta.decimals);
      if (value <= 0n) {
        setStatus("Enter a token amount.");
        return;
      }

      if (tokenMeta.allowance < value) {
        setStatus(`Approving ${tokenMeta.symbol}...`);
        const approveHash = await writeContractAsync({
          address: token,
          abi: erc20Abi,
          functionName: "approve",
          args: [BASE_TIME_LOCK_ADDRESS, value],
          dataSuffix: getDataSuffix(),
        });
        await publicClient.waitForTransactionReceipt({ hash: approveHash });
        await tokenQuery.refetch();
        setStatus("Approval confirmed. Tap again to create the lock.");
        return;
      }

      setStatus(`Depositing ${tokenMeta.symbol}...`);
      const hash = await writeContractAsync({
        address: BASE_TIME_LOCK_ADDRESS,
        abi: baseTimeLockAbi,
        functionName: "depositERC20",
        args: [token, value, BigInt(unlockTimestamp)],
        dataSuffix: getDataSuffix(),
      });
      setStatus("Waiting for confirmation...");
      await publicClient.waitForTransactionReceipt({ hash });
      setStatus("ERC20 lock created.");
      router.push("/records");
    } catch (error) {
      const nextStatus = error instanceof Error ? error.message : "Transaction failed.";
      setStatus(nextStatus);
    }
  }

  const tokenMeta = tokenQuery.data;
  const approvalNeeded = (() => {
    if (mode !== "erc20" || !tokenMeta || !tokenAmount) {
      return false;
    }

    try {
      return tokenMeta.allowance < parseUnits(tokenAmount || "0", tokenMeta.decimals);
    } catch {
      return true;
    }
  })();

  return (
    <div className="space-y-4">
      <section className="rounded-[32px] border border-[var(--line)] bg-[var(--surface-strong)] p-5 shadow-[var(--shadow)] backdrop-blur-xl">
        <div className="flex rounded-[24px] bg-white/80 p-1">
          {modes.map((item) => {
            const active = mode === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setMode(item.id)}
                className={`flex-1 rounded-[18px] px-4 py-3 text-sm font-semibold ${active ? "bg-[var(--text)] text-white" : "text-[var(--muted)]"}`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="mt-5 space-y-4">
          {mode === "eth" ? (
            <label className="block">
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">ETH Amount</div>
              <input
                value={ethAmount}
                onChange={(event) => setEthAmount(event.target.value)}
                placeholder="0.15"
                inputMode="decimal"
                className="w-full rounded-[22px] border border-[var(--line)] bg-white/90 px-4 py-4 text-base"
              />
            </label>
          ) : (
            <>
              <label className="block">
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Token Address</div>
                <input
                  value={tokenAddress}
                  onChange={(event) => setTokenAddress(event.target.value.trim())}
                  placeholder="0x..."
                  className="w-full rounded-[22px] border border-[var(--line)] bg-white/90 px-4 py-4 text-sm"
                />
              </label>
              <label className="block">
                <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                  <span>Token Amount</span>
                  <span>{tokenMeta ? `${tokenMeta.symbol} / ${tokenMeta.decimals} dec` : "Waiting token"}</span>
                </div>
                <input
                  value={tokenAmount}
                  onChange={(event) => setTokenAmount(event.target.value)}
                  placeholder="250"
                  inputMode="decimal"
                  className="w-full rounded-[22px] border border-[var(--line)] bg-white/90 px-4 py-4 text-base"
                />
              </label>
            </>
          )}

          <label className="block">
            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Unlock Time</div>
            <input
              type="datetime-local"
              value={unlockAt}
              onChange={(event) => setUnlockAt(event.target.value)}
              className="w-full rounded-[22px] border border-[var(--line)] bg-white/90 px-4 py-4 text-base"
            />
          </label>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isPending || isSwitching}
          className="mt-5 w-full rounded-[24px] bg-[var(--primary)] px-4 py-4 text-sm font-semibold text-white disabled:opacity-60"
        >
          {isSwitching
            ? "Switching Network"
            : isPending
              ? "Waiting Wallet"
              : mode === "eth"
                ? "Create ETH Lock"
                : approvalNeeded
                  ? "Approve Token"
                  : "Create ERC20 Lock"}
        </button>

        {status ? <p className="mt-3 text-sm text-[var(--muted)]">{status}</p> : null}
      </section>

      <section className="grid grid-cols-2 gap-3">
        <div className="rounded-[26px] border border-[var(--line)] bg-[var(--surface)] p-4">
          <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">Flow</div>
          <div className="mt-2 text-sm font-semibold text-[var(--text)]">{"Approve -> Deposit"}</div>
          <div className="mt-1 text-xs text-[var(--muted)]">ERC20 only</div>
        </div>
        <div className="rounded-[26px] border border-[var(--line)] bg-[var(--surface)] p-4">
          <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">Network</div>
          <div className="mt-2 text-sm font-semibold text-[var(--text)]">Base Mainnet</div>
          <div className="mt-1 text-xs text-[var(--muted)]">Contract ready</div>
        </div>
      </section>

      <Link href="/records" className="block text-center text-sm font-semibold text-[var(--primary)]">
        Open records after submit
      </Link>
    </div>
  );
}