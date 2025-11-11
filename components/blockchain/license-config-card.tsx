"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Check, Loader2 } from "lucide-react"

interface LicenseConfigCardProps {
  ipId: string | null
  onComplete: (licenseTermsId: string, config: any) => void
}

export function LicenseConfigCard({ ipId, onComplete }: LicenseConfigCardProps) {
  const [isAttaching, setIsAttaching] = useState(false)
  const [licenseTermsId, setLicenseTermsId] = useState<string | null>(null)
  const [config, setConfig] = useState({
    studentPrice: "0.01",
    researchPrice: "0.05",
    commercialPrice: "0.1",
    royaltySplit: "5",
    terms: "Standard usage terms apply. See full license agreement for details.",
  })

  const handleAttach = async () => {
    if (!ipId) {
      alert("IP Asset ID is required")
      return
    }

    setIsAttaching(true)

    try {
      const response = await fetch("/api/story/license", {
        method: "POST",
        body: JSON.stringify({
          ipId,
          config: {
            studentPrice: Number.parseFloat(config.studentPrice),
            researchPrice: Number.parseFloat(config.researchPrice),
            commercialPrice: Number.parseFloat(config.commercialPrice),
            royaltySplit: Number.parseFloat(config.royaltySplit),
            terms: config.terms,
          },
        }),
        headers: { "Content-Type": "application/json" },
      })

      if (!response.ok) throw new Error("License attachment failed")

      const data = await response.json()
      setLicenseTermsId(data.licenseTermsId)
      onComplete(data.licenseTermsId, config)
    } catch (error) {
      console.error("[v0] License attachment error:", error)
      alert("Failed to attach license terms. Please try again.")
    } finally {
      setIsAttaching(false)
    }
  }

  const handleSkip = () => {
    onComplete("", config)
  }

  if (!ipId) {
    return (
      <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white">Configure License</CardTitle>
          <CardDescription className="text-gray-400">
            IP registration was skipped, license configuration unavailable
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleSkip} className="w-full rounded-full bg-white/10 hover:bg-white/20">
            Skip License Configuration
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-[rgba(156,130,241,1)]">Configure License Terms</CardTitle>
        <CardDescription className="text-gray-400">
          Set pricing tiers and royalty splits for different use cases
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-background">Student Price (ETH)</Label>
            <Input className="text-background"
              type="number"
              step="0.001"
              value={config.studentPrice}
              onChange={(e) => setConfig({ ...config, studentPrice: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-background">Research Price (ETH)</Label>
            <Input className="text-background"
              type="number"
              step="0.01"
              value={config.researchPrice}
              onChange={(e) => setConfig({ ...config, researchPrice: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-background">Commercial Price (ETH)</Label>
            <Input className="text-background"
              type="number"
              step="0.01"
              value={config.commercialPrice}
              onChange={(e) => setConfig({ ...config, commercialPrice: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-background">Royalty Split (%)</Label>
          <Input className="text-background"
            type="number"
            min="0"
            max="100"
            value={config.royaltySplit}
            onChange={(e) => setConfig({ ...config, royaltySplit: e.target.value })}
          />
        </div>

        <div className="space-y-2 text-background bg-[rgba(28,20,38,1)]">
          <Label>License Terms</Label>
          <Textarea value={config.terms} onChange={(e) => setConfig({ ...config, terms: e.target.value })} rows={3} />
        </div>

        {licenseTermsId && (
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
            <p className="text-sm font-medium text-green-400 mb-1 flex items-center gap-2">
              <Check className="w-4 h-4" /> License Terms Attached
            </p>
            <p className="text-xs text-gray-300 break-all font-mono">ID: {licenseTermsId}</p>
          </div>
        )}

        {!licenseTermsId && (
          <div className="flex gap-2">
            <Button
              onClick={handleAttach}
              disabled={isAttaching}
              className="flex-1 rounded-full"
              style={{ backgroundColor: "#5027a0" }}
            >
              {isAttaching ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Attaching...
                </>
              ) : (
                "Attach License Terms"
              )}
            </Button>
            <Button onClick={handleSkip} className="rounded-full hover:bg-white/20 bg-background text-foreground">
              Skip
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
