// Database types for orders and products system

export interface Product {
  id: number
  product_id: string
  title: string
  description: string | null
  category: string | null
  price_wei: string
  storage_provider: string
  storage_key: string | null
  checksum: string | null
  version: string
  file_size: number | null
  file_type: string | null
  creator_address: string
  ip_id: string | null
  license_terms: string | null
  metadata: Record<string, any> | null
  created_at: Date
  updated_at: Date
}

export interface Order {
  id: number
  order_id: string
  buyer_address: string
  product_id: string
  tx_hash: string
  amount_wei: string
  chain_id: number
  status: "pending" | "completed" | "failed" | "refunded"
  verified_at: Date | null
  created_at: Date
  updated_at: Date
}

export interface DownloadTicket {
  id: number
  ticket_id: string
  order_id: string
  product_key: string
  expires_at: Date
  used_at: Date | null
  max_uses: number
  use_count: number
  ip_address: string | null
  user_agent: string | null
  created_at: Date
}

export interface DownloadLog {
  id: number
  ticket_id: string
  order_id: string
  buyer_address: string
  product_id: string
  ip_address: string | null
  user_agent: string | null
  downloaded_at: Date
}
