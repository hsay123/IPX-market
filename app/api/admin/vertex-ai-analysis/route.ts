import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const itemType = request.nextUrl.searchParams.get("type") || "all"

    let results = []

    if (itemType === "dataset" || itemType === "all") {
      try {
        const datasets = await sql`
          SELECT 
            id, 
            name as title,
            preview_url,
            vertex_ai_story,
            vertex_ai_caption,
            vertex_ai_tags,
            vertex_ai_confidence,
            vertex_ai_status,
            vertex_ai_processed_at,
            created_at
          FROM datasets
          WHERE vertex_ai_status IS NOT NULL
          ORDER BY vertex_ai_processed_at DESC
          LIMIT 50
        `
        results = [...results, ...datasets.map((d) => ({ ...d, type: "dataset" }))]
      } catch (error) {
        console.log("[v0] Datasets table not available yet")
      }
    }

    if (itemType === "model" || itemType === "all") {
      try {
        const models = await sql`
          SELECT 
            id, 
            name as title,
            preview_url,
            vertex_ai_story,
            vertex_ai_caption,
            vertex_ai_tags,
            vertex_ai_confidence,
            vertex_ai_status,
            vertex_ai_processed_at,
            created_at
          FROM ai_models
          WHERE vertex_ai_status IS NOT NULL
          ORDER BY vertex_ai_processed_at DESC
          LIMIT 50
        `
        results = [...results, ...models.map((m) => ({ ...m, type: "model" }))]
      } catch (error) {
        console.log("[v0] AI Models table not available yet")
      }
    }

    return NextResponse.json({
      success: true,
      total: results.length,
      results: results.sort(
        (a, b) => new Date(b.vertex_ai_processed_at || 0).getTime() - new Date(a.vertex_ai_processed_at || 0).getTime(),
      ),
    })
  } catch (error) {
    console.error("[v0] Error fetching analysis results:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch analysis results", results: [] },
      { status: 500 },
    )
  }
}
