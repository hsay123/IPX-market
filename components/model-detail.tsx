"use client"

import { useEffect, useState } from "react"
import { useWeb3 } from "@/lib/web3"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Star, Download, Eye, Calendar, FileType, HardDrive, Shield, Brain } from "lucide-react"
import Link from "next/link"
import { SetupBanner } from "@/components/setup-banner"
import { PurchaseButton } from "@/components/purchase-button"

interface ModelWithOwner {
  id: number
  name: string
  description: string
  category?: string
  model_type: string
  framework: string
  architecture?: string
  parameters?: string
  accuracy?: number
  price: number
  file_size: number
  license?: string
  tags?: string[]
  owner_wallet: string
  username: string | null
  owner_avatar: string | null
  ip_asset_id: string | null
  downloads: number
  views?: number
  rating: number
  created_at: string
  updated_at: string
}

export function ModelDetail({ id }: { id: string }) {
  const { account } = useWeb3()
  const [model, setModel] = useState<ModelWithOwner | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [needsSetup, setNeedsSetup] = useState(false)

  useEffect(() => {
    const fetchModel = async () => {
      try {
        const response = await fetch(`/api/models/${id}`)
        const data = await response.json()

        if (data.needsSetup || response.status === 503) {
          setNeedsSetup(true)
          setIsLoading(false)
          return
        }

        if (!response.ok || !data.model) {
          setModel(null)
          setIsLoading(false)
          return
        }

        setModel(data.model)
      } catch (error) {
        console.error("[v0] Error fetching model:", error)
        setModel(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchModel()
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

  if (!model) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto text-center py-20">
          <h2 className="text-2xl font-bold mb-4">Model not found</h2>
          <Button asChild>
            <Link href="/models">Browse Models</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-6">
          <Badge className="mb-4 bg-[#602fc0] text-white border-[#602fc0]">{model.category || model.model_type}</Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-balance text-white">{model.name}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
              <span>{Number(model.rating).toFixed(1)} reviews</span>
            </div>
            <div className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              <span>{model.downloads} downloads</span>
            </div>
            {model.views !== undefined && (
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{model.views} views</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Description and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description Card */}
            <Card className="bg-white/5 backdrop-blur-xl border-[rgba(88,43,177,1)]">
              <CardHeader>
                <CardTitle className="text-white">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 whitespace-pre-wrap">{model.description}</p>
              </CardContent>
            </Card>

            {/* Model Details Card */}
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
                  <span className="font-medium text-white">ZIP</span>
                </div>
                <Separator className="bg-white/10" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <HardDrive className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-400">File Size</span>
                  </div>
                  <span className="font-medium text-white">{(model.file_size / 1073741824).toFixed(2)} GB</span>
                </div>
                <Separator className="bg-white/10" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-400">Published</span>
                  </div>
                  <span className="font-medium text-white">{new Date(model.created_at).toLocaleDateString()}</span>
                </div>
                {model.framework && (
                  <>
                    <Separator className="bg-white/10" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm">
                        <Brain className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-400">Framework</span>
                      </div>
                      <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                        {model.framework}
                      </Badge>
                    </div>
                  </>
                )}
                {model.accuracy && (
                  <>
                    <Separator className="bg-white/10" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm">
                        <Star className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-400">Accuracy</span>
                      </div>
                      <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                        {model.accuracy}%
                      </Badge>
                    </div>
                  </>
                )}
                {model.ip_asset_id && (
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

          {/* Right Column - Purchase and Creator */}
          <div className="space-y-6">
            {/* Purchase Card */}
            <Card className="bg-white/5 backdrop-blur-xl border-[rgba(88,43,177,1)]">
              <CardHeader>
                <CardTitle className="text-white">Purchase</CardTitle>
                <CardDescription className="text-gray-400">Get instant access to this dataset</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold font-mono text-white">{model.price} ETH</div>
                <PurchaseButton
                  itemId={model.id}
                  itemTitle={model.name}
                  itemType="model"
                  price={model.price}
                  className="w-full bg-[#5027a0] hover:bg-[#602fc0] text-white rounded-full"
                />
              </CardContent>
            </Card>

            {/* Creator Card */}
            <Card className="bg-white/5 backdrop-blur-xl border-[rgba(88,43,177,1)]">
              <CardHeader>
                <CardTitle className="text-white">Creator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-xl border border-[#602fc0] flex items-center justify-center text-[#602fc0] font-bold">
                    {model.username?.[0]?.toUpperCase() || model.owner_wallet[2]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate text-white">{model.username || "Anonymous"}</div>
                    <div className="text-xs text-gray-400 font-mono truncate">
                      {model.owner_wallet.slice(0, 6)}...{model.owner_wallet.slice(-4)}
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
