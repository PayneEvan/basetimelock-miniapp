"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Address, PublicClient, zeroAddress } from "viem";
import { usePublicClient } from "wagmi";

import { baseTimeLockAbi } from "@/lib/abis/base-time-lock";
import { erc20Abi } from "@/lib/abis/erc20";
import { BASE_TIME_LOCK_ADDRESS } from "@/lib/config/contracts";

export type LockItem = {
  index: number;
  token: Address;
  amount: bigint;
  unlockAt: number;
  isMatured: boolean;
  isEth: boolean;
  symbol: string;
  decimals: number;
};

async function getTokenMeta(publicClient: PublicClient, token: Address) {
  try {
    const [symbol, decimals] = await Promise.all([
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
    ]);

    return {
      symbol,
      decimals: Number(decimals),
    };
  } catch {
    return {
      symbol: "TOKEN",
      decimals: 18,
    };
  }
}

export function useTimeLockData(address?: Address) {
  const publicClient = usePublicClient();

  const query = useQuery({
    queryKey: ["time-lock-data", address],
    enabled: Boolean(publicClient) && Boolean(address),
    queryFn: async () => {
      if (!address || !publicClient) {
        return { locks: [] as LockItem[] };
      }

      const count = await publicClient.readContract({
        address: BASE_TIME_LOCK_ADDRESS,
        abi: baseTimeLockAbi,
        functionName: "locksCount",
        args: [address],
      });

      const tokenMeta = new Map<string, { symbol: string; decimals: number }>();
      const indexes = Array.from({ length: Number(count) }, (_, index) => index);

      const locks = await Promise.all(
        indexes.map(async (index) => {
          const [token, amount, unlockAt] = await publicClient.readContract({
            address: BASE_TIME_LOCK_ADDRESS,
            abi: baseTimeLockAbi,
            functionName: "lockAt",
            args: [address, BigInt(index)],
          });

          if (token === zeroAddress) {
            return {
              index,
              token,
              amount,
              unlockAt: Number(unlockAt),
              isMatured: Number(unlockAt) <= Math.floor(Date.now() / 1000),
              isEth: true,
              symbol: "ETH",
              decimals: 18,
            } satisfies LockItem;
          }

          const normalized = token.toLowerCase();
          if (!tokenMeta.has(normalized)) {
            tokenMeta.set(normalized, await getTokenMeta(publicClient, token));
          }

          const meta = tokenMeta.get(normalized)!;

          return {
            index,
            token,
            amount,
            unlockAt: Number(unlockAt),
            isMatured: Number(unlockAt) <= Math.floor(Date.now() / 1000),
            isEth: false,
            symbol: meta.symbol,
            decimals: meta.decimals,
          } satisfies LockItem;
        }),
      );

      return { locks };
    },
    refetchInterval: 15000,
  });

  const summary = useMemo(() => {
    const locks = query.data?.locks ?? [];
    const matured = locks.filter((item) => item.isMatured);
    const nextUnlock =
      locks
        .filter((item) => !item.isMatured)
        .sort((left, right) => left.unlockAt - right.unlockAt)[0] ?? null;

    return {
      locks,
      totalCount: locks.length,
      maturedCount: matured.length,
      nextUnlock,
    };
  }, [query.data]);

  return {
    ...query,
    locks: summary.locks,
    summary,
  };
}