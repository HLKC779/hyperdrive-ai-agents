import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting configuration
const RATE_LIMIT_MAX_REQUESTS = 100;
const RATE_LIMIT_WINDOW = 60000; // 1 minute

interface MemoryRequest {
  action: 'store' | 'retrieve' | 'update' | 'delete' | 'consolidate' | 'sync';
  agentId: string;
  memoryType?: 'episodic' | 'semantic' | 'working' | 'procedural';
  content?: any;
  metadata?: any;
  queryVector?: number[];
  contextSize?: number;
  filters?: Record<string, any>;
}

interface MemoryResponse {
  success: boolean;
  data?: any;
  memories?: any[];
  consolidationResult?: any;
  error?: string;
}

// Input validation functions
function validateAgentId(agentId: string): boolean {
  return typeof agentId === 'string' && 
         agentId.length > 0 && 
         agentId.length <= 100 &&
         /^[a-zA-Z0-9_-]+$/.test(agentId);
}

function validateMemoryType(memoryType?: string): boolean {
  if (!memoryType) return true;
  return ['episodic', 'semantic', 'working', 'procedural'].includes(memoryType);
}

function validateAction(action: string): boolean {
  return ['store', 'retrieve', 'update', 'delete', 'consolidate', 'sync'].includes(action);
}

function sanitizeContent(content: any): any {
  if (typeof content === 'string') {
    // Basic XSS prevention - remove potentially dangerous content
    return content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                 .replace(/javascript:/gi, '')
                 .replace(/on\w+\s*=/gi, '');
  }
  return content;
}

// Simple rate limiting using in-memory store (for production, use Redis)
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

    const request: MemoryRequest = await req.json();
    console.log('MCP Server processing request:', request.action);

    // Input validation
    if (!validateAction(request.action)) {
      throw new Error('Invalid action specified');
    }

    if (!validateAgentId(request.agentId)) {
      throw new Error('Invalid agentId: must be alphanumeric with dashes/underscores, 1-100 chars');
    }

    if (!validateMemoryType(request.memoryType)) {
      throw new Error('Invalid memoryType: must be episodic, semantic, working, or procedural');
    }

    // Sanitize content to prevent XSS
    if (request.content) {
      request.content = sanitizeContent(request.content);
    }

    // Validate context size
    if (request.contextSize && (request.contextSize < 1 || request.contextSize > 100)) {
      throw new Error('Invalid contextSize: must be between 1 and 100');
    }

    let result: MemoryResponse;

    switch (request.action) {
      case 'store':
        result = await storeMemory(supabase, request, req);
        break;
      case 'retrieve':
        result = await retrieveMemories(supabase, request, req);
        break;
      case 'update':
        result = await updateMemory(supabase, request, req);
        break;
      case 'delete':
        result = await deleteMemory(supabase, request, req);
        break;
      case 'consolidate':
        result = await consolidateMemories(supabase, request, req);
        break;
      case 'sync':
        result = await syncMemoryStores(supabase, request, req);
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
    console.error('Error in MCP server:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    );
  }
});

async function storeMemory(supabase: any, request: MemoryRequest, req: Request): Promise<MemoryResponse> {
  try {
    // Generate embedding if content provided
    let embedding = null;
    if (request.content && typeof request.content === 'string') {
      embedding = await generateEmbedding(request.content);
    }

    // Store in appropriate memory store based on type
    const memoryData = {
      agent_id: request.agentId,
      memory_type: request.memoryType,
      content: request.content,
      metadata: {
        ...request.metadata,
        timestamp: new Date().toISOString(),
        access_count: 0,
        last_accessed: new Date().toISOString()
      },
      embedding: embedding,
      created_at: new Date().toISOString()
    };

    // Get authenticated user from JWT token
    const authHeader = req.headers.get('authorization');
    const jwt = authHeader?.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(jwt);
    
    if (authError || !user) {
      throw new Error('Authentication failed');
    }
    
    const { data, error } = await supabase
      .from('documents')
      .insert({
        user_id: user.id, // Use authenticated user ID
        title: `${request.memoryType}-memory-${Date.now()}`,
        content: JSON.stringify(request.content),
        file_type: 'memory',
        metadata: memoryData.metadata
      })
      .select()
      .single();

    if (error) throw error;

    // Also store chunks for vector search
    if (embedding) {
      await supabase
        .from('document_chunks')
        .insert({
          document_id: data.id,
          content: typeof request.content === 'string' ? request.content : JSON.stringify(request.content),
          embedding: embedding,
          chunk_index: 0,
          metadata: { memory_type: request.memoryType, agent_id: request.agentId }
        });
    }

    console.log('Memory stored successfully:', data.id);
    return { success: true, data: { id: data.id, ...memoryData } };

  } catch (error) {
    console.error('Error storing memory:', error);
    return { success: false, error: error.message };
  }
}

