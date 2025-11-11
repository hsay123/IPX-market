import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { itemId, itemType, reviewerWallet, rating, comment } = await request.json()

    if (!itemId || !itemType || !reviewerWallet || !rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    // Create review
    const review = await sql`
      INSERT INTO reviews (
        item_id,
        item_type,
        reviewer_wallet,
        rating,
        comment
      )
      VALUES (
        ${itemId},
        ${itemType},
        ${reviewerWallet},
        ${rating},
        ${comment || null}
      )
      RETURNING *
    `

    // Update item rating
    const table = itemType === "dataset" ? "datasets" : "ai_models"

    const stats = await sql`
      SELECT AVG(rating)::numeric(3,2) as avg_rating, COUNT(*) as count
      FROM reviews
      WHERE item_id = ${itemId} AND item_type = ${itemType}
    `

    await sql`
      UPDATE ${sql(table)}
      SET 
        rating = ${stats[0].avg_rating},
        rating_count = ${stats[0].count}
      WHERE id = ${itemId}
    `

    return NextResponse.json({
      success: true,
      review: review[0],
    })
  } catch (error) {
    console.error("[v0] Error creating review:", error)
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const itemId = searchParams.get("itemId")
    const itemType = searchParams.get("itemType")

    if (!itemId || !itemType) {
      return NextResponse.json({ error: "Missing itemId or itemType" }, { status: 400 })
    }

    const reviews = await sql`
      SELECT r.*, u.username, u.avatar_url
      FROM reviews r
      LEFT JOIN users u ON r.reviewer_wallet = u.wallet_address
      WHERE r.item_id = ${Number.parseInt(itemId)} AND r.item_type = ${itemType}
      ORDER BY r.created_at DESC
    `

    return NextResponse.json({ reviews })
  } catch (error) {
    console.error("[v0] Error fetching reviews:", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}
