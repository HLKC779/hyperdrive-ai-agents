-- Enable pgvector extension for vector operations
CREATE EXTENSION IF NOT EXISTS vector;

-- Create function for document chunk similarity search
CREATE OR REPLACE FUNCTION match_document_chunks(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.78,
  match_count int DEFAULT 10
) RETURNS TABLE (
  id uuid,
  document_id uuid,
  content text,
  metadata jsonb,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    document_chunks.id,
    document_chunks.document_id,
    document_chunks.content,
    document_chunks.metadata,
    1 - (document_chunks.embedding <=> query_embedding) AS similarity
  FROM document_chunks
  WHERE 1 - (document_chunks.embedding <=> query_embedding) > match_threshold
  ORDER BY document_chunks.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS document_chunks_embedding_idx 
ON document_chunks USING ivfflat (embedding vector_cosine_ops);

CREATE INDEX IF NOT EXISTS documents_metadata_idx 
ON documents USING gin (metadata);

CREATE INDEX IF NOT EXISTS document_chunks_metadata_idx 
ON document_chunks USING gin (metadata);

-- Update RLS policies to be more secure while maintaining functionality
-- Update profiles policy to be more restrictive
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles are viewable by authenticated users" 
ON public.profiles 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Update knowledge documents policy
DROP POLICY IF EXISTS "Knowledge documents are viewable by everyone" ON public.knowledge_documents;
CREATE POLICY "Knowledge documents are viewable by authenticated users" 
ON public.knowledge_documents 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Update knowledge chunks policy  
DROP POLICY IF EXISTS "Knowledge chunks are viewable by everyone" ON public.knowledge_chunks;
CREATE POLICY "Knowledge chunks are viewable by authenticated users" 
ON public.knowledge_chunks 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Update RL metrics policy to be user-specific
DROP POLICY IF EXISTS "Users can view all metrics" ON public.rl_agent_metrics;
CREATE POLICY "Users can view metrics for their sessions" 
ON public.rl_agent_metrics 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM rl_training_sessions 
    WHERE rl_training_sessions.id = rl_agent_metrics.session_id 
    AND rl_training_sessions.user_id = auth.uid()
  )
);

-- Update RL feedback policy to be user-specific
DROP POLICY IF EXISTS "Users can view all feedback" ON public.rl_feedback;
CREATE POLICY "Users can view their own feedback" 
ON public.rl_feedback 
FOR SELECT 
USING (user_id = auth.uid());

-- Update RL training sessions policy to be user-specific
DROP POLICY IF EXISTS "Users can view all training sessions" ON public.rl_training_sessions;
CREATE POLICY "Users can view their own training sessions" 
ON public.rl_training_sessions 
FOR SELECT 
USING (user_id = auth.uid());