async function retrieveMemories(supabase: any, request: MemoryRequest, req: Request): Promise<MemoryResponse> {
  try {
    let query = supabase
      .from('documents')
      .select('*, document_chunks(*)')
      .eq('file_type', 'memory');

    // Filter by agent if specified
    if (request.agentId) {
      query = query.contains('metadata', { agent_id: request.agentId });
    }

    // Filter by memory type if specified
    if (request.memoryType) {
      query = query.contains('metadata', { memory_type: request.memoryType });
    }

    // Limit results
    query = query.limit(request.contextSize || 10);

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    // If vector search is requested
    if (request.queryVector && request.queryVector.length > 0) {
      // Perform vector similarity search on chunks
      const vectorResult = await performVectorSearch(supabase, request.queryVector, request.contextSize || 10);
      return { success: true, memories: vectorResult };
    }

    const memories = data.map(doc => ({
      id: doc.id,
      agentId: doc.metadata?.agent_id,
      memoryType: doc.metadata?.memory_type,
      content: JSON.parse(doc.content || '{}'),
      metadata: doc.metadata,
      createdAt: doc.created_at,
      chunks: doc.document_chunks
    }));

    console.log(`Retrieved ${memories.length} memories`);
    return { success: true, memories };

  } catch (error) {
    console.error('Error retrieving memories:', error);
    return { success: false, error: error.message };
  }
}

async function updateMemory(supabase: any, request: MemoryRequest, req: Request): Promise<MemoryResponse> {
  try {
    if (!request.metadata?.id) {
      throw new Error('Memory ID required for update');
    }

    const updates: any = {};
    if (request.content) {
      updates.content = JSON.stringify(request.content);
    }
    if (request.metadata) {
      updates.metadata = {
        ...request.metadata,
        last_updated: new Date().toISOString(),
        access_count: (request.metadata.access_count || 0) + 1
      };
    }

    const { data, error } = await supabase
      .from('documents')
      .update(updates)
      .eq('id', request.metadata.id)
      .select()
      .single();

    if (error) throw error;

    console.log('Memory updated successfully:', data.id);
    return { success: true, data };

  } catch (error) {
    console.error('Error updating memory:', error);
    return { success: false, error: error.message };
  }
}

async function deleteMemory(supabase: any, request: MemoryRequest, req: Request): Promise<MemoryResponse> {
  try {
    if (!request.metadata?.id) {
      throw new Error('Memory ID required for deletion');
    }

    // Delete chunks first
    await supabase
      .from('document_chunks')
      .delete()
      .eq('document_id', request.metadata.id);

    // Delete memory document
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', request.metadata.id);

    if (error) throw error;

    console.log('Memory deleted successfully:', request.metadata.id);
    return { success: true };

  } catch (error) {
    console.error('Error deleting memory:', error);
    return { success: false, error: error.message };
  }
}

async function consolidateMemories(supabase: any, request: MemoryRequest, req: Request): Promise<MemoryResponse> {
  try {
    console.log('Starting memory consolidation for agent:', request.agentId);
    
    // Get all memories for the agent
    const { data: memories, error } = await supabase
      .from('documents')
      .select('*, document_chunks(*)')
      .eq('file_type', 'memory')
      .contains('metadata', { agent_id: request.agentId });

    if (error) throw error;

    // Simple consolidation: merge similar content
    const consolidationResults = {
      processed: memories.length,
      duplicatesRemoved: 0,
      similarMerged: 0,
      archived: 0
    };

    // Find and remove exact duplicates
    const contentMap = new Map();
    const toDelete = [];

    for (const memory of memories) {
      const contentHash = JSON.stringify(memory.content);
      if (contentMap.has(contentHash)) {
        toDelete.push(memory.id);
        consolidationResults.duplicatesRemoved++;
      } else {
        contentMap.set(contentHash, memory);
      }
    }

    // Delete duplicates
    if (toDelete.length > 0) {
      await supabase
        .from('documents')
        .delete()
        .in('id', toDelete);
    }

    // Archive old memories (older than 30 days with low access count)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: oldMemories } = await supabase
      .from('documents')
      .select('id')
      .eq('file_type', 'memory')
      .contains('metadata', { agent_id: request.agentId })
      .lt('created_at', thirtyDaysAgo.toISOString())
      .contains('metadata', { access_count: 0 });

    if (oldMemories && oldMemories.length > 0) {
      await supabase
        .from('documents')
        .update({ 
          metadata: { archived: true, archived_at: new Date().toISOString() }
        })
        .in('id', oldMemories.map(m => m.id));
      
      consolidationResults.archived = oldMemories.length;
    }

    console.log('Memory consolidation completed:', consolidationResults);
    return { success: true, consolidationResult: consolidationResults };

  } catch (error) {
    console.error('Error consolidating memories:', error);
    return { success: false, error: error.message };
  }
}

async function syncMemoryStores(supabase: any, request: MemoryRequest, req: Request): Promise<MemoryResponse> {
  try {
    console.log('Syncing memory stores for agent:', request.agentId);
    
    // Simulate sync process - in a real implementation, this would sync between
    // different memory stores (Redis, PostgreSQL, Neo4j, Vector DB)
    
    const syncResults = {
      redisSync: true,
      postgresSync: true,
      neo4jSync: true,
      vectorDbSync: true,
      lastSyncTime: new Date().toISOString()
    };

    // Update sync metadata for agent memories
    await supabase
      .from('documents')
      .update({ 
        metadata: { last_sync: new Date().toISOString() }
      })
      .eq('file_type', 'memory')
      .contains('metadata', { agent_id: request.agentId });

    console.log('Memory sync completed:', syncResults);
    return { success: true, data: syncResults };

  } catch (error) {
    console.error('Error syncing memory stores:', error);
    return { success: false, error: error.message };
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
        input: text.substring(0, 8000), // Limit input length
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

async function performVectorSearch(supabase: any, queryVector: number[], limit: number = 10): Promise<any[]> {
  try {
    // Use pgvector similarity search
    const { data, error } = await supabase
      .rpc('search_document_chunks', {
        query_embedding: queryVector,
        similarity_threshold: 0.7,
        match_count: limit
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