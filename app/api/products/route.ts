import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.NEON_DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const productId = searchParams.get("id")

    if (productId) {
      const products = await sql`
        SELECT * FROM products WHERE product_id = ${productId}
      `
      return NextResponse.json({ success: true, product: products[0] || null })
    }

    let query = "SELECT * FROM products"
    const params: any[] = []

    if (category && category !== "All") {
      query += " WHERE category = $1"
      params.push(category)
    }

    query += " ORDER BY created_at DESC"

    const products = await sql(query, params)

    return NextResponse.json({ success: true, products })
  } catch (error: any) {
    console.error("[v0] Error fetching products:", error)

    // Handle missing table gracefully
    if (error.message?.includes('relation "products" does not exist')) {
      return NextResponse.json({ success: true, products: [] })
    }

    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
