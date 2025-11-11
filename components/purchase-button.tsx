"use client"

import { useState } from "react"
import { useWeb3 } from "@/lib/web3"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface PurchaseButtonProps {
  itemId: number
  itemTitle: string
  itemType: "dataset" | "model"
  price: number
  disabled?: boolean
  className?: string
}

export function PurchaseButton({ itemId, itemTitle, itemType, price, disabled, className }: PurchaseButtonProps) {
  const { account, connect } = useWeb3()
  const router = useRouter()
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePurchase = async () => {
    setError(null)

    // Connect wallet if not connected
    if (!account) {
      await connect()
      return
    }

    setIsPurchasing(true)

    try {
      const ethereum = (window as any).ethereum
      if (!ethereum) {
        throw new Error("MetaMask is not installed")
      }

      // Story Aeneid testnet configuration
      const AENEID_CHAIN_ID = "0x523" // 1315 in hex
      const AENEID_RPC = process.env.NEXT_PUBLIC_AENEID_RPC || "https://aeneid.storyrpc.io"

      // Check if we're on the correct network
      const currentChainId = await ethereum.request({ method: "eth_chainId" })

      if (currentChainId !== AENEID_CHAIN_ID) {
        try {
          await ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: AENEID_CHAIN_ID }],
          })
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            await ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: AENEID_CHAIN_ID,
                  chainName: "Story Aeneid Testnet",
                  nativeCurrency: {
                    name: "IP",
                    symbol: "IP",
                    decimals: 18,
                  },
                  rpcUrls: [AENEID_RPC],
                  blockExplorerUrls: [process.env.NEXT_PUBLIC_STORYSCAN || "https://aeneid.storyscan.io"],
                },
              ],
            })
          } else {
            throw switchError
          }
        }
      }

      const contractAddress = process.env.NEXT_PUBLIC_PAY_CONTRACT?.trim()

      if (!contractAddress || contractAddress === "") {
        throw new Error("Contract address not configured. Please set NEXT_PUBLIC_PAY_CONTRACT environment variable.")
      }

      if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress)) {
        throw new Error(`Invalid contract address format: ${contractAddress}`)
      }

      const valueInWei = "0x" + Math.floor(0.001 * 1e18).toString(16)

      // Send transaction
      const transactionHash = await ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: account,
            to: contractAddress,
            value: valueInWei,
          },
        ],
      })

      console.log("[v0] Transaction sent:", transactionHash)

      // Record transaction in background
      fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          txHash: transactionHash,
          itemType,
          itemId,
          buyerAddress: account,
          itemTitle,
          price: valueInWei,
        }),
      }).catch((err) => console.error("[v0] Failed to record transaction:", err))

      router.push(`/order/success?tx=${transactionHash}&type=${itemType}&buyer=${account}`)
    } catch (err: any) {
      console.error("[v0] Purchase error:", err)
      setError(err.message || "Transaction failed")
    } finally {
      setIsPurchasing(false)
    }
  }

  return (
    <div className="space-y-3">
      <Button className={className} size="lg" onClick={handlePurchase} disabled={disabled || isPurchasing}>
        {isPurchasing ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : !account ? (
          "Connect Wallet"
        ) : (
          `Purchase ${itemType === "dataset" ? "Dataset" : "Model"}`
        )}
      </Button>

      {!account && <p className="text-xs text-center text-gray-400">Connect your wallet to purchase</p>}

      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <div className="text-red-400 text-sm">{error}</div>
        </div>
      )}
    </div>
  )
}
