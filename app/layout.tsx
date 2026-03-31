import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

import { AppFrame } from "@/components/layouts/app-frame";
import { Providers } from "@/components/providers";
import { APP_NAME, BASE_APP_ID, TALENT_VERIFICATION } from "@/lib/config/contracts";

export const metadata: Metadata = {
  title: APP_NAME,
  description: "Track, create, and withdraw ETH or ERC20 time locks on Base.",
  other: {
    "base:app_id": BASE_APP_ID,
    "talentapp:project_verification": TALENT_VERIFICATION,
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AppFrame>{children}</AppFrame>
        </Providers>
      </body>
    </html>
  );
}


