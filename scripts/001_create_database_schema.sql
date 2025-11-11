-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  wallet_address VARCHAR(42) UNIQUE NOT NULL,
  username VARCHAR(100),
  email VARCHAR(255),
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create datasets table
CREATE TABLE IF NOT EXISTS datasets (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  price DECIMAL(20, 8) NOT NULL,
  file_url TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  preview_url TEXT,
  owner_wallet VARCHAR(42) NOT NULL,
  ip_asset_id VARCHAR(255),
  license_terms TEXT,
  downloads INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  rating DECIMAL(3, 2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create ai_models table
CREATE TABLE IF NOT EXISTS ai_models (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  model_type VARCHAR(100) NOT NULL,
  price DECIMAL(20, 8) NOT NULL,
  file_url TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  framework VARCHAR(50),
  architecture TEXT,
  training_datasets TEXT[],
  accuracy DECIMAL(5, 2),
  owner_wallet VARCHAR(42) NOT NULL,
  ip_asset_id VARCHAR(255),
  license_terms TEXT,
  downloads INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  rating DECIMAL(3, 2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  tx_hash VARCHAR(66) UNIQUE NOT NULL,
  buyer_wallet VARCHAR(42) NOT NULL,
  seller_wallet VARCHAR(42) NOT NULL,
  item_id INTEGER NOT NULL,
  item_type VARCHAR(50) NOT NULL,
  amount DECIMAL(20, 8) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  item_id INTEGER NOT NULL,
  item_type VARCHAR(50) NOT NULL,
  reviewer_wallet VARCHAR(42) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id SERIAL PRIMARY KEY,
  user_wallet VARCHAR(42) NOT NULL,
  item_id INTEGER NOT NULL,
  item_type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_wallet, item_id, item_type)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_datasets_owner ON datasets(owner_wallet);
CREATE INDEX IF NOT EXISTS idx_datasets_category ON datasets(category);
CREATE INDEX IF NOT EXISTS idx_datasets_status ON datasets(status);
CREATE INDEX IF NOT EXISTS idx_ai_models_owner ON ai_models(owner_wallet);
CREATE INDEX IF NOT EXISTS idx_ai_models_category ON ai_models(category);
CREATE INDEX IF NOT EXISTS idx_ai_models_status ON ai_models(status);
CREATE INDEX IF NOT EXISTS idx_transactions_buyer ON transactions(buyer_wallet);
CREATE INDEX IF NOT EXISTS idx_transactions_seller ON transactions(seller_wallet);
CREATE INDEX IF NOT EXISTS idx_reviews_item ON reviews(item_id, item_type);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_wallet);
