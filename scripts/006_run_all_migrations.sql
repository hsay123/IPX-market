-- This script will execute all migrations in order
-- Run migrations 001-005 to set up the complete database schema

-- First, ensure all tables are created with the complete schema including blockchain fields
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
  ipfs_cid TEXT,
  metadata_ipfs_cid TEXT,
  nft_contract_address VARCHAR(42),
  nft_token_id TEXT,
  story_ip_id TEXT,
  license_terms_id TEXT,
  royalty_percentage DECIMAL(5, 2) DEFAULT 5.00,
  is_nft BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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
  ipfs_cid TEXT,
  metadata_ipfs_cid TEXT,
  nft_contract_address VARCHAR(42),
  nft_token_id TEXT,
  story_ip_id TEXT,
  license_terms_id TEXT,
  royalty_percentage DECIMAL(5, 2) DEFAULT 5.00,
  is_nft BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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

-- Added story_transactions table for Story Aeneid blockchain payments
CREATE TABLE IF NOT EXISTS story_transactions (
  id SERIAL PRIMARY KEY,
  tx_hash VARCHAR(66) UNIQUE NOT NULL,
  buyer_address VARCHAR(42),
  item_type VARCHAR(20) CHECK (item_type IN ('dataset', 'model')),
  item_id INTEGER,
  item_title VARCHAR(255),
  price DECIMAL(10, 4),
  status VARCHAR(50) DEFAULT 'pending',
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  item_id INTEGER NOT NULL,
  item_type VARCHAR(50) NOT NULL,
  reviewer_wallet VARCHAR(42) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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
CREATE INDEX IF NOT EXISTS idx_datasets_story_ip ON datasets(story_ip_id);
CREATE INDEX IF NOT EXISTS idx_datasets_nft ON datasets(nft_contract_address, nft_token_id);
CREATE INDEX IF NOT EXISTS idx_ai_models_owner ON ai_models(owner_wallet);
CREATE INDEX IF NOT EXISTS idx_ai_models_category ON ai_models(category);
CREATE INDEX IF NOT EXISTS idx_ai_models_status ON ai_models(status);
CREATE INDEX IF NOT EXISTS idx_models_story_ip ON ai_models(story_ip_id);
CREATE INDEX IF NOT EXISTS idx_models_nft ON ai_models(nft_contract_address, nft_token_id);
CREATE INDEX IF NOT EXISTS idx_transactions_buyer ON transactions(buyer_wallet);
CREATE INDEX IF NOT EXISTS idx_transactions_seller ON transactions(seller_wallet);
CREATE INDEX IF NOT EXISTS idx_story_tx_hash ON story_transactions(tx_hash);
CREATE INDEX IF NOT EXISTS idx_story_tx_buyer ON story_transactions(buyer_address);
CREATE INDEX IF NOT EXISTS idx_reviews_item ON reviews(item_id, item_type);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_wallet);

-- Insert sample users
INSERT INTO users (wallet_address, username, email, bio, avatar_url) VALUES
('0x1234567890123456789012345678901234567890', 'alice_data', 'alice@example.com', 'AI researcher and data scientist', '/placeholder.svg?height=100&width=100'),
('0x2345678901234567890123456789012345678901', 'bob_models', 'bob@example.com', 'ML engineer specializing in computer vision', '/placeholder.svg?height=100&width=100'),
('0x3456789012345678901234567890123456789012', 'carol_ai', 'carol@example.com', 'Data analyst and marketplace enthusiast', '/placeholder.svg?height=100&width=100')
ON CONFLICT (wallet_address) DO NOTHING;

