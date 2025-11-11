"use client"

import type { ReactNode } from "react"

// Story Aeneid testnet chain configuration
const storyAeneid = {
  id: 1315,
  name: "Story Aeneid Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "IP",
    symbol: "IP",
  },
  rpcUrls: {
    default: { http: [process.env.NEXT_PUBLIC_AENEID_RPC || "https://testnet.storyrpc.io"] },
  },
  blockExplorers: {
    default: {
      name: "StoryScan",
      url: process.env.NEXT_PUBLIC_STORYSCAN || "https://testnet.storyscan.xyz",
    },
  },
  testnet: true,
} as const

export function StoryProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}
