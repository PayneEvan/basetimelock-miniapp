export const baseTimeLockAbi = [
  {
    type: "function",
    stateMutability: "payable",
    name: "depositETH",
    inputs: [{ name: "unlockAt", type: "uint256" }],
    outputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    name: "depositERC20",
    inputs: [
      { name: "token", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "unlockAt", type: "uint256" },
    ],
    outputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    name: "withdrawMatured",
    inputs: [],
    outputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    name: "locksCount",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    stateMutability: "view",
    name: "lockAt",
    inputs: [
      { name: "user", type: "address" },
      { name: "idx", type: "uint256" },
    ],
    outputs: [
      { name: "token", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "unlockAt", type: "uint256" },
    ],
  },
  {
    type: "function",
    stateMutability: "view",
    name: "MAX_LOCKS_PER_USER",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;


