"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, ExternalLink, Share2 } from "lucide-react"
import Link from "next/link"

interface CompleteCardProps {
  datasetId: number
  blockchainData: {
    ipfsCid?: string
    metadataCid?: string
    nftData?: { contractAddress: string; tokenId: string; txHash: string } | null
    ipId?: string
    licenseTermsId?: string
  }
}

export function CompleteCard({ datasetId, blockchainData }: CompleteCardProps) {
  const shareUrl = `${window.location.origin}/datasets/${datasetId}`

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Check out my dataset",
        url: shareUrl,
      })
    } else {
      navigator.clipboard.writeText(shareUrl)
      alert("Link copied to clipboard!")
    }
  }

  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Check className="w-6 h-6 text-green-400" />
          Upload Complete!
        </CardTitle>
        <CardDescription className="text-gray-400">
          Your dataset has been successfully uploaded and registered
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-6 rounded-lg bg-gradient-to-br from-[#602fc0]/20 to-purple-900/20 border border-[#602fc0]/30">
          <h3 className="text-lg font-semibold text-white mb-4">Blockchain Summary</h3>
          <div className="space-y-3 text-sm">
            {blockchainData.ipfsCid && (
              <div className="flex items-start justify-between">
                <span className="text-gray-400">IPFS CID:</span>
                <span className="text-white font-mono text-xs break-all ml-2">{blockchainData.ipfsCid}</span>
              </div>
            )}
            {blockchainData.metadataCid && (
              <div className="flex items-start justify-between">
                <span className="text-gray-400">Metadata CID:</span>
                <span className="text-white font-mono text-xs break-all ml-2">{blockchainData.metadataCid}</span>
              </div>
            )}
            {blockchainData.nftData && (
              <>
                <div className="flex items-start justify-between">
                  <span className="text-gray-400">NFT Token ID:</span>
                  <span className="text-white font-mono text-xs">{blockchainData.nftData.tokenId}</span>
                </div>
                <div className="flex items-start justify-between">
                  <span className="text-gray-400">Contract:</span>
                  <span className="text-white font-mono text-xs break-all ml-2">
                    {blockchainData.nftData.contractAddress}
                  </span>
                </div>
              </>
            )}
            {blockchainData.ipId && (
              <div className="flex items-start justify-between">
                <span className="text-gray-400">IP Asset ID:</span>
                <span className="text-white font-mono text-xs break-all ml-2">{blockchainData.ipId}</span>
              </div>
            )}
            {blockchainData.licenseTermsId && (
              <div className="flex items-start justify-between">
                <span className="text-gray-400">License ID:</span>
                <span className="text-white font-mono text-xs break-all ml-2">{blockchainData.licenseTermsId}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Link href={`/datasets/${datasetId}`} className="flex-1">
            <Button className="w-full rounded-full" style={{ backgroundColor: "#5027a0" }}>
              <ExternalLink className="w-4 h-4 mr-2" />
              View Dataset
            </Button>
          </Link>
          <Button onClick={handleShare} className="rounded-full hover:bg-white/20 bg-primary">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>

        <Link href="/datasets" className="block">
          <Button variant="ghost" className="w-full text-gray-400 hover:text-white">
            Browse All Datasets
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
