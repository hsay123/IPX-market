import { NextResponse } from "next/server"
import { estimateGas } from "@/lib/blockchain"

export async function GET() {
  try {
    const result = await estimateGas()
    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Gas estimation error:", error)
    return NextResponse.json({ error: "Failed to estimate gas" }, { status: 500 })
  }
}
