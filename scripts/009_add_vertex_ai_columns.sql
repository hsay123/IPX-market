-- Add Vertex AI analysis columns to datasets table
ALTER TABLE datasets 
ADD COLUMN IF NOT EXISTS vertex_ai_story TEXT,
ADD COLUMN IF NOT EXISTS vertex_ai_caption TEXT,
ADD COLUMN IF NOT EXISTS vertex_ai_tags TEXT[],
ADD COLUMN IF NOT EXISTS vertex_ai_confidence DECIMAL(3, 2),
ADD COLUMN IF NOT EXISTS vertex_ai_status VARCHAR(50) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS vertex_ai_processed_at TIMESTAMP;

-- Add Vertex AI analysis columns to ai_models table
ALTER TABLE ai_models 
ADD COLUMN IF NOT EXISTS vertex_ai_story TEXT,
ADD COLUMN IF NOT EXISTS vertex_ai_caption TEXT,
ADD COLUMN IF NOT EXISTS vertex_ai_tags TEXT[],
ADD COLUMN IF NOT EXISTS vertex_ai_confidence DECIMAL(3, 2),
ADD COLUMN IF NOT EXISTS vertex_ai_status VARCHAR(50) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS vertex_ai_processed_at TIMESTAMP;

-- Create index for vertex AI status lookups
CREATE INDEX IF NOT EXISTS idx_datasets_vertex_status ON datasets(vertex_ai_status);
CREATE INDEX IF NOT EXISTS idx_models_vertex_status ON ai_models(vertex_ai_status);
