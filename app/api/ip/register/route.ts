import { type NextRequest, NextResponse } from "next/server"
import { storyProtocol } from "@/lib/story-protocol"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const {
      itemId,
      itemType, // 'dataset' or 'model'
      ownerWallet,
      metadata,
      licenseTerms,
    } = await request.json()

    if (!itemId || !itemType || !ownerWallet || !metadata) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Verify ownership
    const table = itemType === "dataset" ? "datasets" : "ai_models"
    const item = await sql`
      SELECT * FROM ${sql(table)}
      WHERE id = ${itemId} AND owner_wallet = ${ownerWallet}
    `

    if (item.length === 0) {
      return NextResponse.json({ error: "Item not found or unauthorized" }, { status: 404 })
    }

    // Register IP Asset on Story Protocol
    const { ipAssetId, txHash: registerTxHash } = await storyProtocol.registerIPAsset(metadata, ownerWallet)

    // Attach license terms if provided
    let licenseId = null
    let licenseTxHash = null
    if (licenseTerms) {
      const licenseResult = await storyProtocol.attachLicenseTerms(ipAssetId, licenseTerms)
      licenseId = licenseResult.licenseId
      licenseTxHash = licenseResult.txHash
    }

    // Update database with IP Asset ID
    const licenseTermsJson = licenseTerms ? JSON.stringify(licenseTerms) : null

    if (itemType === "dataset") {
      await sql`
        UPDATE datasets
        SET ip_asset_id = ${ipAssetId}, license_terms = ${licenseTermsJson}
        WHERE id = ${itemId}
      `
    } else {
      await sql`
        UPDATE ai_models
        SET ip_asset_id = ${ipAssetId}, license_terms = ${licenseTermsJson}
        WHERE id = ${itemId}
      `
    }

    return NextResponse.json({
      success: true,
      ipAssetId,
      licenseId,
      registerTxHash,
      licenseTxHash,
    })
  } catch (error) {
    console.error("[v0] Error registering IP:", error)
    return NextResponse.json({ error: "Failed to register IP Asset" }, { status: 500 })
  }
}
