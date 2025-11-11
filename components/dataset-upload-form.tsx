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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Loader2, FileUp, X } from "lucide-react"
import { BlockchainWizard } from "./blockchain/blockchain-wizard"

const CATEGORIES = [
  "Computer Vision",
  "Natural Language",
  "Healthcare",
  "Finance",
  "Audio",
  "Time Series",
  "Tabular",
  "Other",
]

export function DatasetUploadForm() {
  const router = useRouter()
  const { account } = useWeb3()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploadedDatasetId, setUploadedDatasetId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    fileUrl: "",
    fileSize: "",
    fileType: "",
    previewUrl: "",
  })

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      // Auto-populate file size and type
      setFormData({
        ...formData,
        fileSize: file.size.toString(),
        fileType: file.name.split(".").pop()?.toUpperCase() || "",
        fileUrl: file.name, // Store filename as fileUrl for now
      })
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setFormData({
      ...formData,
      fileSize: "",
      fileType: "",
      fileUrl: "",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!account) {
      alert("Please connect your wallet first")
      return
    }

    if (!selectedFile) {
      alert("Please select a file to upload")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/datasets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          price: Number.parseFloat(formData.price),
          fileSize: Number.parseInt(formData.fileSize),
          ownerWallet: account,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to upload dataset")
      }

      const { dataset } = await response.json()
      setUploadedDatasetId(dataset.id)
      setUploadSuccess(true)
    } catch (error) {
      console.error("[v0] Error uploading dataset:", error)
      alert("Failed to upload dataset. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCloseWizard = () => {
    if (uploadedDatasetId) {
      router.push(`/datasets/${uploadedDatasetId}`)
    }
  }

  if (uploadSuccess && uploadedDatasetId && selectedFile) {
    return (
      <BlockchainWizard
        datasetId={uploadedDatasetId}
        file={selectedFile}
        datasetInfo={{
          title: formData.title,
          description: formData.description,
          category: formData.category,
        }}
        onClose={handleCloseWizard}
      />
    )
  }

  return (
    <Card className="font-normal bg-white/5 border border-white/10 backdrop-blur-xl text-white">
      <CardHeader>
        <CardTitle style={{ color: "#9383c7" }}>Dataset Information</CardTitle>
        <CardDescription className="text-gray-400">Fill in the details about your dataset</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="e.g., High-Quality Image Dataset"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe your dataset, its contents, and potential use cases..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={5}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                required
              >
                <SelectTrigger>
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
              <Label htmlFor="price">Price (ETH) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.5"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Dataset File *</Label>
            {!selectedFile ? (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors border-[rgba(80,39,160,1)] bg-secondary-foreground">
                <input
                  id="file"
                  type="file"
                  className="hidden"
                  onChange={handleFileSelect}
                  accept=".zip,.csv,.json,.parquet,.h5,.pkl,.txt"
                />
                <label htmlFor="file" className="cursor-pointer">
                  <FileUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm font-medium mb-1">Click to upload dataset file</p>
                  <p className="text-xs text-muted-foreground">Supports ZIP, CSV, JSON, Parquet, H5, PKL, TXT</p>
                </label>
              </div>
            ) : (
              <div className="border border-primary/20 rounded-lg p-4 bg-primary/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileUp className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button type="button" variant="ghost" size="icon" onClick={handleRemoveFile} className="h-8 w-8">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="previewUrl">Preview Image URL (optional)</Label>
            <Input
              id="previewUrl"
              type="url"
              placeholder="https://your-storage.com/preview.jpg"
              value={formData.previewUrl}
              onChange={(e) => setFormData({ ...formData, previewUrl: e.target.value })}
            />
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isSubmitting || !account || !selectedFile}
              className="flex-1 rounded-full"
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
                  Upload Dataset
                </>
              )}
            </Button>
          </div>

          {!account && (
            <p className="text-sm text-center text-muted-foreground">Please connect your wallet to upload datasets</p>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
