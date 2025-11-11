"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, ExternalLink, Loader2 } from "lucide-react"

interface StoryRegisterCardProps {
  nftData: { contractAddress: string; tokenId: string } | null
  onComplete: (ipId: string) => void
}

export function StoryRegisterCard({ nftData, onComplete }: StoryRegisterCardProps) {
  const [isRegistering, setIsRegistering] = useState(false)
  const [ipId, setIpId] = useState<string | null>(null)
  const [txHash, setTxHash] = useState<string | null>(null)

  const handleRegister = async () => {
    if (!nftData) {
      alert("NFT data is required to register IP")
      return
    }

    setIsRegistering(true)

    try {
      const response = await fetch("/api/story/register", {
        method: "POST",
        body: JSON.stringify({
          nftContractAddress: nftData.contractAddress,
          tokenId: nftData.tokenId,
        }),
        headers: { "Content-Type": "application/json" },
      })

      if (!response.ok) throw new Error("IP registration failed")

      const data = await response.json()
      setIpId(data.ipId)
      setTxHash(data.txHash)
      onComplete(data.ipId)
    } catch (error) {
      console.error("[v0] Story Protocol registration error:", error)
      alert("Failed to register IP. Please try again.")
    } finally {
      setIsRegistering(false)
    }
  }

  if (!nftData) {
    return (
      <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white">Register IP Asset</CardTitle>
          <CardDescription className="text-gray-400">
            NFT minting was skipped, IP registration unavailable
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => onComplete("")} className="w-full rounded-full bg-white/10 hover:bg-white/20">
            Skip IP Registration
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-white">Register IP Asset</CardTitle>
        <CardDescription className="text-gray-400">
          Register your NFT with Story Protocol for IP protection
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <p className="text-sm text-gray-400 mb-2">NFT Details</p>
          <div className="space-y-1 text-xs">
            <p className="text-gray-300">
              <span className="text-gray-400">Token ID:</span> <span className="font-mono">{nftData.tokenId}</span>
            </p>
            <p className="text-gray-300">
              <span className="text-gray-400">Contract:</span>{" "}
              <span className="font-mono break-all">{nftData.contractAddress}</span>
            </p>
          </div>
        </div>

        {ipId && (
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
            <p className="text-sm font-medium text-green-400 mb-2 flex items-center gap-2">
              <Check className="w-4 h-4" /> IP Registered Successfully
            </p>
            <div className="space-y-1 text-xs">
              <p className="text-gray-300">
                <span className="text-gray-400">IP Asset ID:</span> <span className="font-mono break-all">{ipId}</span>
              </p>
              {txHash && (
                <a
                  href={`https://etherscan.io/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 hover:text-green-300 flex items-center gap-1"
                >
                  View Transaction <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        )}

        {!ipId && (
          <Button
            onClick={handleRegister}
            disabled={isRegistering}
            className="w-full rounded-full"
            style={{ backgroundColor: "#5027a0" }}
          >
            {isRegistering ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Registering...
              </>
            ) : (
              "Register IP Asset"
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
