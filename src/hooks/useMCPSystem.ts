import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface MCPRequest {
  action: 'store' | 'retrieve' | 'update' | 'delete' | 'consolidate' | 'sync';
  agentId: string;
  memoryType: 'episodic' | 'semantic' | 'working' | 'procedural';
  content?: any;
  metadata?: any;
  queryVector?: number[];
  contextSize?: number;
  filters?: Record<string, any>;
}

interface MCPResponse {
  success: boolean;
  data?: any;
  memories?: any[];
  consolidationResult?: any;
  error?: string;
}

export const useMCPSystem = () => {
  const [isLoading, setIsLoading] = useState(false);

  const callMCPServer = useCallback(async (request: MCPRequest): Promise<MCPResponse> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('mcp-server', {
        body: request
      });

      if (error) {
        console.error('MCP Server error:', error);
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || 'MCP operation failed');
      }

      return data;
    } catch (error: any) {
      console.error('MCP System error:', error);
      toast.error(`MCP Error: ${error.message}`);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const storeMemory = useCallback(async (
    agentId: string,
    memoryType: 'episodic' | 'semantic' | 'working' | 'procedural',
    content: any,
    metadata?: any
  ) => {
    const result = await callMCPServer({
      action: 'store',
      agentId,
      memoryType,
      content,
      metadata
    });

    if (result.success) {
      toast.success('Memory stored successfully');
    }

    return result;
  }, [callMCPServer]);

  const retrieveMemories = useCallback(async (
    agentId: string,
    memoryType?: 'episodic' | 'semantic' | 'working' | 'procedural',
    options?: {
      queryVector?: number[];
      contextSize?: number;
      filters?: Record<string, any>;
    }
  ) => {
    const result = await callMCPServer({
      action: 'retrieve',
      agentId,
      memoryType: memoryType || 'semantic',
      queryVector: options?.queryVector,
      contextSize: options?.contextSize,
      filters: options?.filters
    });

    return result;
  }, [callMCPServer]);

  const updateMemory = useCallback(async (
    memoryId: string,
    agentId: string,
    content?: any,
    metadata?: any
  ) => {
    const result = await callMCPServer({
      action: 'update',
      agentId,
      memoryType: 'semantic',
      content,
      metadata: { ...metadata, id: memoryId }
    });

    if (result.success) {
      toast.success('Memory updated successfully');
    }

    return result;
  }, [callMCPServer]);

  const deleteMemory = useCallback(async (
    memoryId: string,
    agentId: string
  ) => {
    const result = await callMCPServer({
      action: 'delete',
      agentId,
      memoryType: 'semantic',
      metadata: { id: memoryId }
    });

    if (result.success) {
      toast.success('Memory deleted successfully');
    }

    return result;
  }, [callMCPServer]);

  const consolidateMemories = useCallback(async (agentId: string) => {
    const result = await callMCPServer({
      action: 'consolidate',
      agentId,
      memoryType: 'semantic'
    });

    if (result.success) {
      toast.success('Memory consolidation completed');
    }

    return result;
  }, [callMCPServer]);

  const syncMemoryStores = useCallback(async (agentId: string) => {
    const result = await callMCPServer({
      action: 'sync',
      agentId,
      memoryType: 'semantic'
    });

    if (result.success) {
      toast.success('Memory stores synchronized');
    }

    return result;
  }, [callMCPServer]);

  return {
    isLoading,
    storeMemory,
    retrieveMemories,
    updateMemory,
    deleteMemory,
    consolidateMemories,
    syncMemoryStores
  };
};