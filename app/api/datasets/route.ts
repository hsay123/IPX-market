import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { createOrUpdateUser, saveMetadata, saveImageRecord } from "@/lib/firestore"
import { Timestamp } from "firebase/firestore"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    let query = sql`SELECT * FROM datasets WHERE status = 'active'`

    if (category) {
      query = sql`SELECT * FROM datasets WHERE status = 'active' AND category = ${category}`
    }

    if (search) {
      const searchTerm = `%${search}%`
      query = sql`
        SELECT * FROM datasets 
        WHERE status = 'active' 
        AND (title ILIKE ${searchTerm} OR description ILIKE ${searchTerm})
      `
    }

    const datasets = await sql`
      ${query}
      ORDER BY created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `

    return NextResponse.json({ datasets })
  } catch (error) {
    console.error("[v0] Error fetching datasets:", error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    if (errorMessage.includes('relation "datasets" does not exist')) {
      console.log("[v0] Database not initialized, returning empty array")
      return NextResponse.json({ datasets: [] })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, category, price, fileUrl, fileSize, fileType, previewUrl, ownerWallet } =
      await request.json()

    // Validate required fields
    if (!title || !description || !category || !price || !fileUrl || !fileSize || !fileType || !ownerWallet) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if user exists
    const user = await sql`
      SELECT * FROM users WHERE wallet_address = ${ownerWallet}
    `

    if (user.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    createOrUpdateUser(ownerWallet, {
      id: ownerWallet,
      wallet: ownerWallet,
    }).catch((error) => {
      console.error("[v0] Failed to create Firebase user record:", error)
    })

    // Insert dataset
    const dataset = await sql`
      INSERT INTO datasets (
        title,
        description,
        category,
        price,
        file_url,
        file_size,
        file_type,
        preview_url,
        owner_wallet
      )
      VALUES (
        ${title},
        ${description},
        ${category},
        ${price},
        ${fileUrl},
        ${fileSize},
        ${fileType},
        ${previewUrl || null},
        ${ownerWallet}
      )
      RETURNING *
    `

    const createdDataset = dataset[0]

    if (previewUrl) {
      // Save to Firestore and trigger Vertex AI (non-blocking)
      saveImageRecord({
        id: `dataset_${createdDataset.id}_preview`,
        url: previewUrl,
        uploadTimestamp: Timestamp.now(),
        itemId: createdDataset.id,
        itemType: "dataset",
        ownerWallet,
      }).catch((error) => {
        console.error("[v0] Failed to save image record:", error)
      })

      // Save initial metadata
      saveMetadata({
        itemId: createdDataset.id,
        itemType: "dataset",
        tags: [],
        caption: description,
        safetyStatus: "pending",
      }).catch((error) => {
        console.error("[v0] Failed to save metadata:", error)
      })

      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      const analyzeUrl = new URL("/api/analyze/image", appUrl).toString()

      fetch(analyzeUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: previewUrl,
          itemId: createdDataset.id,
          itemType: "dataset",
        }),
      }).catch((error) => {
        console.error("[v0] Failed to queue Vertex AI analysis:", error)
      })
    }

    return NextResponse.json({ dataset: createdDataset }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating dataset:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
