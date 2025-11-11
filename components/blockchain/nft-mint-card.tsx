"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Check, ExternalLink, Loader2 } from "lucide-react"
import { useWeb3 } from "@/lib/web3"

interface NFTMintCardProps {
  metadataCid: string
  onComplete: (nftData: { contractAddress: string; tokenId: string; txHash: string } | null) => void
}

export function NFTMintCard({ metadataCid, onComplete }: NFTMintCardProps) {
  const { account } = useWeb3()
  const [mintAsNFT, setMintAsNFT] = useState(false)
  const [isMinting, setIsMinting] = useState(false)
  const [gasEstimate, setGasEstimate] = useState<{ gasEstimate: string; gasCost: string } | null>(null)
  const [nftData, setNftData] = useState<{ contractAddress: string; tokenId: string; txHash: string } | null>(null)

  useEffect(() => {
    if (mintAsNFT && account) {
      fetch("/api/nft/estimate-gas")
        .then((res) => res.json())
        .then((data) => setGasEstimate(data))
    }
  }, [mintAsNFT, account])

  const handleMint = async () => {
    if (!account) {
      alert("Please connect your wallet")
      return
    }

    setIsMinting(true)

    try {
      const response = await fetch("/api/nft/mint", {
        method: "POST",
        body: JSON.stringify({
          metadataCid,
          owner: account,
        }),
        headers: { "Content-Type": "application/json" },
      })

      if (!response.ok) throw new Error("Minting failed")

      const data = await response.json()
      setNftData(data)
      onComplete(data)
    } catch (error) {
      console.error("[v0] NFT minting error:", error)
      alert("Failed to mint NFT. Please try again.")
    } finally {
      setIsMinting(false)
    }
  }

  const handleSkip = () => {
    onComplete(null)
  }

  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-white">Mint as NFT</CardTitle>
        <CardDescription className="text-gray-400">
          Create an NFT to represent ownership of your dataset
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
          <div>
            <Label htmlFor="mint-nft" className="text-white font-medium">
              Enable NFT Minting
            </Label>
            <p className="text-xs text-gray-400 mt-1">Mint an ERC-721 token for your dataset</p>
          </div>
          <Switch id="mint-nft" checked={mintAsNFT} onCheckedChange={setMintAsNFT} />
        </div>

        {mintAsNFT && gasEstimate && (
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <p className="text-sm text-blue-400 mb-2">Gas Estimate</p>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-gray-400">Gas Units</p>
                <p className="text-white font-mono">{gasEstimate.gasEstimate}</p>
              </div>
              <div>
                <p className="text-gray-400">Estimated Cost</p>
                <p className="text-white font-mono">{gasEstimate.gasCost} ETH</p>
              </div>
            </div>
          </div>
        )}

        {nftData && (
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
            <p className="text-sm font-medium text-green-400 mb-2 flex items-center gap-2">
              <Check className="w-4 h-4" /> NFT Minted Successfully
            </p>
            <div className="space-y-1 text-xs">
              <p className="text-gray-300">
                <span className="text-gray-400">Token ID:</span> <span className="font-mono">{nftData.tokenId}</span>
              </p>
              <p className="text-gray-300">
                <span className="text-gray-400">Contract:</span>{" "}
                <span className="font-mono break-all">{nftData.contractAddress}</span>
              </p>
              <a
                href={`https://etherscan.io/tx/${nftData.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-400 hover:text-green-300 flex items-center gap-1"
              >
                View on Etherscan <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}

        {!nftData && (
          <div className="flex gap-2">
            {mintAsNFT ? (
              <Button
                onClick={handleMint}
                disabled={isMinting || !account}
                className="flex-1 rounded-full"
                style={{ backgroundColor: "#5027a0" }}
              >
                {isMinting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Minting...
                  </>
                ) : (
                  "Mint NFT"
                )}
              </Button>
            ) : (
              <Button onClick={handleSkip} className="flex-1 rounded-full bg-white/10 hover:bg-white/20">
                Skip NFT Minting
              </Button>
            )}
          </div>
        )}

        {!account && <p className="text-xs text-center text-yellow-400">Connect your wallet to mint NFT</p>}
      </CardContent>
    </Card>
  )
}
