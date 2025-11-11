import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { wallet_address } = await request.json()

    if (!wallet_address) {
      return NextResponse.json({ error: "Wallet address is required" }, { status: 400 })
    }

    // Check if user exists
    const existingUser = await sql`
      SELECT * FROM users WHERE wallet_address = ${wallet_address}
    `

    if (existingUser.length > 0) {
      return NextResponse.json({ user: existingUser[0] })
    }

    // Create new user
    const newUser = await sql`
      INSERT INTO users (wallet_address)
      VALUES (${wallet_address})
      RETURNING *
    `

    return NextResponse.json({ user: newUser[0] }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating/fetching user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const wallet_address = searchParams.get("wallet_address")

    if (!wallet_address) {
      return NextResponse.json({ error: "Wallet address is required" }, { status: 400 })
    }

    const user = await sql`
      SELECT * FROM users WHERE wallet_address = ${wallet_address}
    `

    if (user.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user: user[0] })
  } catch (error) {
    console.error("[v0] Error fetching user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { wallet_address, username, email, bio, avatar_url } = await request.json()

    if (!wallet_address) {
      return NextResponse.json({ error: "Wallet address is required" }, { status: 400 })
    }

    const updatedUser = await sql`
      UPDATE users
      SET 
        username = COALESCE(${username}, username),
        email = COALESCE(${email}, email),
        bio = COALESCE(${bio}, bio),
        avatar_url = COALESCE(${avatar_url}, avatar_url),
        updated_at = CURRENT_TIMESTAMP
      WHERE wallet_address = ${wallet_address}
      RETURNING *
    `

    if (updatedUser.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user: updatedUser[0] })
  } catch (error) {
    console.error("[v0] Error updating user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
