import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import crypto from "crypto"

const sql = neon(process.env.NEON_DATABASE_URL!)

// Generate a presigned URL (mock for now - would use AWS SDK in production)
function generatePresignedUrl(storageKey: string, expiresIn = 600): string {
  // In production, use AWS SDK to generate real presigned URLs
  // For now, return a mock URL with the storage key
  const expires = Date.now() + expiresIn * 1000
  const signature = crypto.createHash("sha256").update(`${storageKey}:${expires}`).digest("hex").slice(0, 16)
  return `/api/download/file?key=${encodeURIComponent(storageKey)}&expires=${expires}&sig=${signature}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, buyerAddress } = body

    if (!orderId || !buyerAddress) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Verify the order exists and belongs to this buyer
    const orders = await sql`
      SELECT o.*, p.storage_key, p.storage_provider, p.title, p.checksum
      FROM orders o
      JOIN products p ON o.product_id = p.product_id
      WHERE o.order_id = ${orderId} 
      AND o.buyer_address = ${buyerAddress.toLowerCase()}
      AND o.status = 'completed'
    `

    if (orders.length === 0) {
      return NextResponse.json({ success: false, error: "Order not found or not completed" }, { status: 404 })
    }

    const order = orders[0]

    // Check for existing valid ticket
    const existingTickets = await sql`
      SELECT * FROM download_tickets
      WHERE order_id = ${orderId}
      AND expires_at > CURRENT_TIMESTAMP
      AND use_count < max_uses
      ORDER BY created_at DESC
      LIMIT 1
    `

    let ticket
    if (existingTickets.length > 0) {
      ticket = existingTickets[0]
    } else {
      // Create new download ticket
      const ticketId = `ticket-${crypto.randomBytes(16).toString("hex")}`
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

      const newTickets = await sql`
        INSERT INTO download_tickets (
          ticket_id, order_id, product_key, expires_at, max_uses, use_count
        )
        VALUES (
          ${ticketId}, ${orderId}, ${order.storage_key}, ${expiresAt}, 3, 0
        )
        RETURNING *
      `
      ticket = newTickets[0]
    }

    // Generate presigned URL
    const downloadUrl = generatePresignedUrl(order.storage_key, 600)

    // Increment use count
    await sql`
      UPDATE download_tickets
      SET use_count = use_count + 1, used_at = CURRENT_TIMESTAMP
      WHERE ticket_id = ${ticket.ticket_id}
    `

    // Log the download
    const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    const userAgent = request.headers.get("user-agent") || "unknown"

    await sql`
      INSERT INTO download_logs (
        ticket_id, order_id, buyer_address, product_id, ip_address, user_agent
      )
      VALUES (
        ${ticket.ticket_id}, ${orderId}, ${buyerAddress.toLowerCase()}, ${order.product_id}, ${ipAddress}, ${userAgent}
      )
    `

    return NextResponse.json({
      success: true,
      downloadUrl,
      expiresIn: 600,
      remainingDownloads: ticket.max_uses - ticket.use_count - 1,
      checksum: order.checksum,
    })
  } catch (error: any) {
    console.error("[v0] Error generating download URL:", error)

    if (error.message?.includes("relation") && error.message?.includes("does not exist")) {
      return NextResponse.json(
        { success: false, error: "Database not initialized. Please run the setup script." },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
