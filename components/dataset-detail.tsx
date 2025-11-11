"use client"

import { useEffect, useState } from "react"
import { useWeb3 } from "@/lib/web3"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Star, Download, Eye, Calendar, FileType, HardDrive, Shield } from "lucide-react"
import Link from "next/link"
import { SetupBanner } from "@/components/setup-banner"
import { PurchaseButton } from "@/components/purchase-button"

interface DatasetWithOwner {
  id: number
  title: string
  description: string
  category: string
  price: number
  file_url: string
  file_size: number
  file_type: string
  preview_url: string | null
  owner_wallet: string
  username: string | null
  owner_avatar: string | null
  ip_asset_id: string | null
  downloads: number
  views: number
  rating: number
  rating_count: number
  created_at: string
}

export function DatasetDetail({ id }: { id: string }) {
  const { account } = useWeb3()
  const [dataset, setDataset] = useState<DatasetWithOwner | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [needsSetup, setNeedsSetup] = useState(false)

  useEffect(() => {
    const fetchDataset = async () => {
      try {
        const response = await fetch(`/api/datasets/${id}`)
        const data = await response.json()

        if (data.needsSetup || response.status === 503) {
          setNeedsSetup(true)
          setIsLoading(false)
          return
        }

        if (!response.ok || !data.dataset) {
          setDataset(null)
          setIsLoading(false)
          return
        }

        setDataset(data.dataset)
      } catch (error) {
        console.error("[v0] Error fetching dataset:", error)
        setDataset(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDataset()
  }, [id])

  if (needsSetup) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-12">
        <SetupBanner />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/2 mb-4" />
            <div className="h-4 bg-muted rounded w-full mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-96 bg-muted rounded" />
              </div>
              <div className="h-96 bg-muted rounded" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!dataset) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto text-center py-20">
          <h2 className="text-2xl font-bold mb-4">Dataset not found</h2>
          <Button asChild>
            <Link href="/datasets">Browse Datasets</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Badge className="mb-4 bg-[#602fc0] text-white border-[#602fc0]">{dataset.category}</Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-balance text-white">{dataset.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
              <span>
                {Number(dataset.rating).toFixed(1)} ({dataset.rating_count} reviews)
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              <span>{dataset.downloads} downloads</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{dataset.views} views</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {dataset.preview_url && (
              <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
                <CardContent className="p-0">
                  <div className="aspect-video w-full overflow-hidden rounded-lg">
                    <img
                      src={dataset.preview_url || "/placeholder.svg"}
                      alt={dataset.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-white/5 backdrop-blur-xl border-[rgba(88,43,177,1)]">
              <CardHeader>
                <CardTitle className="text-white">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 whitespace-pre-wrap">{dataset.description}</p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-xl border-[rgba(88,43,177,1)]">
              <CardHeader>
                <CardTitle className="text-white">Dataset Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <FileType className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-400">File Type</span>
                  </div>
                  <span className="font-medium text-white">{dataset.file_type}</span>
                </div>
                <Separator className="bg-white/10" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <HardDrive className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-400">File Size</span>
                  </div>
                  <span className="font-medium text-white">{(dataset.file_size / 1073741824).toFixed(2)} GB</span>
                </div>
                <Separator className="bg-white/10" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-400">Published</span>
                  </div>
                  <span className="font-medium text-white">{new Date(dataset.created_at).toLocaleDateString()}</span>
                </div>
                {dataset.ip_asset_id && (
                  <>
                    <Separator className="bg-white/10" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm">
                        <Shield className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-400">IP Protection</span>
                      </div>
                      <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                        Story Protocol
                      </Badge>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-white/5 backdrop-blur-xl border-[rgba(88,43,177,1)]">
              <CardHeader>
                <CardTitle className="text-white">Purchase</CardTitle>
                <CardDescription className="text-gray-400">Get instant access to this dataset</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold font-mono text-white">{dataset.price} ETH</div>
                <PurchaseButton
                  itemId={dataset.id}
                  itemTitle={dataset.title}
                  itemType="dataset"
                  price={dataset.price}
                  className="w-full bg-[#5027a0] hover:bg-[#602fc0] text-white rounded-full"
                />
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-xl border-[rgba(88,43,177,1)]">
              <CardHeader>
                <CardTitle className="text-white">Creator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-xl border border-[#602fc0] flex items-center justify-center text-[#602fc0] font-bold">
                    {dataset.username?.[0]?.toUpperCase() || dataset.owner_wallet[2]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate text-white">{dataset.username || "Anonymous"}</div>
                    <div className="text-xs text-gray-400 font-mono truncate">
                      {dataset.owner_wallet.slice(0, 6)}...{dataset.owner_wallet.slice(-4)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
