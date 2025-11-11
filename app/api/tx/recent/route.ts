import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const address = searchParams.get("address")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    if (!address) {
      return NextResponse.json({ error: "Address parameter is required" }, { status: 400 })
    }

    try {
      // Query recent transactions for this address
      const transactions = await sql`
        SELECT 
          tx_hash as hash,
          sender as "from",
          recipient as "to",
          amount as value,
          memo,
          created_at as timestamp,
          verified_at IS NOT NULL as verified
        FROM story_transactions
        WHERE sender = ${address} OR recipient = ${address}
        ORDER BY created_at DESC
        LIMIT ${limit}
      `

      return NextResponse.json({
        transactions: transactions.rows || [],
        count: transactions.rows?.length || 0,
      })
    } catch (dbError: any) {
      // If table doesn't exist, return empty array
      if (dbError.message?.includes('relation "story_transactions" does not exist')) {
        console.log("[v0] story_transactions table not found, returning empty transactions")
        return NextResponse.json({ transactions: [], count: 0 })
      }
      throw dbError
    }
  } catch (error: any) {
    console.error("[v0] Failed to fetch transactions:", error)
    return NextResponse.json({ error: "Failed to fetch transactions", details: error.message }, { status: 500 })
  }
}
