import { type NextRequest, NextResponse } from "next/server"
import { analyzeImageWithVertexAI } from "@/lib/vertex-ai"

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json()

    if (!imageUrl) {
      return NextResponse.json({ error: "imageUrl is required" }, { status: 400 })
    }

    console.log("[v0] Testing Vertex AI analysis with image:", imageUrl)

    const analysis = await analyzeImageWithVertexAI(imageUrl)

    return NextResponse.json({
      success: true,
      imageUrl,
      analysis,
      message: "Image analysis completed successfully",
    })
  } catch (error) {
    console.error("[v0] Test analysis error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Analysis failed",
      },
      { status: 500 },
    )
  }
}
