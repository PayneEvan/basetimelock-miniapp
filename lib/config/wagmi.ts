import { createConfig, http } from "wagmi";
import { base } from "wagmi/chains";
import { coinbaseWallet, injected } from "wagmi/connectors";

import { APP_NAME } from "@/lib/config/contracts";

export const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    coinbaseWallet({
      appName: APP_NAME,
      preference: "all",
    }),
    injected({
      shimDisconnect: true,
    }),
  ],
  transports: {
    [base.id]: http(),
  },
  ssr: true,
});


