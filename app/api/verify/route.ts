import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import crypto from "crypto"

const sql = neon(process.env.NEON_DATABASE_URL!)

export async function POST(req: NextRequest) {
  try {
    const { txHash, itemType, itemId, buyerAddress, itemTitle, price } = await req.json()

    if (!txHash) {
      return NextResponse.json({ error: "Transaction hash is required" }, { status: 400 })
    }

    // Store verified transaction in story_transactions table
    try {
      await sql`
        INSERT INTO story_transactions (tx_hash, verified_at, status)
        VALUES (${txHash}, NOW(), 'verified')
        ON CONFLICT (tx_hash) 
        DO UPDATE SET verified_at = NOW(), status = 'verified'
      `
    } catch (dbError: any) {
      if (dbError.message?.includes('relation "story_transactions" does not exist')) {
        console.log("[v0] story_transactions table not found, skipping storage")
      }
    }

    if (buyerAddress && itemId && itemType) {
      try {
        const orderId = `order-${crypto.randomBytes(16).toString("hex")}`
        const productId = `${itemType}-${String(itemId).padStart(3, "0")}`

        await sql`
          INSERT INTO orders (order_id, buyer_address, product_id, tx_hash, amount_wei, chain_id, status, verified_at)
          VALUES (${orderId}, ${buyerAddress.toLowerCase()}, ${productId}, ${txHash}, ${String(price || 0)}, 1315, 'completed', NOW())
          ON CONFLICT (order_id) DO NOTHING
          RETURNING *
        `

        return NextResponse.json({
          success: true,
          message: "Transaction verified and order created",
          txHash,
          orderId,
        })
      } catch (orderError: any) {
        if (orderError.message?.includes('relation "orders" does not exist')) {
          console.log("[v0] orders table not found, skipping order creation")
        } else {
          console.error("[v0] Error creating order:", orderError)
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Transaction verified",
      txHash,
    })
  } catch (error: any) {
    console.error("[v0] Verification error:", error)
    return NextResponse.json({ error: "Failed to verify transaction", details: error.message }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const txHash = searchParams.get("tx")

    if (!txHash) {
      return NextResponse.json({ error: "Transaction hash is required" }, { status: 400 })
    }

    // Check if order exists for this transaction
    try {
      const orders = await sql`
        SELECT o.*, p.title, p.checksum, p.version, p.file_size
        FROM orders o
        JOIN products p ON o.product_id = p.product_id
        WHERE o.tx_hash = ${txHash}
      `

      if (orders.length > 0) {
        const order = orders[0]
        return NextResponse.json({
          success: true,
          verified: true,
          order: {
            orderId: order.order_id,
            productTitle: order.title,
            checksum: order.checksum,
            version: order.version,
            fileSize: order.file_size,
            status: order.status,
          },
        })
      }

      return NextResponse.json({
        success: true,
        verified: false,
        message: "Transaction not yet verified",
      })
    } catch (dbError: any) {
      if (dbError.message?.includes("relation") && dbError.message?.includes("does not exist")) {
        return NextResponse.json({
          success: true,
          verified: false,
          message: "Database not initialized",
        })
      }
      throw dbError
    }
  } catch (error: any) {
    console.error("[v0] Verification check error:", error)
    return NextResponse.json({ error: "Failed to check verification", details: error.message }, { status: 500 })
  }
}
