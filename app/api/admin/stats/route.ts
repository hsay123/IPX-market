import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.NEON_DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    // Get product count
    const products = await sql`SELECT COUNT(*) as count FROM products`
    const productCount = products[0]?.count || 0

    // Get order count and total revenue
    const orders = await sql`
      SELECT COUNT(*) as count, SUM(CAST(amount_wei as DECIMAL)) as total_revenue FROM orders WHERE status = 'completed'
    `
    const orderCount = orders[0]?.count || 0
    const totalRevenue = (orders[0]?.total_revenue || 0) / 1e18 // Convert from wei

    return NextResponse.json({
      success: true,
      totalProducts: productCount,
      totalOrders: orderCount,
      totalRevenue: totalRevenue.toFixed(3),
    })
  } catch (error: any) {
    console.error("[v0] Error fetching stats:", error)

    // Return default stats if tables don't exist
    if (error.message?.includes("does not exist")) {
      return NextResponse.json({
        success: true,
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: "0",
      })
    }

    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
