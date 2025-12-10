"use client"

import { useState, useEffect } from "react"
import { useWeb3 } from "@/lib/web3"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, CheckCircle2, XCircle, ExternalLink, Wallet } from "lucide-react"
import { cn } from "@/lib/utils"

// Story Aeneid testnet configuration
const STORY_AENEID_CHAIN_ID = "0x523" // 1315 in hex
const STORY_AENEID_CHAIN = {
  chainId: STORY_AENEID_CHAIN_ID,
  chainName: "Story Aeneid Testnet",
  nativeCurrency: {
    name: "IP",
    symbol: "IP",
    decimals: 18,
  },
  rpcUrls: [process.env.NEXT_PUBLIC_AENEID_RPC || "https://testnet.storyrpc.io"],
  blockExplorerUrls: [process.env.NEXT_PUBLIC_STORYSCAN || "https://testnet.storyscan.xyz"],
}

interface DebitWidgetProps {
  className?: string
  defaultRecipient?: string
  defaultAmount?: string
  defaultMemo?: string
  onSuccess?: (txHash: string) => void
  onError?: (error: Error) => void
}

export function DebitWidget({
  className,
  defaultRecipient = "",
  defaultAmount = "",
  defaultMemo = "",
  onSuccess,
  onError,
}: DebitWidgetProps) {
  const { account, connect } = useWeb3()
  const [recipient, setRecipient] = useState(defaultRecipient)
  const [amount, setAmount] = useState(defaultAmount)
  const [memo, setMemo] = useState(defaultMemo)
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")
  const [txHash, setTxHash] = useState<string>("")
  const [isCorrectChain, setIsCorrectChain] = useState(false)

  const storyScanUrl = process.env.NEXT_PUBLIC_STORYSCAN || "https://testnet.storyscan.xyz"

  useEffect(() => {
    const checkChain = async () => {
      if (typeof window.ethereum !== "undefined" && account) {
        try {
          const chainId = await window.ethereum.request({ method: "eth_chainId" })
          setIsCorrectChain(chainId === STORY_AENEID_CHAIN_ID)
        } catch (error) {
          console.error("Error checking chain:", error)
        }
      }
    }
    checkChain()

    if (typeof window.ethereum !== "undefined") {
      const handleChainChanged = (chainId: string) => {
        setIsCorrectChain(chainId === STORY_AENEID_CHAIN_ID)
      }
      window.ethereum.on("chainChanged", handleChainChanged)
      return () => {
        window.ethereum.removeListener("chainChanged", handleChainChanged)
      }
    }
  }, [account])

  const switchToStoryAeneid = async () => {
    if (typeof window.ethereum === "undefined") {
      setErrorMsg("Please install MetaMask to use this feature")
      return
    }

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: STORY_AENEID_CHAIN_ID }],
      })
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [STORY_AENEID_CHAIN],
          })
        } catch (addError) {
          console.error("Error adding chain:", addError)
          setErrorMsg("Failed to add Story Aeneid network")
        }
      } else {
        console.error("Error switching chain:", switchError)
        setErrorMsg("Failed to switch to Story Aeneid network")
      }
    }
  }

  const handlePay = async () => {
    if (!account || !isCorrectChain) return
    if (!recipient || !amount) {
      setErrorMsg("Please fill in all required fields")
      setStatus("error")
      return
    }

    setStatus("pending")
    setErrorMsg("")
    setTxHash("")

    try {
      const amountWei = (Number.parseFloat(amount) * 1e18).toString(16)

      const hash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: account,
            to: recipient,
            value: "0x" + amountWei,
          },
        ],
      })

      setTxHash(hash)
      setStatus("success")
      onSuccess?.(hash)
    } catch (err: any) {
      setStatus("error")
      const errMsg = err.message || "Transaction failed"
      setErrorMsg(errMsg)
      onError?.(err)
    }
  }

  const resetForm = () => {
    setStatus("idle")
    setErrorMsg("")
    setTxHash("")
    setRecipient(defaultRecipient)
    setAmount(defaultAmount)
    setMemo(defaultMemo)
  }

  return (
    <Card className={cn("p-6 bg-card/50 backdrop-blur-sm border-border", className)}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Story Aeneid Payment</h3>
          {account && (
            <span className="text-sm text-muted-foreground">
              {account?.slice(0, 6)}...{account?.slice(-4)}
            </span>
          )}
        </div>

        {!account ? (
          <div className="flex flex-col items-center gap-4 py-8">
            <p className="text-sm text-muted-foreground text-center">
              Connect your wallet to make payments on Story Aeneid testnet
            </p>
            <Button onClick={connect} className="w-full">
              <Wallet className="mr-2 h-4 w-4" />
              Connect Wallet
            </Button>
          </div>
        ) : !isCorrectChain ? (
          <div className="flex flex-col items-center gap-4 py-8">
            <p className="text-sm text-amber-600 text-center">Please switch to Story Aeneid testnet</p>
            <Button onClick={switchToStoryAeneid} variant="outline" className="w-full bg-transparent">
              Switch to Story Aeneid
            </Button>
          </div>
        ) : status === "success" && txHash ? (
          <div className="flex flex-col items-center gap-4 py-8">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
            <div className="text-center space-y-2">
              <p className="font-semibold">Payment Successful!</p>
              <p className="text-sm text-muted-foreground">Your transaction has been confirmed</p>
              <a
                href={`${storyScanUrl}/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                View on StoryScan
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <Button onClick={resetForm} variant="outline" className="w-full bg-transparent">
              Make Another Payment
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient Address</Label>
              <Input
                id="recipient"
                placeholder="0x..."
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                disabled={status === "pending"}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (IP)</Label>
              <Input
                id="amount"
                type="number"
                step="0.001"
                placeholder="0.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={status === "pending"}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="memo">Memo (optional)</Label>
              <Input
                id="memo"
                placeholder="Payment for dataset..."
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                disabled={status === "pending"}
              />
            </div>

            {status === "error" && (
              <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{errorMsg}</p>
              </div>
            )}

            <Button onClick={handlePay} disabled={status === "pending" || !recipient || !amount} className="w-full">
              {status === "pending" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Send Payment"
              )}
            </Button>
          </>
        )}
      </div>
    </Card>
  )
}
