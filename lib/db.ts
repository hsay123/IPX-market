import { neon } from "@neondatabase/serverless"

// Create a singleton SQL client
const sql = neon(process.env.NEON_DATABASE_URL!)

export { sql }

export type User = {
  id: number
  wallet_address: string
  username: string | null
  email: string | null
  bio: string | null
  avatar_url: string | null
  created_at: Date
  updated_at: Date
}

export type Dataset = {
  id: number
  title: string
  description: string
  category: string
  price: number
  file_url: string
  file_size: number
  file_type: string
  preview_url: string | null
  owner_wallet: string
  ip_asset_id: string | null
  license_terms: string | null
  downloads: number
  views: number
  rating: number
  rating_count: number
  status: string
  created_at: Date
  updated_at: Date
}

export type AIModel = {
  id: number
  name: string
  description: string
  category: string
  model_type: string
  price: number
  file_url: string
  file_size: number
  framework: string | null
  architecture: string | null
  training_datasets: string[] | null
  accuracy: number | null
  owner_wallet: string
  ip_asset_id: string | null
  license_terms: string | null
  downloads: number
  views: number
  rating: number
  rating_count: number
  status: string
  created_at: Date
  updated_at: Date
}

export type Transaction = {
  id: number
  tx_hash: string
  buyer_wallet: string
  seller_wallet: string
  item_id: number
  item_type: string
  amount: number
  status: string
  created_at: Date
  completed_at: Date | null
}

export type Review = {
  id: number
  item_id: number
  item_type: string
  reviewer_wallet: string
  rating: number
  comment: string | null
  created_at: Date
}
