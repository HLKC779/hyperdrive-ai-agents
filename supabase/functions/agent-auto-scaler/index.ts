import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ScalingConfig {
  minInstances: number;
  maxInstances: number;
  cpuThresholdUp: number;
  cpuThresholdDown: number;
  memoryThresholdUp: number;
  memoryThresholdDown: number;
  performanceThresholdUp: number;
  performanceThresholdDown: number;
  cooldownPeriod: number; // seconds
}

interface ScalingDecision {
  agentId: string;
  agentName: string;
  action: 'scale_up' | 'scale_down' | 'no_change';
  reason: string;
  currentInstances: number;
  recommendedInstances: number;
  metrics: {
    avgPerformance: number;
    avgMemory: number;
    avgCpu: number;
    errorRate: number;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { action, config, agentId } = await req.json();
    console.log(`Auto-scaler action: ${action}`);

    if (action === 'analyze') {
      // Get recent metrics for all agents
      const { data: metrics, error: metricsError } = await supabase
        .from('agent_metrics')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (metricsError) throw metricsError;

      // Default scaling config
      const scalingConfig: ScalingConfig = config || {
        minInstances: 1,
        maxInstances: 10,
        cpuThresholdUp: 80,
        cpuThresholdDown: 30,
        memoryThresholdUp: 85,
        memoryThresholdDown: 40,
        performanceThresholdUp: 60,
        performanceThresholdDown: 95,
        cooldownPeriod: 60
      };

      // Group metrics by agent
      const agentMetrics = new Map<string, typeof metrics>();
      for (const metric of metrics || []) {
        const existing = agentMetrics.get(metric.agent_id) || [];
        existing.push(metric);
        agentMetrics.set(metric.agent_id, existing);
      }

      const decisions: ScalingDecision[] = [];

      // Analyze each agent
      for (const [agentIdKey, agentData] of agentMetrics) {
        if (agentData.length === 0) continue;

        // Calculate averages
        const avgPerformance = agentData.reduce((acc, m) => acc + Number(m.performance), 0) / agentData.length;
        const avgMemory = agentData.reduce((acc, m) => acc + Number(m.memory_usage), 0) / agentData.length;
        const avgCpu = agentData.reduce((acc, m) => acc + Number(m.cpu_usage || 0), 0) / agentData.length;
        const errorRate = agentData.reduce((acc, m) => acc + Number(m.error_count), 0) / agentData.length;

        const latestMetric = agentData[0];
        let action: ScalingDecision['action'] = 'no_change';
        let reason = '';
        let recommendedInstances = 1; // Base instance count

        // Determine if scaling is needed
        if (avgPerformance < scalingConfig.performanceThresholdUp || avgMemory > scalingConfig.memoryThresholdUp || avgCpu > scalingConfig.cpuThresholdUp) {
          action = 'scale_up';
          
          if (avgPerformance < scalingConfig.performanceThresholdUp) {
            reason = `Low performance (${avgPerformance.toFixed(1)}% < ${scalingConfig.performanceThresholdUp}%)`;
            recommendedInstances = Math.min(scalingConfig.maxInstances, Math.ceil((scalingConfig.performanceThresholdUp - avgPerformance) / 10) + 1);
          } else if (avgMemory > scalingConfig.memoryThresholdUp) {
            reason = `High memory usage (${avgMemory.toFixed(1)}% > ${scalingConfig.memoryThresholdUp}%)`;
            recommendedInstances = Math.min(scalingConfig.maxInstances, Math.ceil((avgMemory - scalingConfig.memoryThresholdUp) / 15) + 1);
          } else if (avgCpu > scalingConfig.cpuThresholdUp) {
            reason = `High CPU usage (${avgCpu.toFixed(1)}% > ${scalingConfig.cpuThresholdUp}%)`;
            recommendedInstances = Math.min(scalingConfig.maxInstances, Math.ceil((avgCpu - scalingConfig.cpuThresholdUp) / 15) + 1);
          }
        } else if (avgPerformance > scalingConfig.performanceThresholdDown && avgMemory < scalingConfig.memoryThresholdDown && avgCpu < scalingConfig.cpuThresholdDown) {
          action = 'scale_down';
          reason = `Resources underutilized (Performance: ${avgPerformance.toFixed(1)}%, Memory: ${avgMemory.toFixed(1)}%, CPU: ${avgCpu.toFixed(1)}%)`;
          recommendedInstances = Math.max(scalingConfig.minInstances, 1);
        } else {
          reason = 'Metrics within optimal range';
        }

        // High error rate always triggers scale up
        if (errorRate > 3) {
          action = 'scale_up';
          reason = `High error rate (${errorRate.toFixed(1)} errors/interval)`;
          recommendedInstances = Math.min(scalingConfig.maxInstances, 3);
        }

        decisions.push({
          agentId: agentIdKey,
          agentName: latestMetric.agent_name,
          action,
          reason,
          currentInstances: 1,
          recommendedInstances,
          metrics: {
            avgPerformance: Math.round(avgPerformance * 10) / 10,
            avgMemory: Math.round(avgMemory * 10) / 10,
            avgCpu: Math.round(avgCpu * 10) / 10,
            errorRate: Math.round(errorRate * 10) / 10
          }
        });
      }

      console.log(`Analyzed ${decisions.length} agents, ${decisions.filter(d => d.action !== 'no_change').length} require scaling`);

      return new Response(JSON.stringify({ 
        success: true, 
        decisions,
        summary: {
          totalAgents: decisions.length,
          scaleUpCount: decisions.filter(d => d.action === 'scale_up').length,
          scaleDownCount: decisions.filter(d => d.action === 'scale_down').length,
          noChangeCount: decisions.filter(d => d.action === 'no_change').length
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'execute') {
      // Execute scaling decision for a specific agent
      const { data: latestMetric, error: metricError } = await supabase
        .from('agent_metrics')
        .select('*')
        .eq('agent_id', agentId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (metricError) throw metricError;

      // Log the scaling event as an alert
      await supabase.from('agent_alerts').insert({
        agent_id: agentId,
        agent_name: latestMetric.agent_name,
        alert_type: 'scaling',
        severity: 'low',
        message: `Auto-scaling executed for ${latestMetric.agent_name}`,
        resolved: true,
        resolved_at: new Date().toISOString()
      });

      return new Response(JSON.stringify({ 
        success: true,
        message: `Scaling executed for agent ${agentId}`
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ 
      error: 'Invalid action. Use "analyze" or "execute"' 
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Auto-scaler error:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
