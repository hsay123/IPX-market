-- Create Story Aeneid transactions table for tracking verified payments
CREATE TABLE IF NOT EXISTS story_transactions (
  id SERIAL PRIMARY KEY,
  tx_hash VARCHAR(66) UNIQUE NOT NULL,
  sender VARCHAR(42),
  recipient VARCHAR(42),
  amount VARCHAR(50),
  memo TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_story_tx_hash ON story_transactions(tx_hash);
CREATE INDEX IF NOT EXISTS idx_story_sender ON story_transactions(sender);
CREATE INDEX IF NOT EXISTS idx_story_recipient ON story_transactions(recipient);
CREATE INDEX IF NOT EXISTS idx_story_created_at ON story_transactions(created_at DESC);

-- Add comment
COMMENT ON TABLE story_transactions IS 'Tracks Story Aeneid testnet payment transactions';
