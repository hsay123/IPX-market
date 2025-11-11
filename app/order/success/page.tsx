"use client"

import { useEffect, useState } from "react"
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

  const [isVerifying, setIsVerifying] = useState(true)
  const [verificationError, setVerificationError] = useState<string | null>(null)
  const [orderData, setOrderData] = useState<any>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [remainingDownloads, setRemainingDownloads] = useState<number | null>(null)

  // Auto-poll for verification
  useEffect(() => {
    if (!txHash) {
      setVerificationError("No transaction hash provided")
      setIsVerifying(false)
      return
    }

    let pollCount = 0
    const maxPolls = 24 // 2 minutes (5 seconds * 24)

    const pollVerification = async () => {
      try {
        const response = await fetch(`/api/verify?tx=${txHash}`)
        const data = await response.json()

        if (data.verified && data.order) {
          setOrderData(data.order)
          setIsVerifying(false)
          return true
        }

        pollCount++
        if (pollCount >= maxPolls) {
          setVerificationError("Verification timeout. Your transaction may still be processing.")
          setIsVerifying(false)
          return true
        }

        return false
      } catch (error) {
        console.error("[v0] Verification poll error:", error)
        return false
      }
    }

    // Initial poll
    pollVerification().then((done) => {
      if (!done) {
        // Continue polling every 5 seconds
        const interval = setInterval(async () => {
          const done = await pollVerification()
          if (done) {
            clearInterval(interval)
          }
        }, 5000)

        return () => clearInterval(interval)
      }
    })
  }, [txHash])

  const handleDownload = async () => {
    if (!orderData?.orderId) return

    setIsDownloading(true)
    try {
      const response = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: orderData.orderId,
          buyerAddress: searchParams.get("buyer"),
        }),
      })

      const data = await response.json()

      if (data.success) {
        setDownloadUrl(data.downloadUrl)
        setRemainingDownloads(data.remainingDownloads)

        // Open download in new tab
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

  const handleEmailReceipt = () => {
    toast({
      title: "Email sent",
      description: "Receipt will be sent to your registered email",
    })
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
        {isVerifying ? (
          <div className="text-center py-20">
            <Loader2 className="h-16 w-16 text-[#602fc0] mx-auto mb-4 animate-spin" />
            <h1 className="text-3xl font-bold mb-2">Verifying Transaction...</h1>
            <p className="text-gray-400">Please wait while we confirm your purchase on the blockchain</p>
            <p className="text-sm text-gray-500 mt-2">This usually takes 10-30 seconds</p>
          </div>
        ) : verificationError ? (
          <div className="text-center py-20">
            <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Verification Pending</h1>
            <p className="text-gray-400 mb-6">{verificationError}</p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => window.location.reload()}>Retry</Button>
              <Link href="/purchases">
                <Button variant="outline">View My Purchases</Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Success Header */}
            <div className="text-center mb-8">
              <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto mb-4" />
              <h1 className="text-4xl font-bold mb-2">Purchase Successful!</h1>
              <p className="text-gray-400">Your {itemType} is ready to download</p>
            </div>

            {/* Product Details Card */}
            <Card className="p-6 mb-6 bg-white/5 border-white/10">
              <h2 className="text-xl font-bold mb-4">{orderData?.productTitle || "Product"}</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-400">Version</p>
                  <p className="font-mono">{orderData?.version || "1.0.0"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">File Size</p>
                  <p className="font-mono">
                    {orderData?.fileSize ? `${(orderData.fileSize / 1024 / 1024).toFixed(2)} MB` : "N/A"}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-400">Dataset Checksum (SHA-256)</p>
                  <p className="font-mono text-xs break-all bg-black/30 p-2 rounded">{orderData?.checksum || "N/A"}</p>
                </div>
              </div>

              {/* Download Button */}
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

            {/* Transaction Details Card */}
            <Card className="p-6 mb-6 bg-white/5 border-white/10">
              <h3 className="font-bold mb-4">Transaction Details</h3>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-400">Transaction Hash</p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-sm break-all flex-1">{txHash}</p>
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

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Button variant="outline" onClick={() => copyTxHash()}>
                <Copy className="h-4 w-4 mr-2" />
                Copy Transaction Link
              </Button>
              <Button variant="outline" onClick={handleEmailReceipt}>
                <Mail className="h-4 w-4 mr-2" />
                Email Receipt
              </Button>
            </div>

            {/* Return to Marketplace */}
            <div className="text-center">
              <Link href="/explore">
                <Button variant="outline" size="lg">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Return to Marketplace
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
