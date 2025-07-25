import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting configuration
const RATE_LIMIT_MAX_REQUESTS = 50;
const RATE_LIMIT_WINDOW = 60000; // 1 minute

// Simple rate limiting using in-memory store
const rateLimitStore = new Map<string, { count: number; windowStart: number }>();

function checkRateLimit(clientId: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(clientId);
  
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW) {
    rateLimitStore.set(clientId, { count: 1, windowStart: now });
    return true;
  }
  
  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  
  entry.count++;
  return true;
}

// Input validation functions
function validateAction(action: string): boolean {
  return ['query', 'index', 'update', 'delete', 'reindex'].includes(action);
}

function sanitizeInput(input: string): string {
  return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
              .replace(/javascript:/gi, '')
              .replace(/on\w+\s*=/gi, '');
}

interface RAGRequest {
  action: 'query' | 'index' | 'update' | 'delete' | 'reindex';
  query?: string;
  documentId?: string;
  content?: string;
  metadata?: any;
  filters?: Record<string, any>;
  limit?: number;
  threshold?: number;
  includeContext?: boolean;
}

interface RAGResponse {
  success: boolean;
  results?: any[];
  context?: string;
  sources?: any[];
  error?: string;
  indexedDocuments?: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP for rate limiting
    const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    
    // Check rate limit
    if (!checkRateLimit(clientIp)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Rate limit exceeded' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 429 
        }
      );
    }

    // Validate authentication (check for JWT token)
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ success: false, error: 'Authentication required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 401 
        }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const request: RAGRequest = await req.json();
    console.log('RAG System processing request:', request.action);

    // Input validation
    if (!validateAction(request.action)) {
      throw new Error('Invalid action specified');
    }

    // Sanitize string inputs
    if (request.query) {
      request.query = sanitizeInput(request.query);
    }
    if (request.content) {
      request.content = sanitizeInput(request.content);
    }

    // Validate query length
    if (request.query && request.query.length > 10000) {
      throw new Error('Query too long: maximum 10,000 characters');
    }

    // Validate content length
    if (request.content && request.content.length > 1000000) {
      throw new Error('Content too long: maximum 1,000,000 characters');
    }

    // Validate limit
    if (request.limit && (request.limit < 1 || request.limit > 100)) {
      throw new Error('Invalid limit: must be between 1 and 100');
    }

    let result: RAGResponse;

    switch (request.action) {
      case 'query':
        result = await performRAGQuery(supabase, request, req);
        break;
      case 'index':
        result = await indexDocument(supabase, request, req);
        break;
      case 'update':
        result = await updateDocument(supabase, request, req);
        break;
      case 'delete':
        result = await deleteDocument(supabase, request, req);
        break;
      case 'reindex':
        result = await reindexDocuments(supabase, request, req);
        break;
      default:
        throw new Error('Invalid action specified');
    }

    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in RAG system:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    );
  }
});

async function performRAGQuery(supabase: any, request: RAGRequest, req: Request): Promise<RAGResponse> {
  try {
    if (!request.query) {
      throw new Error('Query text is required');
    }

    console.log('Performing RAG query:', request.query.substring(0, 100));

    // Step 1: Generate query embedding
    const queryEmbedding = await generateEmbedding(request.query);
    if (!queryEmbedding) {
      throw new Error('Failed to generate query embedding');
    }

    // Step 2: Perform vector similarity search
    const similarChunks = await vectorSearch(supabase, queryEmbedding, {
      limit: request.limit || 10,
      threshold: request.threshold || 0.7,
      filters: request.filters
    });

    if (similarChunks.length === 0) {
      return {
        success: true,
        results: [],
        context: '',
        sources: []
      };
    }

    // Step 3: Prepare context and sources
    const context = similarChunks
      .map(chunk => chunk.content)
      .join('\n\n');

    const sources = similarChunks.map(chunk => ({
      documentId: chunk.document_id,
      chunkId: chunk.id,
      similarity: chunk.similarity,
      metadata: chunk.metadata,
      content: chunk.content.substring(0, 200) + '...'
    }));

    // Step 4: Generate enhanced response (optional)
    let enhancedResponse = null;
    if (request.includeContext) {
      enhancedResponse = await generateContextualResponse(request.query, context);
    }

    console.log(`RAG query completed. Found ${similarChunks.length} relevant chunks`);

    return {
      success: true,
      results: similarChunks,
      context: context,
      sources: sources,
      ...(enhancedResponse && { enhancedResponse })
    };

  } catch (error) {
    console.error('Error performing RAG query:', error);
    return { success: false, error: error.message };
  }
}

async function indexDocument(supabase: any, request: RAGRequest, req: Request): Promise<RAGResponse> {
  try {
    if (!request.content) {
      throw new Error('Document content is required for indexing');
    }

    console.log('Indexing new document');

    // Get authenticated user from JWT token
    const authHeader = req.headers.get('authorization');
    const jwt = authHeader?.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(jwt);
    
    if (authError || !user) {
      throw new Error('Authentication failed');
    }
    
    const { data: document, error: docError } = await supabase
      .from('documents')
      .insert({
        user_id: user.id, // Use authenticated user ID
        title: request.metadata?.title || 'Untitled Document',
        content: request.content,
        file_type: request.metadata?.file_type || 'text',
        metadata: request.metadata || {}
      })
      .select()
      .single();

    if (docError) throw docError;

    // Step 2: Split content into chunks
    const chunks = splitIntoChunks(request.content, 1000, 100); // 1000 chars with 100 char overlap

    // Step 3: Generate embeddings and store chunks
    let indexedChunks = 0;
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const embedding = await generateEmbedding(chunk);
      
      if (embedding) {
        await supabase
          .from('document_chunks')
          .insert({
            document_id: document.id,
            content: chunk,
            embedding: embedding,
            chunk_index: i,
            metadata: {
              ...request.metadata,
              chunk_size: chunk.length,
              embedding_model: 'text-embedding-3-small'
            }
          });
        
        indexedChunks++;
      }
    }

    console.log(`Document indexed successfully. ${indexedChunks} chunks created`);

    return {
      success: true,
      indexedDocuments: 1,
      results: [{ documentId: document.id, chunksCreated: indexedChunks }]
    };

  } catch (error) {
    console.error('Error indexing document:', error);
    return { success: false, error: error.message };
  }
}

