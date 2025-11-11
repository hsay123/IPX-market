"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Check } from "lucide-react"

interface MetadataCardProps {
  initialData: {
    title: string
    description: string
    category: string
  }
  fileCid: string
  onComplete: (metadataCid: string, metadata: any) => void
}

export function MetadataCard({ initialData, fileCid, onComplete }: MetadataCardProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [metadataCid, setMetadataCid] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    ...initialData,
    tags: "",
    licenseType: "CC-BY-4.0",
    usageRights: "Commercial use allowed with attribution",
    royaltyPercentage: 5,
  })

  const handleUpload = async () => {
    setIsUploading(true)

    try {
      const metadata = {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        fileCid,
        createdAt: new Date().toISOString(),
      }

      const response = await fetch("/api/ipfs/metadata", {
        method: "POST",
        body: JSON.stringify(metadata),
        headers: { "Content-Type": "application/json" },
      })

      if (!response.ok) throw new Error("Metadata upload failed")

      const data = await response.json()
      setMetadataCid(data.cid)
      onComplete(data.cid, metadata)
    } catch (error) {
      console.error("[v0] Metadata upload error:", error)
      alert("Failed to upload metadata. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-[rgba(163,146,220,1)]">Dataset Metadata</CardTitle>
        <CardDescription className="text-gray-400">Add additional information and licensing details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-background">Title</Label>
          <Input className="text-white" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
        </div>

        <div className="space-y-2">
          <Label className="text-white">Description</Label>
          <Textarea className="text-background"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-background">Tags (comma-separated)</Label>
          <Input
            placeholder="machine learning, computer vision, training data"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 text-background">
            <Label>License Type</Label>
            <Select
              value={formData.licenseType}
              onValueChange={(value) => setFormData({ ...formData, licenseType: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CC-BY-4.0">CC-BY 4.0</SelectItem>
                <SelectItem value="CC-BY-SA-4.0">CC-BY-SA 4.0</SelectItem>
                <SelectItem value="MIT">MIT</SelectItem>
                <SelectItem value="Apache-2.0">Apache 2.0</SelectItem>
                <SelectItem value="Custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 text-background">
            <Label>Royalty %</Label>
            <Input
              type="number"
              min="0"
              max="100"
              value={formData.royaltyPercentage}
              onChange={(e) => setFormData({ ...formData, royaltyPercentage: Number(e.target.value) })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-background">Usage Rights</Label>
          <Textarea className="text-background"
            value={formData.usageRights}
            onChange={(e) => setFormData({ ...formData, usageRights: e.target.value })}
            rows={2}
          />
        </div>

        {metadataCid && (
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
            <p className="text-sm font-medium text-green-400 mb-1 flex items-center gap-2">
              <Check className="w-4 h-4" /> Metadata Uploaded
            </p>
            <p className="text-xs text-gray-300 break-all font-mono">CID: {metadataCid}</p>
          </div>
        )}

        {!metadataCid && (
          <Button
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full rounded-full"
            style={{ backgroundColor: "#5027a0" }}
          >
            {isUploading ? "Uploading..." : "Upload Metadata"}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
