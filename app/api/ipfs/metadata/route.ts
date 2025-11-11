import { type NextRequest, NextResponse } from "next/server"
import { uploadMetadataToIPFS } from "@/lib/blockchain"

export async function POST(request: NextRequest) {
  try {
    const metadata = await request.json()
    const result = await uploadMetadataToIPFS(metadata)

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Metadata upload error:", error)
    return NextResponse.json({ error: "Failed to upload metadata" }, { status: 500 })
  }
}
