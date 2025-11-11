import { type NextRequest, NextResponse } from "next/server"
import { registerIPAsset } from "@/lib/blockchain"

export async function POST(request: NextRequest) {
  try {
    const { nftContractAddress, tokenId } = await request.json()
    const result = await registerIPAsset(nftContractAddress, tokenId)

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Story Protocol registration error:", error)
    return NextResponse.json({ error: "Failed to register IP" }, { status: 500 })
  }
}
