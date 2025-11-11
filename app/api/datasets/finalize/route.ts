import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { datasetId, ipfsCid, metadataCid, nftData, ipId, licenseTermsId, royaltyPercentage, isNft } =
      await request.json()

    console.log("[v0] Finalizing dataset:", datasetId)

    try {
      // Try to check if the column exists by querying the information schema
      const columnsCheck = await sql`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'datasets' 
        AND column_name = 'ipfs_cid'
      `

      if (columnsCheck.length > 0) {
        // Columns exist, proceed with full update
        console.log("[v0] Blockchain columns found, updating dataset with blockchain data")
        await sql`
          UPDATE datasets 
          SET 
            ipfs_cid = ${ipfsCid || null},
            metadata_ipfs_cid = ${metadataCid || null},
            nft_contract_address = ${nftData?.contractAddress || null},
            nft_token_id = ${nftData?.tokenId || null},
            story_ip_id = ${ipId || null},
            license_terms_id = ${licenseTermsId || null},
            royalty_percentage = ${royaltyPercentage || 5},
            is_nft = ${isNft || false}
          WHERE id = ${datasetId}
        `
      } else {
        // Columns don't exist, skip blockchain data storage
        console.log("[v0] Blockchain columns not found, dataset already created successfully")
        // The dataset was already created in the POST /api/datasets route, so we're done
      }
    } catch (checkError) {
      // If we can't check columns, assume they don't exist and skip
      console.log("[v0] Could not check for blockchain columns, skipping blockchain data update")
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Dataset finalization error:", error)
    return NextResponse.json({ error: "Failed to finalize dataset" }, { status: 500 })
  }
}
