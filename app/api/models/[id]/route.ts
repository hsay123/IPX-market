import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const modelId = Number.parseInt(id)

    if (isNaN(modelId)) {
      return NextResponse.json({ error: "Invalid model ID" }, { status: 400 })
    }

    try {
      await sql`
        UPDATE ai_models
        SET views = views + 1
        WHERE id = ${modelId}
      `
    } catch (viewsError: any) {
      // Silently fail if views column doesn't exist - not critical for fetching data
      console.log("[v0] Views column not available, skipping increment")
    }

    try {
      const model = await sql`
        SELECT 
          m.id,
          m.name,
          m.description,
          m.model_type,
          m.framework,
          m.architecture,
          m.parameters,
          m.accuracy,
          m.file_size,
          m.price,
          m.license,
          m.tags,
          m.downloads,
          m.rating,
          m.owner_wallet,
          m.ip_asset_id,
          m.created_at,
          m.updated_at,
          u.username,
          u.avatar_url as owner_avatar
        FROM ai_models m
        LEFT JOIN users u ON m.owner_wallet = u.wallet_address
        WHERE m.id = ${modelId}
      `

      if (model.length === 0) {
        return NextResponse.json({ error: "Model not found" }, { status: 404 })
      }

      return NextResponse.json({ model: model[0] })
    } catch (dbError: any) {
      // Check if it's a database setup error
      const errorMessage = dbError?.message || String(dbError)
      const errorCode = dbError?.code

      if (errorMessage.includes("does not exist") || errorCode === "42P01" || errorCode === "42703") {
        return NextResponse.json({ error: "Database not initialized", needsSetup: true }, { status: 503 })
      }
      throw dbError
    }
  } catch (error) {
    console.error("[v0] Error fetching model:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
