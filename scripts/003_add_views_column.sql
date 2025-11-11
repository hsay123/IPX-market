-- Add missing views column to datasets and ai_models tables
ALTER TABLE datasets ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;
ALTER TABLE ai_models ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

-- Update all existing records to have 0 views
UPDATE datasets SET views = 0 WHERE views IS NULL;
UPDATE ai_models SET views = 0 WHERE views IS NULL;
