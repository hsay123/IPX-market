"use client"

import { Navbar } from "@/components/navbar"
import { DebitWidget } from "@/components/debit-widget"
import { RecentTxMini } from "@/components/recent-tx-mini"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function DemoPaymentPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-24">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold">Story Aeneid Payment Demo</h1>
            <p className="text-muted-foreground">
              Make payments on the Story Aeneid testnet with blockchain verification
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <DebitWidget
                defaultMemo="Dataset purchase"
                onSuccess={(txHash) => {
                  console.log("[v0] Payment successful:", txHash)
                }}
                onError={(error) => {
                  console.error("[v0] Payment failed:", error)
                }}
              />
            </div>

            <div>
              <RecentTxMini limit={5} />
            </div>
          </div>

          <Card className="p-6 bg-muted/50">
            <h3 className="font-semibold mb-4">Integration Instructions</h3>
            <div className="space-y-4 text-sm text-muted-foreground">
              <div>
                <p className="font-medium text-foreground mb-1">1. Environment Variables</p>
                <code className="block bg-background p-2 rounded text-xs">
                  NEXT_PUBLIC_PAY_CONTRACT=0x...
                  <br />
                  NEXT_PUBLIC_AENEID_RPC=https://testnet.storyrpc.io
                  <br />
                  NEXT_PUBLIC_STORYSCAN=https://testnet.storyscan.xyz
                </code>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">2. Drop Anywhere</p>
                <code className="block bg-background p-2 rounded text-xs">{`<DebitWidget className="mx-auto" />`}</code>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">3. Optional Transaction History</p>
                <code className="block bg-background p-2 rounded text-xs">{`<RecentTxMini limit={5} />`}</code>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
