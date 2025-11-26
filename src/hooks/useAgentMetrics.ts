import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Agent {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'idle' | 'busy' | 'error';
  performance: number;
  tasksCompleted: number;
  avgResponseTime: number;
  memoryUsage: number;
}

export const useAgentMetrics = () => {
  const reportMetrics = useCallback(async (agent: Agent) => {
    try {
      const { error } = await supabase
        .from('agent_metrics')
        .insert({
          agent_id: agent.id,
          agent_name: agent.name,
          status: agent.status,
          performance: agent.performance,
          tasks_completed: agent.tasksCompleted,
          avg_response_time: agent.avgResponseTime,
          memory_usage: agent.memoryUsage,
          cpu_usage: Math.random() * 100,
          error_count: agent.status === 'error' ? Math.floor(Math.random() * 10) : 0,
          last_activity: new Date().toISOString()
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error reporting metrics:', error);
      return false;
    }
  }, []);

  const simulateMetrics = useCallback(async (agents: Agent[]) => {
    // Simulate real-time metrics for demo purposes
    for (const agent of agents) {
      // Add some variation to the metrics
      const updatedAgent = {
        ...agent,
        performance: Math.max(60, Math.min(100, agent.performance + (Math.random() - 0.5) * 10)),
        tasksCompleted: agent.tasksCompleted + Math.floor(Math.random() * 3),
        avgResponseTime: Math.max(0.5, agent.avgResponseTime + (Math.random() - 0.5) * 0.5),
        memoryUsage: Math.max(20, Math.min(95, agent.memoryUsage + (Math.random() - 0.5) * 10))
      };

      await reportMetrics(updatedAgent);
      
      // Small delay between reports
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    toast.success('Metrics simulated successfully');
  }, [reportMetrics]);

  return {
    reportMetrics,
    simulateMetrics
  };
};
