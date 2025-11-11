import { type NextRequest, NextResponse } from "next/server"
import { storyProtocol } from "@/lib/story-protocol"

export async function GET(request: NextRequest, { params }: { params: Promise<{ ipAssetId: string }> }) {
  try {
    const { ipAssetId } = await params

    const ipAsset = await storyProtocol.getIPAsset(ipAssetId)

    return NextResponse.json({ ipAsset })
  } catch (error) {
    console.error("[v0] Error fetching IP Asset:", error)
    return NextResponse.json({ error: "Failed to fetch IP Asset" }, { status: 500 })
  }
}
