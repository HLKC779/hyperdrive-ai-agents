import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface RLFeedback {
  id: string;
  sessionId: string;
  agentId: string;
  userId?: string;
  feedbackType: 'user_rating' | 'task_completion' | 'system_metric' | 'user_interaction' | 'error_report';
  feedbackValue: any;
  context: any;
  timestamp: string;
  processed: boolean;
}

export interface RLMetric {
  id: string;
  agentId: string;
  sessionId?: string;
  metricType: 'reward' | 'accuracy' | 'efficiency' | 'convergence' | 'exploration_rate' | 'episode_completion';
  metricValue: number;
  metadata: any;
  timestamp: string;
}

export interface RLTrainingSession {
  id: string;
  sessionName: string;
  agentIds: string[];
  environmentId: string;
  status: 'active' | 'paused' | 'completed' | 'failed';
  startTime: string;
  endTime?: string;
  totalEpisodes: number;
  totalRewards: number;
  convergenceAchieved: boolean;
  configuration: any;
}

export interface RLSystemInteraction {
  id: string;
  userId?: string;
  sessionId?: string;
  interactionType: 'button_click' | 'input_submission' | 'navigation' | 'error_encounter' | 'task_completion' | 'preference_change';
  targetElement?: string;
  interactionData: any;
  systemState?: any;
  outcome?: any;
  timestamp: string;
}

export const useRLSystem = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Collect user feedback
  const collectFeedback = useCallback(async (feedback: Omit<RLFeedback, 'id' | 'timestamp' | 'processed'>) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('rl_feedback' as any)
        .insert({
          session_id: feedback.sessionId,
          agent_id: feedback.agentId,
          user_id: feedback.userId,
          feedback_type: feedback.feedbackType,
          feedback_value: feedback.feedbackValue,
          context: feedback.context
        });

      if (error) throw error;
      toast.success('Feedback collected successfully');
      return true;
    } catch (error) {
      console.error('Error collecting feedback:', error);
      toast.error('Failed to collect feedback');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Record system interaction
  const recordInteraction = useCallback(async (interaction: Omit<RLSystemInteraction, 'id' | 'timestamp'>) => {
    try {
      const { error } = await supabase
        .from('rl_system_interactions' as any)
        .insert({
          user_id: interaction.userId,
          session_id: interaction.sessionId,
          interaction_type: interaction.interactionType,
          target_element: interaction.targetElement,
          interaction_data: interaction.interactionData,
          system_state: interaction.systemState,
          outcome: interaction.outcome
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error recording interaction:', error);
      return false;
    }
  }, []);

  // Record agent metric
  const recordMetric = useCallback(async (metric: Omit<RLMetric, 'id' | 'timestamp'>) => {
    try {
      const { error } = await supabase
        .from('rl_agent_metrics' as any)
        .insert({
          agent_id: metric.agentId,
          session_id: metric.sessionId,
          metric_type: metric.metricType,
          metric_value: metric.metricValue,
          metadata: metric.metadata
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error recording metric:', error);
      return false;
    }
  }, []);

  // Start training session
  const startTrainingSession = useCallback(async (session: Omit<RLTrainingSession, 'id' | 'startTime' | 'totalEpisodes' | 'totalRewards' | 'convergenceAchieved'>) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('rl_training_sessions' as any)
        .insert({
          session_name: session.sessionName,
          agent_ids: session.agentIds,
          environment_id: session.environmentId,
          status: session.status,
          configuration: session.configuration
        })
        .select()
        .single();

      if (error) throw error;
      toast.success('Training session started');
      return data;
    } catch (error) {
      console.error('Error starting training session:', error);
      toast.error('Failed to start training session');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update training session
  const updateTrainingSession = useCallback(async (sessionId: string, updates: Partial<RLTrainingSession>) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('rl_training_sessions' as any)
        .update(updates)
        .eq('id', sessionId);

      if (error) throw error;
      toast.success('Training session updated');
      return true;
    } catch (error) {
      console.error('Error updating training session:', error);
      toast.error('Failed to update training session');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get feedback data
  const getFeedback = useCallback(async (agentId?: string, limit = 100) => {
    try {
      let query = supabase
        .from('rl_feedback' as any)
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (agentId) {
        query = query.eq('agent_id', agentId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching feedback:', error);
      return [];
    }
  }, []);

  // Get agent metrics
  const getMetrics = useCallback(async (agentId?: string, limit = 100) => {
    try {
      let query = supabase
        .from('rl_agent_metrics' as any)
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (agentId) {
        query = query.eq('agent_id', agentId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching metrics:', error);
      return [];
    }
  }, []);

  // Get training sessions
  const getTrainingSessions = useCallback(async (status?: string) => {
    try {
      let query = supabase
        .from('rl_training_sessions' as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching training sessions:', error);
      return [];
    }
  }, []);

  // Get system interactions
  const getInteractions = useCallback(async (userId?: string, limit = 100) => {
    try {
      let query = supabase
        .from('rl_system_interactions' as any)
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching interactions:', error);
      return [];
    }
  }, []);

  return {
    isLoading,
    collectFeedback,
    recordInteraction,
    recordMetric,
    startTrainingSession,
    updateTrainingSession,
    getFeedback,
    getMetrics,
    getTrainingSessions,
    getInteractions
  };
};