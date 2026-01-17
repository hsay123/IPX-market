"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

declare global {
  interface Window {
    ethereum?: any
  }
}

type Web3ContextType = {
  account: string | null
  isConnecting: boolean
  connect: () => Promise<void>
  disconnect: () => void
}

const Web3Context = createContext<Web3ContextType>({
  account: null,
  isConnecting: false,
  connect: async () => {},
  disconnect: () => {},
})

export function Web3Provider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  useEffect(() => {
    // Listen for account changes
    if (typeof window.ethereum !== "undefined") {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0])
        } else {
          setAccount(null)
        }
      })
    }

    return () => {
      if (typeof window.ethereum !== "undefined") {
        window.ethereum.removeListener("accountsChanged", () => {})
      }
    }
  }, [])

  const connect = async () => {
    if (isConnecting) {
      console.warn("[v0] Wallet connection already in progress")
      return
    }

    if (typeof window.ethereum === "undefined") {
      alert("Please install MetaMask to connect your wallet!")
      return
    }

    setIsConnecting(true)
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })
      setAccount(accounts[0])

      // Create or update user in database
      await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet_address: accounts[0] }),
      })
    } catch (error: any) {
      if (error?.code === 4001 || error?.message?.includes("rejected")) {
        console.log("[v0] User rejected wallet connection")
        // Don't show alert for user rejection - this is expected behavior
      } else {
        console.error("Error connecting wallet:", error)
        alert("Failed to connect wallet. Please try again.")
      }
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = () => {
    setAccount(null)
  }

  return <Web3Context.Provider value={{ account, isConnecting, connect, disconnect }}>{children}</Web3Context.Provider>
}

export function useWeb3() {
  return useContext(Web3Context)
}
