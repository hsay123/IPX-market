"use client"

import { useEffect, useState } from "react"
import { Database, Star, Download, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Dataset } from "@/lib/db"

interface DatasetGridProps {
  category?: string
  search?: string
}

const DUMMY_DATASETS: Dataset[] = [
  {
    id: "1",
    title: "ImageNet 2024",
    description: "Large-scale image classification dataset with 14M+ images across 20,000+ categories",
    category: "Computer Vision",
    price: "0.5",
    file_size: 150000000000,
    preview_url: "/ai-neural-network.png",
    rating: "4.8",
    downloads: 15420,
    views: 48200,
    user_id: "1",
    created_at: new Date(),
    updated_at: new Date(),
    blockchain_address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    ip_asset_id: "0x123...",
    license_terms_id: "1",
    is_registered_ip: true,
  },
  {
    id: "2",
    title: "Financial Time Series",
    description: "10 years of stock market data with technical indicators and sentiment analysis",
    category: "Finance",
    price: "0.3",
    file_size: 5000000000,
    preview_url: "/financial-charts-data.jpg",
    rating: "4.6",
    downloads: 8230,
    views: 22100,
    user_id: "2",
    created_at: new Date(),
    updated_at: new Date(),
    blockchain_address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
    ip_asset_id: "0x456...",
    license_terms_id: "2",
    is_registered_ip: true,
  },
  {
    id: "3",
    title: "Medical Imaging Dataset",
    description: "Annotated X-rays, CT scans, and MRI images for disease detection",
    category: "Healthcare",
    price: "0.8",
    file_size: 200000000000,
    preview_url: "/medical-imaging-xray.jpg",
    rating: "4.9",
    downloads: 12500,
    views: 35600,
    user_id: "1",
    created_at: new Date(),
    updated_at: new Date(),
    blockchain_address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    ip_asset_id: "0x789...",
    license_terms_id: "3",
    is_registered_ip: true,
  },
  {
    id: "4",
    title: "Natural Language Dataset",
    description: "Multilingual text corpus with 100+ languages and 50B+ tokens",
    category: "NLP",
    price: "0.4",
    file_size: 80000000000,
    preview_url: "/natural-language-text-data.jpg",
    rating: "4.7",
    downloads: 18900,
    views: 52300,
    user_id: "3",
    created_at: new Date(),
    updated_at: new Date(),
    blockchain_address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    ip_asset_id: "0xabc...",
    license_terms_id: "1",
    is_registered_ip: true,
  },
  {
    id: "5",
    title: "Audio Speech Dataset",
    description: "High-quality speech recordings with transcriptions in 40 languages",
    category: "Audio",
    price: "0.25",
    file_size: 120000000000,
    preview_url: "/audio-waveform-speech.jpg",
    rating: "4.5",
    downloads: 6400,
    views: 18700,
    user_id: "2",
    created_at: new Date(),
    updated_at: new Date(),
    blockchain_address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    ip_asset_id: "0xdef...",
    license_terms_id: "2",
    is_registered_ip: true,
  },
  {
    id: "6",
    title: "Climate Change Data",
    description: "Global temperature, precipitation, and atmospheric data from 1850-2024",
    category: "Science",
    price: "0.15",
    file_size: 30000000000,
    preview_url: "/climate-data-earth.jpg",
    rating: "4.8",
    downloads: 9800,
    views: 28400,
    user_id: "1",
    created_at: new Date(),
    updated_at: new Date(),
    blockchain_address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    ip_asset_id: "0xghi...",
    license_terms_id: "3",
    is_registered_ip: true,
  },
]

export function DatasetGrid({ category, search }: DatasetGridProps = {}) {
  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDatasets = async () => {
      setIsLoading(true)
      try {
        const params = new URLSearchParams()
        if (category && category !== "All") params.append("category", category)
        if (search) params.append("search", search)

        const response = await fetch(`/api/datasets?${params.toString()}`)
        const data = await response.json()

        let datasetsToShow = Array.isArray(data.datasets) && data.datasets.length > 0 ? data.datasets : DUMMY_DATASETS

        // Apply client-side filtering if using dummy data
        if (datasetsToShow === DUMMY_DATASETS) {
          if (category && category !== "All") {
            datasetsToShow = datasetsToShow.filter((d) => d.category === category)
          }
          if (search) {
            const searchLower = search.toLowerCase()
            datasetsToShow = datasetsToShow.filter(
              (d) => d.title.toLowerCase().includes(searchLower) || d.description.toLowerCase().includes(searchLower),
            )
          }
        }

        setDatasets(datasetsToShow)
      } catch (error) {
        console.error("[v0] Error fetching datasets:", error)
        let fallbackData = DUMMY_DATASETS
        if (category && category !== "All") {
          fallbackData = fallbackData.filter((d) => d.category === category)
        }
        if (search) {
          const searchLower = search.toLowerCase()
          fallbackData = fallbackData.filter(
            (d) => d.title.toLowerCase().includes(searchLower) || d.description.toLowerCase().includes(searchLower),
          )
        }
        setDatasets(fallbackData)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDatasets()
  }, [category, search])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
            <div className="h-40 bg-muted rounded-lg mb-4" />
            <div className="h-4 bg-muted rounded w-3/4 mb-2" />
            <div className="h-3 bg-muted rounded w-full mb-4" />
            <div className="h-8 bg-muted rounded" />
          </div>
        ))}
      </div>
    )
  }

  if (!datasets || datasets.length === 0) {
    return (
      <div className="text-center py-20">
        <Database className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">No datasets found</h3>
        <p className="text-muted-foreground">
          {search || category ? "Try adjusting your filters" : "Be the first to upload a dataset!"}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {datasets.map((dataset) => (
        <div
          key={dataset.id}
          className="relative rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0" />

          <div className="relative">
            <div className="aspect-video w-full overflow-hidden bg-muted">
              {dataset.preview_url ? (
                <img
                  src={dataset.preview_url || "/placeholder.svg"}
                  alt={dataset.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Database className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
            </div>

            <div className="p-6 bg-foreground">
              <div className="flex items-center gap-2 mb-3">
                <Database className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-muted-foreground uppercase">{dataset.category}</span>
              </div>

              <h3 className="text-lg font-bold mb-2 text-balance line-clamp-2">{dataset.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 text-pretty line-clamp-2">{dataset.description}</p>

              <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  <span>{Number(dataset.rating).toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  <span>{dataset.downloads}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{dataset.views}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="text-lg font-bold font-mono text-primary">{dataset.price} ETH</div>
                <div className="text-sm text-muted-foreground">{(dataset.file_size / 1073741824).toFixed(2)} GB</div>
              </div>

              <Button className="w-full" asChild>
                <Link href={`/datasets/${dataset.id}`}>View Details</Link>
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
