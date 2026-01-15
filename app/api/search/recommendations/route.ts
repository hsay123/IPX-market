import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { calculateSemanticSimilarity } from "@/lib/nlp-utils"

export async function GET(request: NextRequest) {
  try {
    const itemId = request.nextUrl.searchParams.get("itemId")
    const itemType = request.nextUrl.searchParams.get("itemType") || "dataset"
    const limit = Number.parseInt(request.nextUrl.searchParams.get("limit") || "6")

    if (!itemId) {
      return NextResponse.json({ error: "itemId required" }, { status: 400 })
    }

    const table = itemType === "model" ? "ai_models" : "datasets"

    try {
      // Get the reference item's tags
      const refItem = await sql`
        SELECT vertex_ai_tags, category FROM ${sql.unsafe(table)} WHERE id = ${Number(itemId)}
      `

      if (!refItem || refItem.length === 0) {
        console.log("[v0] Item not found for recommendations")
        return NextResponse.json({ recommendations: [] })
      }

      const refTags = refItem[0].vertex_ai_tags || []
      const refCategory = refItem[0].category

      // Get all other items in same category
      const similarItems = await sql`
        SELECT *, vertex_ai_tags FROM ${sql.unsafe(table)} 
        WHERE id != ${Number(itemId)} AND category = ${refCategory} AND status = 'active'
        LIMIT 20
      `

      // Score and sort by semantic similarity
      const scored = similarItems.map((item: any) => ({
        ...item,
        similarityScore: calculateSemanticSimilarity(refTags || [], item.vertex_ai_tags || []),
      }))

      const recommendations = scored.sort((a: any, b: any) => b.similarityScore - a.similarityScore).slice(0, limit)

      return NextResponse.json({ recommendations, success: true })
    } catch (dbError) {
      console.log("[v0] Database not initialized, returning empty recommendations")
      return NextResponse.json({ recommendations: [], success: true })
    }
  } catch (error) {
    console.error("[v0] Recommendations endpoint error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
