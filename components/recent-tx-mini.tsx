"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { ExternalLink, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useWeb3 } from "@/lib/web3"

interface Transaction {
  hash: string
  from: string
  to: string
  value: string
  memo: string
  timestamp: number
  verified: boolean
}

interface RecentTxMiniProps {
  className?: string
  limit?: number
}

export function RecentTxMini({ className, limit = 5 }: RecentTxMiniProps) {
  const { account } = useWeb3()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  const storyScanUrl = process.env.NEXT_PUBLIC_STORYSCAN || "https://testnet.storyscan.xyz"

  useEffect(() => {
    if (!account) {
      setTransactions([])
      setLoading(false)
      return
    }

    const fetchTransactions = async () => {
      try {
        const response = await fetch(`/api/tx/recent?address=${account}&limit=${limit}`)
        if (response.ok) {
          const data = await response.json()
          setTransactions(data.transactions || [])
        }
      } catch (error) {
        console.error("[v0] Failed to fetch transactions:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
    const interval = setInterval(fetchTransactions, 30000)

    return () => clearInterval(interval)
  }, [account, limit])

  if (!account) {
    return null
  }

  return (
    <Card className={cn("p-4 bg-card/50 backdrop-blur-sm border-border", className)}>
      <h4 className="text-sm font-semibold mb-3">Recent Transactions</h4>
      {loading ? (
        <p className="text-xs text-muted-foreground">Loading...</p>
      ) : transactions.length === 0 ? (
        <p className="text-xs text-muted-foreground">No recent transactions</p>
      ) : (
        <div className="space-y-2">
          {transactions.map((tx) => {
            const isSent = tx.from.toLowerCase() === account.toLowerCase()
            return (
              <div
                key={tx.hash}
                className="flex items-center justify-between p-2 rounded-lg bg-background/50 hover:bg-background/80 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {isSent ? (
                    <ArrowUpRight className="h-4 w-4 text-red-500 flex-shrink-0" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-green-500 flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-medium truncate">
                      {isSent
                        ? `To ${tx.to.slice(0, 6)}...${tx.to.slice(-4)}`
                        : `From ${tx.from.slice(0, 6)}...${tx.from.slice(-4)}`}
                    </p>
                    <p className="text-xs text-muted-foreground">{tx.value} IP</p>
                  </div>
                </div>
                <a
                  href={`${storyScanUrl}/tx/${tx.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground flex-shrink-0"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}
