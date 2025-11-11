import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.NEON_DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const buyerAddress = searchParams.get("buyer")
    const status = searchParams.get("status")

    let query = "SELECT * FROM orders"
    const conditions: string[] = []
    const params: any[] = []

    if (buyerAddress) {
      conditions.push(`buyer_address = $${conditions.length + 1}`)
      params.push(buyerAddress.toLowerCase())
    }

    if (status) {
      conditions.push(`status = $${conditions.length + 1}`)
      params.push(status)
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ")
    }

    query += " ORDER BY created_at DESC"

    const orders = await sql(query, params)

    return NextResponse.json({ success: true, orders })
  } catch (error: any) {
    console.error("[v0] Error fetching orders:", error)

    // Handle missing table gracefully
    if (error.message?.includes('relation "orders" does not exist')) {
      return NextResponse.json({ success: true, orders: [] })
    }

    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, buyerAddress, productId, txHash, amountWei, chainId } = body

    if (!orderId || !buyerAddress || !productId || !txHash || !amountWei) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO orders (order_id, buyer_address, product_id, tx_hash, amount_wei, chain_id, status)
      VALUES (${orderId}, ${buyerAddress.toLowerCase()}, ${productId}, ${txHash}, ${amountWei}, ${chainId || 1315}, 'pending')
      ON CONFLICT (order_id) DO UPDATE 
      SET updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `

    return NextResponse.json({ success: true, order: result[0] })
  } catch (error: any) {
    console.error("[v0] Error creating order:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
