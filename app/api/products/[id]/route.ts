import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.NEON_DATABASE_URL!)

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, description, category, price, fileSize, checksum, version } = body

    const result = await sql`
      UPDATE products
      SET title = ${title}, description = ${description}, category = ${category}, 
          price = ${price}, file_size = ${fileSize}, checksum = ${checksum}, version = ${version}, updated_at = NOW()
      WHERE product_id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, product: result[0] })
  } catch (error: any) {
    console.error("[v0] Error updating product:", error)
    if (error.message?.includes('relation "products" does not exist')) {
      return NextResponse.json({ success: false, error: "Products table not found" }, { status: 500 })
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const result = await sql`
      DELETE FROM products
      WHERE product_id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Product deleted" })
  } catch (error: any) {
    console.error("[v0] Error deleting product:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
