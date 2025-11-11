"use client"

import { useEffect, useState } from "react"
import { Brain, Star, Download, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import type { AIModel } from "@/lib/db"

interface ModelGridProps {
  category?: string
  search?: string
}

const DUMMY_MODELS: AIModel[] = [
  {
    id: "1",
    name: "Vision Transformer Pro",
    description: "State-of-the-art image classification model with 95% accuracy on ImageNet",
    category: "Computer Vision",
    model_type: "Transformer",
    framework: "PyTorch",
    price: "0.6",
    file_size: 450000000,
    accuracy: 95.2,
    preview_url: "/machine-learning-model-3d.jpg",
    rating: "4.9",
    downloads: 22100,
    views: 67800,
    user_id: "1",
    created_at: new Date(),
    updated_at: new Date(),
    blockchain_address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    ip_asset_id: "0xm1...",
    license_terms_id: "1",
    is_registered_ip: true,
  },
  {
    id: "2",
    name: "FinBERT 2024",
    description: "Financial sentiment analysis model trained on 10M+ financial documents",
    category: "Finance",
    model_type: "BERT",
    framework: "TensorFlow",
    price: "0.4",
    file_size: 340000000,
    accuracy: 92.5,
    preview_url: "/financial-ai-model.jpg",
    rating: "4.7",
    downloads: 15600,
    views: 45200,
    user_id: "2",
    created_at: new Date(),
    updated_at: new Date(),
    blockchain_address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
    ip_asset_id: "0xm2...",
    license_terms_id: "2",
    is_registered_ip: true,
  },
  {
    id: "3",
    name: "MedNet Diagnostic",
    description: "Multi-disease detection from medical images with FDA approval",
    category: "Healthcare",
    model_type: "CNN",
    framework: "PyTorch",
    price: "1.2",
    file_size: 890000000,
    accuracy: 97.8,
    preview_url: "/medical-ai-diagnostic.jpg",
    rating: "5.0",
    downloads: 8900,
    views: 34500,
    user_id: "1",
    created_at: new Date(),
    updated_at: new Date(),
    blockchain_address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    ip_asset_id: "0xm3...",
    license_terms_id: "3",
    is_registered_ip: true,
  },
  {
    id: "4",
    name: "MultiLang LLM",
    description: "13B parameter language model supporting 100+ languages",
    category: "NLP",
    model_type: "LLM",
    framework: "PyTorch",
    price: "0.9",
    file_size: 25000000000,
    accuracy: 89.3,
    preview_url: "/language-model-ai.jpg",
    rating: "4.8",
    downloads: 31200,
    views: 89600,
    user_id: "3",
    created_at: new Date(),
    updated_at: new Date(),
    blockchain_address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    ip_asset_id: "0xm4...",
    license_terms_id: "1",
    is_registered_ip: true,
  },
  {
    id: "5",
    name: "SpeechRecognizer Ultra",
    description: "Real-time speech-to-text with 98% accuracy in 40 languages",
    category: "Audio",
    model_type: "RNN",
    framework: "TensorFlow",
    price: "0.35",
    file_size: 280000000,
    accuracy: 98.1,
    preview_url: "/speech-recognition-audio.jpg",
    rating: "4.6",
    downloads: 18700,
    views: 52300,
    user_id: "2",
    created_at: new Date(),
    updated_at: new Date(),
    blockchain_address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    ip_asset_id: "0xm5...",
    license_terms_id: "2",
    is_registered_ip: true,
  },
  {
    id: "6",
    name: "ClimatePredictor AI",
    description: "Advanced climate forecasting model with 5-year prediction horizon",
    category: "Science",
    model_type: "LSTM",
    framework: "PyTorch",
    price: "0.55",
    file_size: 420000000,
    accuracy: 91.7,
    preview_url: "/climate-prediction-model.jpg",
    rating: "4.7",
    downloads: 11200,
    views: 38900,
    user_id: "1",
    created_at: new Date(),
    updated_at: new Date(),
    blockchain_address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    ip_asset_id: "0xm6...",
    license_terms_id: "3",
    is_registered_ip: true,
  },
]

export function ModelGrid({ category, search }: ModelGridProps = {}) {
  const [models, setModels] = useState<AIModel[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchModels = async () => {
      setIsLoading(true)
      try {
        const params = new URLSearchParams()
        if (category && category !== "All") params.append("category", category)
        if (search) params.append("search", search)

        const response = await fetch(`/api/models?${params.toString()}`)
        const data = await response.json()

        let modelsToShow = Array.isArray(data.models) && data.models.length > 0 ? data.models : DUMMY_MODELS

        // Apply client-side filtering if using dummy data
        if (modelsToShow === DUMMY_MODELS) {
          if (category && category !== "All") {
            modelsToShow = modelsToShow.filter((m) => m.category === category)
          }
          if (search) {
            const searchLower = search.toLowerCase()
            modelsToShow = modelsToShow.filter(
              (m) => m.name.toLowerCase().includes(searchLower) || m.description.toLowerCase().includes(searchLower),
            )
          }
        }

        setModels(modelsToShow)
      } catch (error) {
        console.error("[v0] Error fetching models:", error)
        let fallbackData = DUMMY_MODELS
        if (category && category !== "All") {
          fallbackData = fallbackData.filter((m) => m.category === category)
        }
        if (search) {
          const searchLower = search.toLowerCase()
          fallbackData = fallbackData.filter(
            (m) => m.name.toLowerCase().includes(searchLower) || m.description.toLowerCase().includes(searchLower),
          )
        }
        setModels(fallbackData)
      } finally {
        setIsLoading(false)
      }
    }

    fetchModels()
  }, [category, search])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
            <div className="h-32 bg-muted rounded-lg mb-4" />
            <div className="h-4 bg-muted rounded w-3/4 mb-2" />
            <div className="h-3 bg-muted rounded w-full mb-4" />
            <div className="h-8 bg-muted rounded" />
          </div>
        ))}
      </div>
    )
  }

  if (!models || models.length === 0) {
    return (
      <div className="text-center py-20">
        <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">No models found</h3>
        <p className="text-muted-foreground">
          {search || category ? "Try adjusting your filters" : "Be the first to upload an AI model!"}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {models.map((model) => (
        <div
          key={model.id}
          className="relative rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5 opacity-0" />

          <div className="relative p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-accent" />
                <span className="text-xs font-medium text-muted-foreground uppercase">{model.category}</span>
              </div>
              {model.accuracy && <Badge variant="secondary">{model.accuracy}% Accuracy</Badge>}
            </div>

            <h3 className="text-lg font-bold mb-2 text-balance line-clamp-2">{model.name}</h3>
            <p className="text-sm text-muted-foreground mb-4 text-pretty line-clamp-2">{model.description}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline">{model.framework}</Badge>
              <Badge variant="outline">{model.model_type}</Badge>
            </div>

            <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                <span>{Number(model.rating).toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                <span>{model.downloads}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{model.views}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-bold font-mono text-accent">{model.price} ETH</div>
              <div className="text-sm text-muted-foreground">{(model.file_size / 1048576).toFixed(0)} MB</div>
            </div>

            <Button className="w-full" asChild>
              <Link href={`/models/${model.id}`}>View Details</Link>
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
