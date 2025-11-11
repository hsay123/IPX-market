"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useWeb3 } from "@/lib/web3"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Loader2 } from "lucide-react"

const CATEGORIES = [
  "Computer Vision",
  "Natural Language",
  "Healthcare",
  "Finance",
  "Audio",
  "Reinforcement Learning",
  "Generative AI",
  "Other",
]

const FRAMEWORKS = ["PyTorch", "TensorFlow", "Keras", "ONNX", "Scikit-learn", "JAX", "Other"]

const MODEL_TYPES = [
  "Classification",
  "Detection",
  "Segmentation",
  "NLP",
  "Forecasting",
  "Generation",
  "Regression",
  "Other",
]

export function ModelUploadForm() {
  const router = useRouter()
  const { account } = useWeb3()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    modelType: "",
    price: "",
    fileUrl: "",
    fileSize: "",
    framework: "",
    architecture: "",
    accuracy: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!account) {
      alert("Please connect your wallet first")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/models", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          price: Number.parseFloat(formData.price),
          fileSize: Number.parseInt(formData.fileSize),
          accuracy: formData.accuracy ? Number.parseFloat(formData.accuracy) : null,
          ownerWallet: account,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to upload model")
      }

      const { model } = await response.json()
      router.push(`/models/${model.id}`)
    } catch (error) {
      console.error("[v0] Error uploading model:", error)
      alert("Failed to upload model. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2" style={{ color: "#9383c7" }}>
          Model Information
        </h2>
        <p className="text-gray-400">Provide detailed information about your AI model</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-white">
            Model Name *
          </Label>
          <Input
            id="name"
            placeholder="e.g., ResNet-50 Image Classifier"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-white">
            Description *
          </Label>
          <Textarea
            id="description"
            placeholder="Describe your model, its architecture, training process, and use cases..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={5}
            required
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category" className="text-white">
              Category *
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
              required
            >
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="modelType" className="text-white">
              Model Type *
            </Label>
            <Select
              value={formData.modelType}
              onValueChange={(value) => setFormData({ ...formData, modelType: value })}
              required
            >
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Select model type" />
              </SelectTrigger>
              <SelectContent>
                {MODEL_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="framework" className="text-white">
              Framework *
            </Label>
            <Select
              value={formData.framework}
              onValueChange={(value) => setFormData({ ...formData, framework: value })}
              required
            >
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Select framework" />
              </SelectTrigger>
              <SelectContent>
                {FRAMEWORKS.map((framework) => (
                  <SelectItem key={framework} value={framework}>
                    {framework}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price" className="text-white">
              Price (ETH) *
            </Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.8"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="architecture" className="text-white">
            Architecture *
          </Label>
          <Input
            id="architecture"
            placeholder="e.g., ResNet-50, BERT-base, YOLOv8"
            value={formData.architecture}
            onChange={(e) => setFormData({ ...formData, architecture: e.target.value })}
            required
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="accuracy" className="text-white">
            Accuracy (%) (optional)
          </Label>
          <Input
            id="accuracy"
            type="number"
            step="0.01"
            min="0"
            max="100"
            placeholder="94.5"
            value={formData.accuracy}
            onChange={(e) => setFormData({ ...formData, accuracy: e.target.value })}
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fileUrl" className="text-white">
            Model File URL *
          </Label>
          <Input
            id="fileUrl"
            type="url"
            placeholder="https://your-storage.com/model.pth"
            value={formData.fileUrl}
            onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
            required
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
          />
          <p className="text-xs text-gray-400">Upload your model file to a storage service and paste the URL here</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fileSize" className="text-white">
            File Size (bytes) *
          </Label>
          <Input
            id="fileSize"
            type="number"
            placeholder="102400000"
            value={formData.fileSize}
            onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
            required
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
          />
        </div>

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={isSubmitting || !account}
            className="flex-1 rounded-full text-white"
            style={{ backgroundColor: "#5027a0" }}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Model
              </>
            )}
          </Button>
        </div>

        {!account && <p className="text-sm text-center text-gray-400">Please connect your wallet to upload models</p>}
      </form>
    </div>
  )
}
