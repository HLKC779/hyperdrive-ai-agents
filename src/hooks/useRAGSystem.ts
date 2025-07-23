import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
  enhancedResponse?: string;
}

export const useRAGSystem = () => {
  const [isLoading, setIsLoading] = useState(false);

  const callRAGSystem = useCallback(async (request: RAGRequest): Promise<RAGResponse> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('rag-system', {
        body: request
      });

      if (error) {
        console.error('RAG System error:', error);
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || 'RAG operation failed');
      }

      return data;
    } catch (error: any) {
      console.error('RAG System error:', error);
      toast.error(`RAG Error: ${error.message}`);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const performQuery = useCallback(async (
    query: string,
    options?: {
      limit?: number;
      threshold?: number;
      filters?: Record<string, any>;
      includeContext?: boolean;
    }
  ) => {
    if (!query.trim()) {
      toast.error('Query cannot be empty');
      return { success: false, error: 'Query cannot be empty' };
    }

    const result = await callRAGSystem({
      action: 'query',
      query: query.trim(),
      limit: options?.limit || 10,
      threshold: options?.threshold || 0.7,
      filters: options?.filters,
      includeContext: options?.includeContext || false
    });

    if (result.success && result.results) {
      toast.success(`Found ${result.results.length} relevant results`);
    }

    return result;
  }, [callRAGSystem]);

  const indexDocument = useCallback(async (
    content: string,
    metadata?: {
      title?: string;
      file_type?: string;
      [key: string]: any;
    }
  ) => {
    if (!content.trim()) {
      toast.error('Document content cannot be empty');
      return { success: false, error: 'Document content cannot be empty' };
    }

    const result = await callRAGSystem({
      action: 'index',
      content: content.trim(),
      metadata: {
        title: metadata?.title || 'Untitled Document',
        file_type: metadata?.file_type || 'text',
        ...metadata,
        indexed_at: new Date().toISOString()
      }
    });

    if (result.success) {
      toast.success('Document indexed successfully');
    }

    return result;
  }, [callRAGSystem]);

  const updateDocument = useCallback(async (
    documentId: string,
    content?: string,
    metadata?: any
  ) => {
    if (!documentId) {
      toast.error('Document ID is required');
      return { success: false, error: 'Document ID is required' };
    }

    const result = await callRAGSystem({
      action: 'update',
      documentId,
      content: content?.trim(),
      metadata: {
        ...metadata,
        updated_at: new Date().toISOString()
      }
    });

    if (result.success) {
      toast.success('Document updated successfully');
    }

    return result;
  }, [callRAGSystem]);

  const deleteDocument = useCallback(async (documentId: string) => {
    if (!documentId) {
      toast.error('Document ID is required');
      return { success: false, error: 'Document ID is required' };
    }

    const result = await callRAGSystem({
      action: 'delete',
      documentId
    });

    if (result.success) {
      toast.success('Document deleted successfully');
    }

    return result;
  }, [callRAGSystem]);

  const reindexAllDocuments = useCallback(async () => {
    const result = await callRAGSystem({
      action: 'reindex'
    });

    if (result.success) {
      toast.success(`Reindexed ${result.indexedDocuments || 0} documents`);
    }

    return result;
  }, [callRAGSystem]);

  const searchSimilarContent = useCallback(async (
    query: string,
    options?: {
      limit?: number;
      threshold?: number;
      includeEnhancedResponse?: boolean;
    }
  ) => {
    return await performQuery(query, {
      limit: options?.limit || 5,
      threshold: options?.threshold || 0.8,
      includeContext: options?.includeEnhancedResponse || true
    });
  }, [performQuery]);

  return {
    isLoading,
    performQuery,
    indexDocument,
    updateDocument,
    deleteDocument,
    reindexAllDocuments,
    searchSimilarContent
  };
};