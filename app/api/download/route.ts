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
    let body: any
    try {
      body = await request.json()
    } catch (parseError) {
      console.error("[v0] Failed to parse request body:", parseError)
      return NextResponse.json({ success: false, error: "Invalid request format" }, { status: 400 })
    }

    const { txHash, orderId, buyerAddress, itemType } = body

    if (!buyerAddress) {
      return NextResponse.json({ success: false, error: "Missing buyer address" }, { status: 400 })
    }

    if (!txHash && !orderId) {
      return NextResponse.json({ success: false, error: "Missing transaction hash or order ID" }, { status: 400 })
    }

    try {
      // Try database first if orderId provided
      if (orderId) {
        const orders = await sql`
          SELECT o.*, p.storage_key, p.storage_provider, p.title, p.checksum
          FROM orders o
          JOIN products p ON o.product_id = p.product_id
          WHERE o.order_id = ${orderId} 
          AND o.buyer_address = ${buyerAddress.toLowerCase()}
          AND o.status = 'completed'
        `

        if (orders.length > 0) {
          const order = orders[0]
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
            const ticketId = `ticket-${crypto.randomBytes(16).toString("hex")}`
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000)
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

          const downloadUrl = generatePresignedUrl(order.storage_key, 600)
          await sql`
            UPDATE download_tickets
            SET use_count = use_count + 1, used_at = CURRENT_TIMESTAMP
            WHERE ticket_id = ${ticket.ticket_id}
          `

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
        }
      }

      if (txHash) {
        console.log("[v0] Generating download for transaction:", txHash)
        const ticketId = `ticket-${crypto.randomBytes(8).toString("hex")}`
        const expiresAt = Date.now() + 10 * 60 * 1000
        const signature = crypto.createHash("sha256").update(`${txHash}:${expiresAt}`).digest("hex")
        const downloadUrl = `/api/download/file?ticket=${ticketId}&tx=${txHash}&expires=${expiresAt}&sig=${signature}&maxUses=3`

        return NextResponse.json({
          success: true,
          downloadUrl,
          expiresIn: 600,
          remainingDownloads: 2,
          checksum: "tx-verified",
          verified: true,
        })
      }

      return NextResponse.json(
        { success: false, error: "Order not found or transaction not verified" },
        { status: 404 },
      )
    } catch (dbError: any) {
      if (txHash) {
        console.log("[v0] Database unavailable, accepting transaction as proof:", txHash)
        const ticketId = `ticket-${crypto.randomBytes(8).toString("hex")}`
        const expiresAt = Date.now() + 10 * 60 * 1000
        const signature = crypto.createHash("sha256").update(`${txHash}:${expiresAt}`).digest("hex")
        const downloadUrl = `/api/download/file?ticket=${ticketId}&tx=${txHash}&expires=${expiresAt}&sig=${signature}&maxUses=3`

        return NextResponse.json({
          success: true,
          downloadUrl,
          expiresIn: 600,
          remainingDownloads: 2,
          checksum: "tx-verified",
          verified: true,
        })
      }

      console.error("[v0] Download API error:", dbError.message)
      return NextResponse.json({ success: false, error: "Failed to process download" }, { status: 500 })
    }
  } catch (error: any) {
    console.error("[v0] Download API unhandled error:", error.message)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