async function updateDocument(supabase: any, request: RAGRequest, req: Request): Promise<RAGResponse> {
  try {
    if (!request.documentId) {
      throw new Error('Document ID is required for update');
    }

    console.log('Updating document:', request.documentId);

    // Update document
    const updates: any = {};
    if (request.content) updates.content = request.content;
    if (request.metadata) updates.metadata = request.metadata;
    updates.updated_at = new Date().toISOString();

    const { error: updateError } = await supabase
      .from('documents')
      .update(updates)
      .eq('id', request.documentId);

    if (updateError) throw updateError;

    // If content was updated, reprocess chunks
    if (request.content) {
      // Delete existing chunks
      await supabase
        .from('document_chunks')
        .delete()
        .eq('document_id', request.documentId);

      // Create new chunks
      const chunks = splitIntoChunks(request.content, 1000, 100);
      let indexedChunks = 0;

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const embedding = await generateEmbedding(chunk);
        
        if (embedding) {
          await supabase
            .from('document_chunks')
            .insert({
              document_id: request.documentId,
              content: chunk,
              embedding: embedding,
              chunk_index: i,
              metadata: {
                ...request.metadata,
                chunk_size: chunk.length,
                embedding_model: 'text-embedding-3-small'
              }
            });
          
          indexedChunks++;
        }
      }

      console.log(`Document updated. ${indexedChunks} chunks recreated`);
    }

    return { success: true };

  } catch (error) {
    console.error('Error updating document:', error);
    return { success: false, error: error.message };
  }
}

async function deleteDocument(supabase: any, request: RAGRequest, req: Request): Promise<RAGResponse> {
  try {
    if (!request.documentId) {
      throw new Error('Document ID is required for deletion');
    }

    console.log('Deleting document:', request.documentId);

    // Delete chunks first
    await supabase
      .from('document_chunks')
      .delete()
      .eq('document_id', request.documentId);

    // Delete document
    await supabase
      .from('documents')
      .delete()
      .eq('id', request.documentId);

    console.log('Document deleted successfully');
    return { success: true };

  } catch (error) {
    console.error('Error deleting document:', error);
    return { success: false, error: error.message };
  }
}

async function reindexDocuments(supabase: any, request: RAGRequest, req: Request): Promise<RAGResponse> {
  try {
    console.log('Reindexing all documents');

    // Get all documents
    const { data: documents, error } = await supabase
      .from('documents')
      .select('id, content, metadata');

    if (error) throw error;

    let indexedDocuments = 0;

    for (const doc of documents) {
      if (!doc.content) continue;

      // Delete existing chunks
      await supabase
        .from('document_chunks')
        .delete()
        .eq('document_id', doc.id);

      // Create new chunks
      const chunks = splitIntoChunks(doc.content, 1000, 100);

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const embedding = await generateEmbedding(chunk);
        
        if (embedding) {
          await supabase
            .from('document_chunks')
            .insert({
              document_id: doc.id,
              content: chunk,
              embedding: embedding,
              chunk_index: i,
              metadata: {
                ...doc.metadata,
                chunk_size: chunk.length,
                embedding_model: 'text-embedding-3-small',
                reindexed_at: new Date().toISOString()
              }
            });
        }
      }

      indexedDocuments++;
    }

    console.log(`Reindexing completed. ${indexedDocuments} documents processed`);

    return {
      success: true,
      indexedDocuments
    };

  } catch (error) {
    console.error('Error reindexing documents:', error);
    return { success: false, error: error.message };
  }
}

async function vectorSearch(supabase: any, queryEmbedding: number[], options: any): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .rpc('search_document_chunks', {
        query_embedding: queryEmbedding,
        similarity_threshold: options.threshold,
        match_count: options.limit
      });

    if (error) {
      console.error('Vector search error:', error);
      return [];
    }

    return data || [];

  } catch (error) {
    console.error('Error performing vector search:', error);
    return [];
  }
}

async function generateEmbedding(text: string): Promise<number[] | null> {
  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.warn('OpenAI API key not found, skipping embedding generation');
      return null;
    }

    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: text.substring(0, 8000),
      }),
    });

    if (!response.ok) {
      console.error('OpenAI embedding API error:', response.status);
      return null;
    }

    const data = await response.json();
    return data.data[0].embedding;

  } catch (error) {
    console.error('Error generating embedding:', error);
    return null;
  }
}

async function generateContextualResponse(query: string, context: string): Promise<string | null> {
  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      return null;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that answers questions based on the provided context. Be accurate and cite relevant parts of the context.'
          },
          {
            role: 'user',
            content: `Context:\n${context}\n\nQuestion: ${query}\n\nPlease provide a comprehensive answer based on the context.`
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error:', response.status);
      return null;
    }

    const data = await response.json();
    return data.choices[0].message.content;

  } catch (error) {
    console.error('Error generating contextual response:', error);
    return null;
  }
}

function splitIntoChunks(text: string, chunkSize: number = 1000, overlap: number = 100): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.slice(start, end));
    
    if (end === text.length) break;
    start = end - overlap;
  }

  return chunks;
}