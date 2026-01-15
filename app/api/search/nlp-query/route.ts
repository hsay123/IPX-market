import { type NextRequest, NextResponse } from "next/server"
import { analyzeSearchQuery } from "@/lib/nlp-utils"

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get("q")

    if (!query) {
      return NextResponse.json({ error: "Query parameter required" }, { status: 400 })
    }

    const analysis = await analyzeSearchQuery(query)

    console.log("[v0] NLP analysis result:", analysis)

    return NextResponse.json({
      query,
      analysis,
      success: true,
    })
  } catch (error) {
    console.error("[v0] NLP query endpoint error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
