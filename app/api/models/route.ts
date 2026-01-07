import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { createOrUpdateUser, saveMetadata } from "@/lib/firestore"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    let query = sql`SELECT * FROM ai_models WHERE status = 'active'`

    if (category) {
      query = sql`SELECT * FROM ai_models WHERE status = 'active' AND category = ${category}`
    }

    if (search) {
      const searchTerm = `%${search}%`
      query = sql`
        SELECT * FROM ai_models 
        WHERE status = 'active' 
        AND (name ILIKE ${searchTerm} OR description ILIKE ${searchTerm})
      `
    }

    const models = await sql`
      ${query}
      ORDER BY created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `

    return NextResponse.json({ models })
  } catch (error) {
    console.error("[v0] Error fetching models:", error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    if (errorMessage.includes('relation "ai_models" does not exist')) {
      console.log("[v0] Database not initialized, returning empty array")
      return NextResponse.json({ models: [] })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      name,
      description,
      category,
      modelType,
      price,
      fileUrl,
      fileSize,
      framework,
      architecture,
      accuracy,
      ownerWallet,
    } = await request.json()

    // Validate required fields
    if (
      !name ||
      !description ||
      !category ||
      !modelType ||
      !price ||
      !fileUrl ||
      !fileSize ||
      !framework ||
      !architecture ||
      !ownerWallet
    ) {
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

    // Insert model
    const model = await sql`
      INSERT INTO ai_models (
        name,
        description,
        category,
        model_type,
        price,
        file_url,
        file_size,
        framework,
        architecture,
        accuracy,
        owner_wallet
      )
      VALUES (
        ${name},
        ${description},
        ${category},
        ${modelType},
        ${price},
        ${fileUrl},
        ${fileSize},
        ${framework},
        ${architecture},
        ${accuracy},
        ${ownerWallet}
      )
      RETURNING *
    `

    saveMetadata({
      itemId: model[0].id,
      itemType: "model",
      tags: [],
      caption: description,
      safetyStatus: "pending",
    }).catch((error) => {
      console.error("[v0] Failed to save metadata:", error)
    })

    return NextResponse.json({ model: model[0] }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating model:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
