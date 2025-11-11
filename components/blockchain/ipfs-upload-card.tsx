"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, Check, ExternalLink } from "lucide-react"

interface IPFSUploadCardProps {
  file: File
  onComplete: (cid: string) => void
}

export function IPFSUploadCard({ file, onComplete }: IPFSUploadCardProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [cid, setCid] = useState<string | null>(null)

  const handleUpload = async () => {
    setIsUploading(true)
    setProgress(0)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90))
      }, 300)

      const response = await fetch("/api/ipfs/upload", {
        method: "POST",
        body: JSON.stringify({ fileName: file.name, fileSize: file.size }),
        headers: { "Content-Type": "application/json" },
      })

      clearInterval(progressInterval)
      setProgress(100)

      if (!response.ok) throw new Error("Upload failed")

      const data = await response.json()
      setCid(data.cid)
      onComplete(data.cid)
    } catch (error) {
      console.error("[v0] IPFS upload error:", error)
      alert("Failed to upload to IPFS. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-white">Upload to IPFS</CardTitle>
        <CardDescription className="text-gray-400">Store your dataset on the decentralized web</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <p className="text-sm font-medium text-white mb-1">{file.name}</p>
          <p className="text-xs text-gray-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
        </div>

        {isUploading && (
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-gray-400 text-center">Uploading... {progress}%</p>
          </div>
        )}

        {cid && (
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-green-400 mb-1 flex items-center gap-2">
                  <Check className="w-4 h-4" /> Upload Complete
                </p>
                <p className="text-xs text-gray-300 break-all font-mono">CID: {cid}</p>
              </div>
              <a
                href={`https://ipfs.io/ipfs/${cid}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-400 hover:text-green-300"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}

        {!cid && (
          <Button
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full rounded-full"
            style={{ backgroundColor: "#5027a0" }}
          >
            {isUploading ? (
              "Uploading..."
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload to IPFS
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
