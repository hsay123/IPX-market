-- Create products table for datasets and AI models
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  product_id VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  price_wei VARCHAR(100) NOT NULL,
  storage_provider VARCHAR(50) NOT NULL DEFAULT 's3',
  storage_key VARCHAR(500),
  checksum VARCHAR(64),
  version VARCHAR(50) DEFAULT '1.0.0',
  file_size BIGINT,
  file_type VARCHAR(50),
  creator_address VARCHAR(42) NOT NULL,
  ip_id VARCHAR(42),
  license_terms TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table for purchase tracking
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  order_id VARCHAR(255) UNIQUE NOT NULL,
  buyer_address VARCHAR(42) NOT NULL,
  product_id VARCHAR(255) NOT NULL,
  tx_hash VARCHAR(66) NOT NULL,
  amount_wei VARCHAR(100) NOT NULL,
  chain_id INTEGER NOT NULL DEFAULT 1315,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

-- Create download_tickets table for secure download management
CREATE TABLE IF NOT EXISTS download_tickets (
  id SERIAL PRIMARY KEY,
  ticket_id VARCHAR(255) UNIQUE NOT NULL,
  order_id VARCHAR(255) NOT NULL,
  product_key VARCHAR(500) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP,
  max_uses INTEGER DEFAULT 3,
  use_count INTEGER DEFAULT 0,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);

-- Create download_logs table for tracking all downloads
CREATE TABLE IF NOT EXISTS download_logs (
  id SERIAL PRIMARY KEY,
  ticket_id VARCHAR(255) NOT NULL,
  order_id VARCHAR(255) NOT NULL,
  buyer_address VARCHAR(42) NOT NULL,
  product_id VARCHAR(255) NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  downloaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ticket_id) REFERENCES download_tickets(ticket_id) ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_buyer ON orders(buyer_address);
CREATE INDEX IF NOT EXISTS idx_orders_tx_hash ON orders(tx_hash);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_products_creator ON products(creator_address);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_download_tickets_order ON download_tickets(order_id);
CREATE INDEX IF NOT EXISTS idx_download_tickets_expires ON download_tickets(expires_at);
CREATE INDEX IF NOT EXISTS idx_download_logs_buyer ON download_logs(buyer_address);

-- Insert sample products (datasets and AI models)
INSERT INTO products (product_id, title, description, category, price_wei, storage_provider, storage_key, checksum, version, file_size, file_type, creator_address, license_terms)
VALUES
  ('dataset-001', 'Financial Market Data 2024', 'Comprehensive stock market dataset with 10M+ transactions', 'Finance', '100000000000000000', 's3', 'datasets/financial-market-2024.zip', 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', '2.0.0', 524288000, 'ZIP', '0x1234567890123456789012345678901234567890', 'Creative Commons Attribution 4.0'),
  ('dataset-002', 'Medical Imaging Dataset', 'High-resolution X-ray and MRI scans for medical AI training', 'Healthcare', '200000000000000000', 's3', 'datasets/medical-imaging.zip', 'b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1', '1.5.0', 1073741824, 'ZIP', '0x2345678901234567890123456789012345678901', 'Research License'),
  ('dataset-003', 'Natural Language Processing Corpus', 'Multi-language text corpus with 1B tokens', 'NLP', '150000000000000000', 's3', 'datasets/nlp-corpus.zip', 'c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1b2', '3.0.0', 2147483648, 'ZIP', '0x3456789012345678901234567890123456789012', 'MIT License'),
  ('model-001', 'Financial Prediction AI', 'Trained model for stock price prediction with 95% accuracy', 'Finance', '300000000000000000', 's3', 'models/financial-prediction.h5', 'd4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1b2c3', '1.0.0', 104857600, 'H5', '0x4567890123456789012345678901234567890123', 'Commercial License'),
  ('model-002', 'Medical Diagnostic AI', 'Deep learning model for disease detection from medical images', 'Healthcare', '500000000000000000', 's3', 'models/medical-diagnostic.pt', 'e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1b2c3d4', '2.0.0', 209715200, 'PT', '0x5678901234567890123456789012345678901234', 'Research License'),
  ('model-003', 'Language Model GPT', 'Fine-tuned GPT model for specialized text generation', 'NLP', '400000000000000000', 's3', 'models/language-model-gpt.safetensors', 'f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1b2c3d4e5', '1.2.0', 314572800, 'SAFETENSORS', '0x6789012345678901234567890123456789012345', 'Apache 2.0')
ON CONFLICT (product_id) DO NOTHING;

-- Add sample completed order for testing
INSERT INTO orders (order_id, buyer_address, product_id, tx_hash, amount_wei, chain_id, status, verified_at)
VALUES
  ('order-001', '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1', 'dataset-001', '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890', '100000000000000000', 1315, 'completed', CURRENT_TIMESTAMP)
ON CONFLICT (order_id) DO NOTHING;
