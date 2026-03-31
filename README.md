# BaseTimeLock Mini App

BaseTimeLock is a lightweight Base Mini App for creating, tracking, and withdrawing ETH or ERC20 time locks from the `BaseTimeLock` contract on Base mainnet.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- wagmi
- viem
- Vercel-ready deployment

## Contract

- Contract name: `BaseTimeLock`
- Network: Base Mainnet
- Address: `0x87f6c2850bdcd3c90020dd06dfce234a7c1efb97`
- Builder code: `bc_ty0th80a`
- Builder code hex: `0x62635f74793074683830610b0080218021802180218021802180218021`

## Features

- Overview-first dashboard with matured count, total locks, and next unlock
- Create ETH locks with `depositETH(unlockAt)`
- Create ERC20 locks with `approve -> depositERC20(token, amount, unlockAt)`
- Read `locksCount(address)` and `lockAt(address, idx)` live from chain
- Detect matured vs pending locks
- Withdraw all matured locks with `withdrawMatured()`
- Append the encoded builder attribution suffix to write transactions

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Local Run

1. Install dependencies with `npm install`
2. Start development with `npm run dev`
3. Build for production with `npm run build`

## Deployment

The app is designed for Vercel deployment with no required environment variables.

## Notes

- Wallet connectors are limited to Coinbase Wallet and injected wallets.
- Base Mini App metadata is hardcoded in the root layout head output.
- The app icon is included as `app/icon.svg`.

