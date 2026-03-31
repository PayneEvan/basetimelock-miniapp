"use client";

import type { ReactNode } from "react";

import { BottomNav } from "@/components/layouts/bottom-nav";
import { TopBar } from "@/components/layouts/top-bar";

export function AppFrame({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 pb-28 pt-5">
      <TopBar />
      <main className="flex-1">{children}</main>
      <BottomNav />
    </div>
  );
}


