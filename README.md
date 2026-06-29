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
```

Start the production server:

```bash
npm run start
```

Run linting:

```bash
npm run lint
```

## Available Scripts

### `npm run dev`

Starts the Next.js development server.

### `npm run build`

Creates a production build.

### `npm run start`

Runs the production build locally.

### `npm run lint`

Runs the project lint checks.

## Usage

1. Open the app in a browser.
2. Connect a supported wallet.
3. Review the dashboard summary.
4. Create a new ETH or ERC20 asset lock.
5. Wait until the configured unlock time has passed.
6. Withdraw matured locks when available.

## Creating an ETH Lock

To create an ETH lock, choose the ETH option, enter the amount, select the unlock time, and submit the transaction.

The app uses the contract method:

```solidity
depositETH(unlockAt)
```

## Creating an ERC20 Asset Lock

To create an ERC20 asset lock, enter the ERC20 contract address, amount, and unlock time.

The app first requests approval and then deposits the asset into the time lock contract.

The app uses the contract flow:

```solidity
approve(...)
depositERC20(token, amount, unlockAt)
```

## Withdrawing Matured Locks

When one or more locks have matured, the dashboard identifies them as ready to withdraw.

Use the withdrawal action to call:

```solidity
withdrawMatured()
```

This withdraws all matured locks available through the contract method.

## Deployment

The app is designed for deployment on Vercel.

No environment variables are required for the default setup.

## Project Notes

- Wallet connectors are limited to Coinbase Wallet and injected wallets.
- Base Mini App metadata is hardcoded in the root layout head output.
