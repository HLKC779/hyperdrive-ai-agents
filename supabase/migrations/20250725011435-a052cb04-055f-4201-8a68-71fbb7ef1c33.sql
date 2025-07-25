-- Security Fix Migration: Address Critical RLS and Auth Issues

-- 1. Fix RLS policies to require authentication instead of allowing anonymous access

-- Fix rl_agent_metrics table policies
DROP POLICY IF EXISTS "Authenticated users can view metrics" ON public.rl_agent_metrics;
DROP POLICY IF EXISTS "Users can create metrics" ON public.rl_agent_metrics;

CREATE POLICY "Authenticated users can view metrics" 
ON public.rl_agent_metrics 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create metrics" 
ON public.rl_agent_metrics 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Fix rl_feedback table policies
DROP POLICY IF EXISTS "Users can create feedback" ON public.rl_feedback;
DROP POLICY IF EXISTS "Users can view their own feedback" ON public.rl_feedback;
DROP POLICY IF EXISTS "Authenticated users can update feedback" ON public.rl_feedback;

CREATE POLICY "Authenticated users can create feedback" 
ON public.rl_feedback 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND (user_id = auth.uid() OR user_id IS NULL));

CREATE POLICY "Users can view their own feedback" 
ON public.rl_feedback 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND (user_id = auth.uid() OR user_id IS NULL));

CREATE POLICY "Authenticated users can update feedback" 
ON public.rl_feedback 
FOR UPDATE 
USING (auth.uid() IS NOT NULL AND (user_id = auth.uid() OR user_id IS NULL));

-- Fix rl_system_interactions table policies
DROP POLICY IF EXISTS "Users can create interactions" ON public.rl_system_interactions;
DROP POLICY IF EXISTS "Users can view their own interactions" ON public.rl_system_interactions;

CREATE POLICY "Authenticated users can create interactions" 
ON public.rl_system_interactions 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND (user_id = auth.uid() OR user_id IS NULL));

CREATE POLICY "Users can view their own interactions" 
ON public.rl_system_interactions 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND (user_id = auth.uid() OR user_id IS NULL));

-- Fix rl_training_sessions table policies
DROP POLICY IF EXISTS "Users can create training sessions" ON public.rl_training_sessions;
DROP POLICY IF EXISTS "Authenticated users can view training sessions" ON public.rl_training_sessions;
DROP POLICY IF EXISTS "Authenticated users can update training sessions" ON public.rl_training_sessions;

CREATE POLICY "Authenticated users can create training sessions" 
ON public.rl_training_sessions 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view training sessions" 
ON public.rl_training_sessions 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update training sessions" 
ON public.rl_training_sessions 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Fix knowledge_chunks table policies (restrict anonymous access)
DROP POLICY IF EXISTS "Authenticated users can create knowledge chunks" ON public.knowledge_chunks;
DROP POLICY IF EXISTS "Knowledge chunks are viewable by everyone" ON public.knowledge_chunks;

CREATE POLICY "Authenticated users can create knowledge chunks" 
ON public.knowledge_chunks 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view active knowledge chunks" 
ON public.knowledge_chunks 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND EXISTS ( 
  SELECT 1 FROM knowledge_documents kd 
  WHERE kd.id = knowledge_chunks.document_id AND kd.is_active = true
));

-- Fix knowledge_documents table policies (restrict anonymous access)
DROP POLICY IF EXISTS "Knowledge documents are viewable by everyone" ON public.knowledge_documents;

CREATE POLICY "Authenticated users can view active knowledge documents" 
ON public.knowledge_documents 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND is_active = true);

-- 2. Fix database functions with mutable search paths
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email)
  );
  RETURN NEW;
END;
$function$;

-- Update search functions to have secure search paths
CREATE OR REPLACE FUNCTION public.search_document_chunks(query_embedding vector, similarity_threshold double precision DEFAULT 0.5, match_count integer DEFAULT 10, user_id uuid DEFAULT NULL::uuid)
RETURNS TABLE(id uuid, document_id uuid, content text, chunk_index integer, similarity double precision, document_title text, document_created_at timestamp with time zone)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT
    dc.id,
    dc.document_id,
    dc.content,
    dc.chunk_index,
    (dc.embedding <=> query_embedding) * -1 + 1 AS similarity,
    d.title AS document_title,
    d.created_at AS document_created_at
  FROM public.document_chunks dc
  JOIN public.documents d ON dc.document_id = d.id
  WHERE 
    (user_id IS NULL OR d.user_id = user_id)
    AND (dc.embedding <=> query_embedding) < (1 - similarity_threshold)
  ORDER BY dc.embedding <=> query_embedding
  LIMIT match_count;
$function$;

CREATE OR REPLACE FUNCTION public.search_knowledge(query_embedding vector, similarity_threshold double precision DEFAULT 0.7, match_count integer DEFAULT 10, filter_category text DEFAULT NULL::text, filter_type text DEFAULT NULL::text)
RETURNS TABLE(id uuid, document_id uuid, title text, content text, document_type text, category text, tags text[], confidence_score double precision, similarity double precision, metadata jsonb)
LANGUAGE sql
STABLE 
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT
    kc.id,
    kc.document_id,
    kd.title,
    kc.content,
    kd.document_type,
    kd.category,
    kd.tags,
    kd.confidence_score,
    1 - (kc.embedding <=> query_embedding) AS similarity,
    kc.metadata
  FROM public.knowledge_chunks kc
  JOIN public.knowledge_documents kd ON kc.document_id = kd.id
  WHERE 
    kd.is_active = true
    AND (filter_category IS NULL OR kd.category = filter_category)
    AND (filter_type IS NULL OR kd.document_type = filter_type)
    AND (kc.embedding <=> query_embedding) < (1 - similarity_threshold)
  ORDER BY kc.embedding <=> query_embedding
  LIMIT match_count;
$function$;

CREATE OR REPLACE FUNCTION public.search_knowledge_documents(query_embedding vector, similarity_threshold double precision DEFAULT 0.7, match_count integer DEFAULT 5)
RETURNS TABLE(id uuid, title text, content text, document_type text, category text, tags text[], similarity double precision, metadata jsonb)
LANGUAGE sql
STABLE 
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT
    kd.id,
    kd.title,
    kd.content,
    kd.document_type,
    kd.category,
    kd.tags,
    1 - (kd.embedding <=> query_embedding) AS similarity,
    kd.metadata
  FROM public.knowledge_documents kd
  WHERE 
    kd.is_active = true
    AND kd.embedding IS NOT NULL
    AND (kd.embedding <=> query_embedding) < (1 - similarity_threshold)
  ORDER BY kd.embedding <=> query_embedding
  LIMIT match_count;
$function$;