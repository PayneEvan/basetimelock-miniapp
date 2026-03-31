"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils/format";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/create", label: "Create" },
  { href: "/records", label: "Records" },
  { href: "/me", label: "Me" },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-4 left-1/2 z-30 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center justify-between rounded-[28px] border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-3 shadow-[var(--shadow)] backdrop-blur-xl">
      {navItems.map((item) => {
        const isActive = item.href === "/" ? pathname === item.href : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex min-w-[68px] flex-col items-center rounded-2xl px-3 py-2 text-xs font-semibold transition",
              isActive ? "bg-[var(--primary-soft)] text-[var(--primary)]" : "text-[var(--muted)]",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}


