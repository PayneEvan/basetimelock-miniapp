import { formatUnits } from "viem";

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function shortenAddress(value?: string | null) {
  if (!value) return "Not connected";
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

export function formatAmount(value: bigint, decimals: number, digits = 4) {
  const number = Number.parseFloat(formatUnits(value, decimals));
  if (!Number.isFinite(number)) return "0";
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  }).format(number);
}

export function formatDateTime(timestamp: number) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp * 1000));
}

export function formatCountdown(timestamp: number) {
  const diff = timestamp - Math.floor(Date.now() / 1000);
  if (diff <= 0) return "Matured";

  const days = Math.floor(diff / 86400);
  const hours = Math.floor((diff % 86400) / 3600);
  const minutes = Math.floor((diff % 3600) / 60);

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function toUnlockTimestamp(value: string) {
  return Math.floor(new Date(value).getTime() / 1000);
}

export function formatDateTimeInput(offsetHours = 1) {
  const date = new Date(Date.now() + offsetHours * 60 * 60 * 1000);
  const pad = (value: number) => value.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function isAddressLike(value: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(value);
}


