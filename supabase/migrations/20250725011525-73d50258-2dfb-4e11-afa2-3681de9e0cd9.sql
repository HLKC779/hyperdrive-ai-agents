-- Security Fix Migration Phase 2: Fix remaining anonymous access policies

-- Fix chat_sessions table policy to prevent anonymous access
DROP POLICY IF EXISTS "Users can manage their own chat sessions" ON public.chat_sessions;

CREATE POLICY "Authenticated users can manage their own chat sessions" 
ON public.chat_sessions 
FOR ALL 
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id)
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Fix document_chunks table policies to prevent anonymous access
DROP POLICY IF EXISTS "Users can create their own document chunks" ON public.document_chunks;
DROP POLICY IF EXISTS "Users can delete their own document chunks" ON public.document_chunks;
DROP POLICY IF EXISTS "Users can update their own document chunks" ON public.document_chunks;
DROP POLICY IF EXISTS "Users can view their own document chunks" ON public.document_chunks;

CREATE POLICY "Authenticated users can create their own document chunks" 
ON public.document_chunks 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND EXISTS ( 
  SELECT 1 FROM public.documents 
  WHERE documents.id = document_chunks.document_id AND documents.user_id = auth.uid()
));

CREATE POLICY "Authenticated users can delete their own document chunks" 
ON public.document_chunks 
FOR DELETE 
USING (auth.uid() IS NOT NULL AND EXISTS ( 
  SELECT 1 FROM public.documents 
  WHERE documents.id = document_chunks.document_id AND documents.user_id = auth.uid()
));

CREATE POLICY "Authenticated users can update their own document chunks" 
ON public.document_chunks 
FOR UPDATE 
USING (auth.uid() IS NOT NULL AND EXISTS ( 
  SELECT 1 FROM public.documents 
  WHERE documents.id = document_chunks.document_id AND documents.user_id = auth.uid()
));

CREATE POLICY "Authenticated users can view their own document chunks" 
ON public.document_chunks 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND EXISTS ( 
  SELECT 1 FROM public.documents 
  WHERE documents.id = document_chunks.document_id AND documents.user_id = auth.uid()
));

-- Fix documents table policies to prevent anonymous access
DROP POLICY IF EXISTS "Users can create their own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can delete their own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can update their own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can view their own documents" ON public.documents;

CREATE POLICY "Authenticated users can create their own documents" 
ON public.documents 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Authenticated users can delete their own documents" 
ON public.documents 
FOR DELETE 
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Authenticated users can update their own documents" 
ON public.documents 
FOR UPDATE 
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Authenticated users can view their own documents" 
ON public.documents 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Fix profiles table policies to restrict anonymous access
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Authenticated users can view profiles" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Authenticated users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Fix knowledge_chunks policies - these should be completely authenticated
DROP POLICY IF EXISTS "Authenticated users can delete knowledge chunks for their docum" ON public.knowledge_chunks;
DROP POLICY IF EXISTS "Authenticated users can update knowledge chunks for their docum" ON public.knowledge_chunks;

CREATE POLICY "Authenticated users can delete knowledge chunks for their documents" 
ON public.knowledge_chunks 
FOR DELETE 
USING (auth.uid() IS NOT NULL AND EXISTS ( 
  SELECT 1 FROM public.knowledge_documents kd 
  WHERE kd.id = knowledge_chunks.document_id AND kd.created_by = auth.uid()
));

CREATE POLICY "Authenticated users can update knowledge chunks for their documents" 
ON public.knowledge_chunks 
FOR UPDATE 
USING (auth.uid() IS NOT NULL AND EXISTS ( 
  SELECT 1 FROM public.knowledge_documents kd 
  WHERE kd.id = knowledge_chunks.document_id AND kd.created_by = auth.uid()
));

-- Fix knowledge_documents policies
DROP POLICY IF EXISTS "Authenticated users can delete their own knowledge documents" ON public.knowledge_documents;
DROP POLICY IF EXISTS "Authenticated users can update their own knowledge documents" ON public.knowledge_documents;

CREATE POLICY "Authenticated users can delete their own knowledge documents" 
ON public.knowledge_documents 
FOR DELETE 
USING (auth.uid() IS NOT NULL AND auth.uid() = created_by);

CREATE POLICY "Authenticated users can update their own knowledge documents" 
ON public.knowledge_documents 
FOR UPDATE 
USING (auth.uid() IS NOT NULL AND auth.uid() = created_by);