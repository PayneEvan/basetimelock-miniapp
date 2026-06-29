# BaseTimeLock Mini App

BaseTimeLock Mini App is a lightweight Base Mini App for creating, tracking, and withdrawing ETH or ERC20 time locks on Base mainnet.

The app provides a simple interface for interacting with the `BaseTimeLock` contract, including lock creation, status tracking, and matured lock withdrawal.

## Repository

https://github.com/PayneEvan/basetimelock-miniapp.git

## Overview

BaseTimeLock Mini App is built for users who want a compact dashboard for Base time locks.

It reads lock data directly from the Base mainnet contract and displays useful status information such as total locks, matured locks, and the next unlock time.

The app supports both ETH locks and ERC20 asset locks.

## Features

- Overview-first dashboard
- View matured lock count
- View total lock count
- View the next scheduled unlock
- Create ETH locks with `depositETH(unlockAt)`
- Create ERC20 locks with `approve` followed by `depositERC20(token, amount, unlockAt)`
- Read `locksCount(address)` live from chain
- Read `lockAt(address, idx)` live from chain
- Detect matured locks
- Detect pending locks
- Withdraw all matured locks with `withdrawMatured()`
- Append the encoded builder attribution suffix to write transactions
- Support Coinbase Wallet and injected wallets

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- wagmi
- viem
- Vercel-ready deployment

## Contract Details

- Contract name: `BaseTimeLock`
- Network: Base Mainnet
- Address: `0x87f6c2850bdcd3c90020dd06dfce234a7c1efb97`
- Builder code: `bc_ty0th80a`
- Builder code hex: `0x62635f74793074683830610b0080218021802180218021802180218021`

## Getting Started

Clone the repository:

```bash
git clone https://github.com/PayneEvan/basetimelock-miniapp.git
cd basetimelock-miniapp
```

Install dependencies:

```bash
npm install
```

Start the local development server:

```bash
npm run dev
```

Build the app for production:

```bash
npm run build
