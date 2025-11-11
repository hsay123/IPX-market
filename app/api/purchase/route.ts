import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const {
      itemId,
      itemType, // 'dataset' or 'model'
      buyerWallet,
      txHash,
    } = await request.json()

    if (!itemId || !itemType || !buyerWallet || !txHash) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Fetch item details
    const table = itemType === "dataset" ? "datasets" : "ai_models"
    const item = await sql`
      SELECT * FROM ${sql(table)} WHERE id = ${itemId}
    `

    if (item.length === 0) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    const sellerWallet = item[0].owner_wallet
    const amount = item[0].price

    // Create transaction record
    const transaction = await sql`
      INSERT INTO transactions (
        tx_hash,
        buyer_wallet,
        seller_wallet,
        item_id,
        item_type,
        amount,
        status,
        completed_at
      )
      VALUES (
        ${txHash},
        ${buyerWallet},
        ${sellerWallet},
        ${itemId},
        ${itemType},
        ${amount},
        'completed',
        CURRENT_TIMESTAMP
      )
      RETURNING *
    `

    // Increment download count
    if (itemType === "dataset") {
      await sql`
        UPDATE datasets
        SET downloads = downloads + 1
        WHERE id = ${itemId}
      `
    } else {
      await sql`
        UPDATE ai_models
        SET downloads = downloads + 1
        WHERE id = ${itemId}
      `
    }

    return NextResponse.json({
      success: true,
      transaction: transaction[0],
    })
  } catch (error) {
    console.error("[v0] Error processing purchase:", error)
    return NextResponse.json({ error: "Failed to process purchase" }, { status: 500 })
  }
}
