import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const datasetId = Number.parseInt(id)

    if (isNaN(datasetId)) {
      return NextResponse.json({ error: "Invalid dataset ID" }, { status: 400 })
    }

    try {
      const dataset = await sql`
        SELECT 
          d.id,
          d.title,
          d.description,
          d.category,
          d.file_size,
          d.file_type,
          d.file_url,
          d.preview_url,
          d.price,
          d.downloads,
          d.rating,
          d.owner_wallet,
          d.ip_asset_id,
          d.status,
          d.created_at,
          u.username,
          u.avatar_url as owner_avatar
        FROM datasets d
        LEFT JOIN users u ON d.owner_wallet = u.wallet_address
        WHERE d.id = ${datasetId}
      `

      if (dataset.length === 0) {
        return NextResponse.json({ error: "Dataset not found" }, { status: 404 })
      }

      return NextResponse.json({ dataset: dataset[0] })
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
    console.error("[v0] Error fetching dataset:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
