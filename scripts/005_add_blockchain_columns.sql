-- Add blockchain-related columns to datasets table
ALTER TABLE datasets 
ADD COLUMN IF NOT EXISTS ipfs_cid TEXT,
ADD COLUMN IF NOT EXISTS metadata_ipfs_cid TEXT,
ADD COLUMN IF NOT EXISTS nft_contract_address VARCHAR(42),
ADD COLUMN IF NOT EXISTS nft_token_id TEXT,
ADD COLUMN IF NOT EXISTS story_ip_id TEXT,
ADD COLUMN IF NOT EXISTS license_terms_id TEXT,
ADD COLUMN IF NOT EXISTS royalty_percentage DECIMAL(5, 2) DEFAULT 5.00,
ADD COLUMN IF NOT EXISTS is_nft BOOLEAN DEFAULT FALSE;

-- Add blockchain-related columns to ai_models table
ALTER TABLE ai_models 
ADD COLUMN IF NOT EXISTS ipfs_cid TEXT,
ADD COLUMN IF NOT EXISTS metadata_ipfs_cid TEXT,
ADD COLUMN IF NOT EXISTS nft_contract_address VARCHAR(42),
ADD COLUMN IF NOT EXISTS nft_token_id TEXT,
ADD COLUMN IF NOT EXISTS story_ip_id TEXT,
ADD COLUMN IF NOT EXISTS license_terms_id TEXT,
ADD COLUMN IF NOT EXISTS royalty_percentage DECIMAL(5, 2) DEFAULT 5.00,
ADD COLUMN IF NOT EXISTS is_nft BOOLEAN DEFAULT FALSE;

-- Create indexes for blockchain lookups
CREATE INDEX IF NOT EXISTS idx_datasets_story_ip ON datasets(story_ip_id);
CREATE INDEX IF NOT EXISTS idx_datasets_nft ON datasets(nft_contract_address, nft_token_id);
CREATE INDEX IF NOT EXISTS idx_models_story_ip ON ai_models(story_ip_id);
CREATE INDEX IF NOT EXISTS idx_models_nft ON ai_models(nft_contract_address, nft_token_id);