-- Insert sample datasets
INSERT INTO datasets (title, description, category, price, file_url, file_size, file_type, preview_url, owner_wallet, downloads, views, rating, rating_count) VALUES
('High-Quality Image Dataset', 'A comprehensive collection of 100,000+ labeled images for computer vision tasks', 'Computer Vision', 0.5, '/datasets/images.zip', 5368709120, 'ZIP', '/placeholder.svg?height=200&width=300', '0x1234567890123456789012345678901234567890', 1250, 3400, 4.8, 124),
('Financial Time Series Data', 'Historical stock market data with indicators and sentiment analysis', 'Finance', 0.3, '/datasets/finance.csv', 2147483648, 'CSV', '/placeholder.svg?height=200&width=300', '0x2345678901234567890123456789012345678901', 890, 2100, 4.6, 89),
('Medical Imaging Dataset', 'Anonymized X-ray and CT scan images for medical AI research', 'Healthcare', 1.2, '/datasets/medical.zip', 10737418240, 'ZIP', '/placeholder.svg?height=200&width=300', '0x1234567890123456789012345678901234567890', 567, 1800, 4.9, 67),
('NLP Text Corpus', 'Multi-language text dataset for natural language processing tasks', 'Natural Language', 0.4, '/datasets/nlp.txt', 3221225472, 'TXT', '/placeholder.svg?height=200&width=300', '0x3456789012345678901234567890123456789012', 2100, 5600, 4.7, 210),
('Social Media Sentiment Analysis', 'Comprehensive social media posts dataset with sentiment labels for emotion detection', 'Natural Language', 0.45, '/datasets/sentiment.csv', 1610612736, 'CSV', '/placeholder.svg?height=200&width=300', '0x3456789012345678901234567890123456789012', 1450, 4200, 4.8, 145),
('Climate Change Time Series', 'Global temperature and weather pattern data spanning 100 years for climate modeling', 'Environmental', 0.35, '/datasets/climate.csv', 2684354560, 'CSV', '/placeholder.svg?height=200&width=300', '0x1234567890123456789012345678901234567890', 678, 2300, 4.7, 68),
('E-commerce Product Catalog', 'Large-scale product descriptions and images for recommendation systems', 'E-commerce', 0.6, '/datasets/ecommerce.zip', 8589934592, 'ZIP', '/placeholder.svg?height=200&width=300', '0x2345678901234567890123456789012345678901', 1890, 4800, 4.9, 189),
('Speech Recognition Audio', 'Multi-speaker audio recordings with transcriptions for speech-to-text training', 'Audio', 0.8, '/datasets/audio.zip', 12884901888, 'ZIP', '/placeholder.svg?height=200&width=300', '0x3456789012345678901234567890123456789012', 445, 1650, 4.6, 44)
ON CONFLICT DO NOTHING;

-- Insert sample AI models
INSERT INTO ai_models (name, description, category, model_type, price, file_url, file_size, framework, architecture, accuracy, owner_wallet, downloads, views, rating, rating_count) VALUES
('ResNet-50 Image Classifier', 'Pre-trained ResNet-50 model fine-tuned on custom dataset', 'Computer Vision', 'Classification', 0.8, '/models/resnet50.pth', 102400000, 'PyTorch', 'ResNet-50', 94.5, '0x2345678901234567890123456789012345678901', 456, 1200, 4.8, 45),
('BERT Sentiment Analyzer', 'Fine-tuned BERT model for sentiment analysis with 95% accuracy', 'Natural Language', 'NLP', 0.6, '/models/bert.bin', 438000000, 'TensorFlow', 'BERT-base', 95.2, '0x1234567890123456789012345678901234567890', 789, 2300, 4.9, 78),
('Object Detection Model', 'YOLOv8 model trained for real-time object detection', 'Computer Vision', 'Detection', 1.0, '/models/yolov8.onnx', 256000000, 'ONNX', 'YOLOv8', 92.8, '0x3456789012345678901234567890123456789012', 1234, 3500, 4.7, 123),
('Time Series Forecaster', 'LSTM-based model for financial time series prediction', 'Finance', 'Forecasting', 0.7, '/models/lstm.h5', 89000000, 'Keras', 'LSTM', 88.6, '0x2345678901234567890123456789012345678901', 345, 980, 4.6, 34)
ON CONFLICT DO NOTHING;
