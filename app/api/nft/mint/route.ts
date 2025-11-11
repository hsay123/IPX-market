import { type NextRequest, NextResponse } from "next/server"
import { mintNFT } from "@/lib/blockchain"

export async function POST(request: NextRequest) {
  try {
    const { metadataCid, owner } = await request.json()
    const tokenURI = `ipfs://${metadataCid}`

    const result = await mintNFT(tokenURI, owner)

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] NFT minting error:", error)
    return NextResponse.json({ error: "Failed to mint NFT" }, { status: 500 })
  }
}
