import { type NextRequest, NextResponse } from "next/server"

interface EmailReceiptPayload {
  to: string
  orderId: string
  productTitle: string
  txHash: string
  amount: string
  downloadUrl?: string
}

async function sendEmail(payload: EmailReceiptPayload) {
  // For now, we'll use a simple implementation that logs the email
  // In production, you would use a service like SendGrid, Resend, or AWS SES

  const emailBody = `
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #0a0a0a; color: #ffffff; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #1a1a1a; border-radius: 8px; padding: 30px; border: 1px solid rgba(255,255,255,0.1);">
          
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="margin: 0; color: #602fc0; font-size: 28px;">IPX Market</h1>
            <p style="color: #888; margin: 5px 0 0 0;">Purchase Receipt</p>
          </div>

          <!-- Order Details -->
          <div style="background-color: rgba(96, 47, 192, 0.1); border-left: 4px solid #602fc0; padding: 20px; margin-bottom: 20px; border-radius: 4px;">
            <h2 style="margin: 0 0 15px 0; color: #602fc0;">Order Details</h2>
            
            <div style="margin-bottom: 12px;">
              <p style="margin: 0; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Order ID</p>
              <p style="margin: 5px 0 0 0; font-family: monospace; font-size: 14px;">${payload.orderId}</p>
            </div>

            <div style="margin-bottom: 12px;">
              <p style="margin: 0; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Product</p>
              <p style="margin: 5px 0 0 0; font-size: 16px; font-weight: bold;">${payload.productTitle}</p>
            </div>

            <div style="margin-bottom: 12px;">
              <p style="margin: 0; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Amount Paid</p>
              <p style="margin: 5px 0 0 0; font-size: 16px;">${payload.amount} IP</p>
            </div>

            <div>
              <p style="margin: 0; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Transaction Hash</p>
              <p style="margin: 5px 0 0 0; font-family: monospace; font-size: 12px; word-break: break-all; color: #888;">${payload.txHash}</p>
            </div>
          </div>

          <!-- Download Section -->
          ${
            payload.downloadUrl
              ? `
            <div style="margin-bottom: 20px;">
              <a href="${payload.downloadUrl}" style="display: inline-block; background-color: #602fc0; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold;">Download Now</a>
              <p style="color: #888; font-size: 12px; margin-top: 10px;">Download link will expire in 24 hours. You can access your purchase anytime from your account.</p>
            </div>
          `
              : ""
          }

          <!-- Footer -->
          <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px; margin-top: 30px; text-align: center; color: #888; font-size: 12px;">
            <p>This is an automated message from IPX Market. Please do not reply to this email.</p>
            <p style="margin-top: 10px;">Questions? Contact support at support@ipxmarket.io</p>
          </div>

        </div>
      </body>
    </html>
  `

  console.log("[v0] Email receipt details:", {
    to: payload.to,
    orderId: payload.orderId,
    productTitle: payload.productTitle,
    htmlPreview: emailBody.slice(0, 100) + "...",
  })

  return true
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { to, orderId, productTitle, txHash, amount, downloadUrl } = body

    if (!to || !orderId || !productTitle || !txHash || !amount) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Validate email format
    if (!to.includes("@")) {
      return NextResponse.json({ success: false, error: "Invalid email address" }, { status: 400 })
    }

    // Send the email
    const emailSent = await sendEmail({
      to,
      orderId,
      productTitle,
      txHash,
      amount,
      downloadUrl,
    })

    if (emailSent) {
      return NextResponse.json({
        success: true,
        message: "Receipt email sent successfully",
      })
    }

    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 })
  } catch (error: any) {
    console.error("[v0] Email receipt error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
