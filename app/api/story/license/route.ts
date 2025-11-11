import { type NextRequest, NextResponse } from "next/server"
import { attachLicenseTerms } from "@/lib/blockchain"

export async function POST(request: NextRequest) {
  try {
    const { ipId, config } = await request.json()
    const result = await attachLicenseTerms(ipId, config)

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] License attachment error:", error)
    return NextResponse.json({ error: "Failed to attach license" }, { status: 500 })
  }
}
