"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Shield, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface RegisterIPButtonProps {
  itemId: number
  itemType: "dataset" | "model"
  itemTitle: string
  itemDescription: string
  ownerWallet: string
}

export function RegisterIPButton({ itemId, itemType, itemTitle, itemDescription, ownerWallet }: RegisterIPButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [licenseTerms, setLicenseTerms] = useState({
    transferable: true,
    commercial: true,
    derivativesAllowed: false,
  })

  const handleRegister = async () => {
    setIsRegistering(true)

    try {
      const response = await fetch("/api/ip/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemId,
          itemType,
          ownerWallet,
          metadata: {
            name: itemTitle,
            description: itemDescription,
            contentType: itemType,
            contentHash: `hash-${itemId}`,
          },
          licenseTerms: {
            ...licenseTerms,
            territories: ["Global"],
            channels: ["Digital"],
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to register IP")
      }

      const data = await response.json()
      console.log("[v0] IP registered:", data)

      alert("IP Asset registered successfully!")
      setIsOpen(false)
    } catch (error) {
      console.error("[v0] Error registering IP:", error)
      alert("Failed to register IP Asset. Please try again.")
    } finally {
      setIsRegistering(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Shield className="h-4 w-4 mr-2" />
          Register IP
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Register IP Asset</DialogTitle>
          <DialogDescription>Protect your {itemType} with Story Protocol's on-chain IP registration.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="transferable">Transferable</Label>
              <Switch
                id="transferable"
                checked={licenseTerms.transferable}
                onCheckedChange={(checked) => setLicenseTerms({ ...licenseTerms, transferable: checked })}
              />
            </div>
            <p className="text-xs text-muted-foreground">Allow the IP Asset to be transferred to other owners</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="commercial">Commercial Use</Label>
              <Switch
                id="commercial"
                checked={licenseTerms.commercial}
                onCheckedChange={(checked) => setLicenseTerms({ ...licenseTerms, commercial: checked })}
              />
            </div>
            <p className="text-xs text-muted-foreground">Allow commercial use of this {itemType}</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="derivatives">Derivatives Allowed</Label>
              <Switch
                id="derivatives"
                checked={licenseTerms.derivativesAllowed}
                onCheckedChange={(checked) => setLicenseTerms({ ...licenseTerms, derivativesAllowed: checked })}
              />
            </div>
            <p className="text-xs text-muted-foreground">Allow others to create derivative works</p>
          </div>
        </div>

        <Button onClick={handleRegister} disabled={isRegistering} className="w-full">
          {isRegistering ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Registering...
            </>
          ) : (
            <>
              <Shield className="h-4 w-4 mr-2" />
              Register IP Asset
            </>
          )}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
