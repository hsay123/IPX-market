"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useWeb3 } from "@/lib/web3"
import { Download, ExternalLink, Loader2, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface Purchase {
  orderId: string
  productTitle: string
  productId: string
  txHash: string
  createdAt: string
  status: string
  checksum: string
  version: string
  fileSize: number
}

export default function PurchasesPage() {
  const { account, connect, isConnecting } = useWeb3()
  const { toast } = useToast()

  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isDownloading, setIsDownloading] = useState<string | null>(null)

  // Fetch purchases when account connects
  useEffect(() => {
    if (account) {
      fetchPurchases()
    }
  }, [account])

  const fetchPurchases = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/orders?buyer=${account}`)
      const data = await response.json()

      if (data.success && data.orders) {
        const formattedPurchases = data.orders.map((order: any) => ({
          orderId: order.order_id,
          productTitle: order.title || "Product",
          productId: order.product_id,
          txHash: order.tx_hash,
          createdAt: new Date(order.created_at).toLocaleDateString(),
          status: order.status,
          checksum: order.checksum || "N/A",
          version: order.version || "1.0.0",
          fileSize: order.file_size || 0,
        }))
        setPurchases(formattedPurchases)
      }
    } catch (error) {
      console.error("[v0] Error fetching purchases:", error)
      toast({
        title: "Failed to load purchases",
        description: "Could not fetch your purchase history",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = async (purchase: Purchase) => {
    setIsDownloading(purchase.orderId)
    try {
      const response = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: purchase.orderId,
          buyerAddress: account,
        }),
      })

      const data = await response.json()

      if (data.success) {
        window.open(data.downloadUrl, "_blank")
        toast({
          title: "Download started",
          description: `${data.remainingDownloads} downloads remaining`,
        })
      } else {
        toast({
          title: "Download failed",
          description: data.error || "Failed to generate download link",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[v0] Download error:", error)
      toast({
        title: "Download failed",
        description: "An error occurred while generating the download link",
        variant: "destructive",
      })
    } finally {
      setIsDownloading(null)
    }
  }

  const explorerUrl = (txHash: string) =>
    `${process.env.NEXT_PUBLIC_STORYSCAN || "https://aeneid.storyscan.io"}/tx/${txHash}`

  if (!account) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <ShoppingBag className="h-20 w-20 text-gray-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">My Purchases</h1>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Connect your wallet to view your purchased datasets and AI models
          </p>
          <Button size="lg" onClick={connect} disabled={isConnecting}>
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Purchases</h1>
          <p className="text-gray-400">
            Connected: {account?.slice(0, 6)}...{account?.slice(-4)}
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="h-12 w-12 text-[#602fc0] mx-auto mb-4 animate-spin" />
            <p className="text-gray-400">Loading your purchases...</p>
          </div>
        ) : purchases.length === 0 ? (
          <Card className="p-12 text-center bg-white/5 border-white/10">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">No purchases yet</h2>
            <p className="text-gray-400 mb-6">Start exploring and purchase your first dataset or AI model</p>
            <Link href="/explore">
              <Button>Explore Marketplace</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid gap-4">
            {purchases.map((purchase) => (
              <Card
                key={purchase.orderId}
                className="p-6 bg-white/5 border-white/10 hover:border-white/20 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{purchase.productTitle}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-400 mb-4">
                      <div>
                        <p className="text-xs uppercase tracking-wide">Purchased</p>
                        <p className="text-white">{purchase.createdAt}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wide">Version</p>
                        <p className="text-white">{purchase.version}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wide">File Size</p>
                        <p className="text-white">{(purchase.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">Checksum (SHA-256)</p>
                      <p className="font-mono text-xs bg-black/30 p-2 rounded break-all">{purchase.checksum}</p>
                    </div>

                    <a
                      href={explorerUrl(purchase.txHash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[#602fc0] hover:text-[#7040d0] text-sm transition-colors"
                    >
                      View Transaction <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>

                  <Button
                    onClick={() => handleDownload(purchase)}
                    disabled={isDownloading === purchase.orderId}
                    size="lg"
                    className="whitespace-nowrap"
                  >
                    {isDownloading === purchase.orderId ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download className="h-5 w-5 mr-2" />
                        Download
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
