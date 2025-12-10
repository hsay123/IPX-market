"use client"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle2, Download, ExternalLink, Copy, Mail, ArrowLeft, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function OrderSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()

  const txHash = searchParams.get("tx")
  const itemType = searchParams.get("type")
  const itemTitle = searchParams.get("itemTitle")
  const buyer = searchParams.get("buyer")

  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [remainingDownloads, setRemainingDownloads] = useState<number | null>(null)

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      const response = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          txHash: txHash,
          buyerAddress: buyer,
          itemType: itemType,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[v0] Download API error:", response.status, errorText)
        toast({
          title: "Download failed",
          description: `Server error: ${response.status}`,
          variant: "destructive",
        })
        return
      }

      const contentType = response.headers.get("content-type")
      if (!contentType?.includes("application/json")) {
        console.error("[v0] Invalid response type:", contentType)
        toast({
          title: "Download failed",
          description: "Invalid server response",
          variant: "destructive",
        })
        return
      }

      const data = await response.json()

      if (data.success) {
        setDownloadUrl(data.downloadUrl)
        setRemainingDownloads(data.remainingDownloads)
        window.open(data.downloadUrl, "_blank")
        toast({
          title: "Download started",
          description: `You have ${data.remainingDownloads} downloads remaining.`,
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
      setIsDownloading(false)
    }
  }

  const copyTxHash = () => {
    if (txHash) {
      navigator.clipboard.writeText(txHash)
      toast({
        title: "Copied!",
        description: "Transaction hash copied to clipboard",
      })
    }
  }

  const handleEmailReceipt = async () => {
    try {
      const userEmail = prompt("Enter your email address to receive the receipt:")
      if (!userEmail) return

      const response = await fetch("/api/email/receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: userEmail,
          txHash: txHash,
          itemTitle: itemTitle,
          itemType: itemType,
          amount: "0.001",
          downloadUrl: downloadUrl,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Receipt sent",
          description: `Receipt has been sent to ${userEmail}`,
        })
      } else {
        toast({
          title: "Failed to send receipt",
          description: data.error || "Please try again",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[v0] Error sending receipt:", error)
      toast({
        title: "Error",
        description: "Failed to send receipt email",
        variant: "destructive",
      })
    }
  }

  const explorerUrl = `${process.env.NEXT_PUBLIC_STORYSCAN || "https://aeneid.storyscan.io"}/tx/${txHash}`

  if (!txHash) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Invalid Order</h1>
          <p className="text-gray-400 mb-6">No transaction information found</p>
          <Link href="/explore">
            <Button>Return to Marketplace</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <>
          <div className="text-center mb-8">
            <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-2">Purchase Successful!</h1>
            <p className="text-gray-400">Your {itemType || "purchase"} is ready</p>
          </div>

          <Card className="p-6 mb-6 bg-white/5 border-white/10">
            <h2 className="text-xl font-bold mb-4 text-background">{itemTitle || "Product"}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-background">Type</p>
                <p className="font-mono capitalize text-background">{itemType || "Unknown"}</p>
              </div>
              <div>
                <p className="text-sm text-background">Buyer</p>
                <p className="font-mono text-xs text-background">
                  {buyer?.slice(0, 10)}...{buyer?.slice(-8)}
                </p>
              </div>
            </div>

            <Button className="w-full mb-4" size="lg" onClick={handleDownload} disabled={isDownloading}>
              {isDownloading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Generating Download Link...
                </>
              ) : (
                <>
                  <Download className="h-5 w-5 mr-2" />
                  Download Now
                </>
              )}
            </Button>

            {remainingDownloads !== null && (
              <p className="text-sm text-center text-gray-400">{remainingDownloads} downloads remaining</p>
            )}
          </Card>

          <Card className="p-6 mb-6 bg-white/5 border-white/10">
            <h3 className="font-bold mb-4 text-white">Transaction Details</h3>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-background">Transaction Hash</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono text-sm break-all flex-1 text-background">{txHash}</p>
                  <Button size="sm" variant="ghost" onClick={copyTxHash}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <a
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#602fc0] hover:text-[#7040d0] transition-colors"
              >
                View on StoryScan <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Button variant="outline" onClick={copyTxHash}>
              <Copy className="h-4 w-4 mr-2" />
              Copy Transaction Link
            </Button>
            <Button variant="outline" onClick={handleEmailReceipt}>
              <Mail className="h-4 w-4 mr-2" />
              Email Receipt
            </Button>
          </div>

          <div className="text-center">
            <Link href="/explore">
              <Button variant="outline" size="lg">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Return to Marketplace
              </Button>
            </Link>
          </div>
        </>
      </div>
    </div>
  )
}
