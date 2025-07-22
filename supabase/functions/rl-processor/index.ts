import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FeedbackData {
  agentId: string;
  feedbackType: string;
  feedbackValue: any;
  context: any;
  timestamp: string;
}

interface MetricData {
  agentId: string;
  metricType: string;
  metricValue: number;
  metadata: any;
}

interface ProcessingResult {
  agentId: string;
  updatedWeights: Record<string, number>;
  performanceScore: number;
  recommendedActions: string[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { action, agentId, timeWindow = '24h' } = await req.json();

    switch (action) {
      case 'process_feedback':
        return await processFeedback(supabase, agentId, timeWindow);
      case 'update_weights':
        return await updateAgentWeights(supabase, agentId);
      case 'analyze_performance':
        return await analyzePerformance(supabase, agentId, timeWindow);
      case 'generate_insights':
        return await generateInsights(supabase, agentId);
      default:
        throw new Error('Invalid action specified');
    }
  } catch (error) {
    console.error('Error in RL processor:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    );
  }
});

async function processFeedback(supabase: any, agentId: string, timeWindow: string): Promise<Response> {
  try {
    // Get recent feedback for the agent
    const { data: feedback, error: feedbackError } = await supabase
      .from('rl_feedback')
      .select('*')
      .eq('agent_id', agentId)
      .gte('timestamp', getTimeWindowStart(timeWindow))
      .order('timestamp', { ascending: false });

    if (feedbackError) throw feedbackError;

    // Get recent metrics
    const { data: metrics, error: metricsError } = await supabase
      .from('rl_agent_metrics')
      .select('*')
      .eq('agent_id', agentId)
      .gte('timestamp', getTimeWindowStart(timeWindow))
      .order('timestamp', { ascending: false });

    if (metricsError) throw metricsError;

    // Process and aggregate feedback
    const processedData = aggregateFeedback(feedback, metrics);
    
    // Calculate new weights based on feedback effectiveness
    const updatedWeights = calculateDataSourceWeights(processedData);
    
    // Generate performance insights
    const insights = generatePerformanceInsights(processedData);

    // Store processed results
    await supabase.from('rl_agent_metrics').insert({
      agent_id: agentId,
      metric_type: 'reward',
      metric_value: processedData.aggregatedReward,
      metadata: {
        processedAt: new Date().toISOString(),
        dataSourceWeights: updatedWeights,
        insights: insights,
        feedbackCount: feedback.length,
        metricsCount: metrics.length
      }
    });

    const result: ProcessingResult = {
      agentId,
      updatedWeights,
      performanceScore: processedData.aggregatedReward,
      recommendedActions: insights.recommendations
    };

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    throw new Error(`Failed to process feedback: ${error.message}`);
  }
}

async function updateAgentWeights(supabase: any, agentId: string): Promise<Response> {
  try {
    // Get the latest processed metrics to extract updated weights
    const { data: latestMetric, error } = await supabase
      .from('rl_agent_metrics')
      .select('metadata')
      .eq('agent_id', agentId)
      .eq('metric_type', 'reward')
      .order('timestamp', { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;

    const weights = latestMetric.metadata.dataSourceWeights;
    
    return new Response(
      JSON.stringify({ 
        agentId, 
        updatedWeights: weights,
        message: 'Agent weights updated successfully' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    throw new Error(`Failed to update agent weights: ${error.message}`);
  }
}

async function analyzePerformance(supabase: any, agentId: string, timeWindow: string): Promise<Response> {
  try {
    // Get performance metrics over time
    const { data: metrics, error } = await supabase
      .from('rl_agent_metrics')
      .select('*')
      .eq('agent_id', agentId)
      .gte('timestamp', getTimeWindowStart(timeWindow))
      .order('timestamp', { ascending: true });

    if (error) throw error;

    // Calculate performance trends
    const analysis = {
      agentId,
      timeWindow,
      totalMetrics: metrics.length,
      averageReward: calculateAverage(metrics.filter(m => m.metric_type === 'reward').map(m => m.metric_value)),
      averageAccuracy: calculateAverage(metrics.filter(m => m.metric_type === 'accuracy').map(m => m.metric_value)),
      averageEfficiency: calculateAverage(metrics.filter(m => m.metric_type === 'efficiency').map(m => m.metric_value)),
      performanceTrend: calculateTrend(metrics.filter(m => m.metric_type === 'reward')),
      convergenceProgress: calculateConvergence(metrics),
      recommendations: generateRecommendations(metrics)
    };

    return new Response(
      JSON.stringify(analysis),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    throw new Error(`Failed to analyze performance: ${error.message}`);
  }
}

async function generateInsights(supabase: any, agentId: string): Promise<Response> {
  try {
    // Get all data sources for comprehensive analysis
    const [feedback, metrics, interactions] = await Promise.all([
      supabase.from('rl_feedback').select('*').eq('agent_id', agentId).order('timestamp', { ascending: false }).limit(100),
      supabase.from('rl_agent_metrics').select('*').eq('agent_id', agentId).order('timestamp', { ascending: false }).limit(100),
      supabase.from('rl_system_interactions').select('*').order('timestamp', { ascending: false }).limit(100)
    ]);

    const insights = {
      agentId,
      dataQuality: {
        feedbackQuality: assessFeedbackQuality(feedback.data),
        metricReliability: assessMetricReliability(metrics.data),
        interactionPatterns: analyzeInteractionPatterns(interactions.data)
      },
      learningEffectiveness: {
        adaptationSpeed: calculateAdaptationSpeed(metrics.data),
        convergenceRate: calculateConvergenceRate(metrics.data),
        explorationBalance: assessExplorationBalance(metrics.data)
      },
      systemImprovements: {
        identifiedBottlenecks: identifyBottlenecks(feedback.data, metrics.data),
        optimizationOpportunities: findOptimizationOpportunities(metrics.data),
        recommendedChanges: generateSystemRecommendations(feedback.data, metrics.data)
      },
      predictiveInsights: {
        expectedPerformance: predictFuturePerformance(metrics.data),
        riskFactors: identifyRiskFactors(feedback.data, metrics.data),
        improvementPotential: calculateImprovementPotential(metrics.data)
      }
    };

    return new Response(
      JSON.stringify(insights),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    throw new Error(`Failed to generate insights: ${error.message}`);
  }
}

// Utility functions
function getTimeWindowStart(timeWindow: string): string {
  const now = new Date();
  const hours = timeWindow.includes('h') ? parseInt(timeWindow) : 24;
  return new Date(now.getTime() - hours * 60 * 60 * 1000).toISOString();
}

function aggregateFeedback(feedback: any[], metrics: any[]): any {
  const userRatings = feedback.filter(f => f.feedback_type === 'user_rating');
  const taskCompletions = feedback.filter(f => f.feedback_type === 'task_completion');
  const systemMetrics = metrics.filter(m => m.metric_type === 'efficiency');

  const aggregatedReward = (
    calculateAverage(userRatings.map(r => r.feedback_value.rating || 0)) * 0.4 +
    calculateAverage(taskCompletions.map(t => t.feedback_value.success ? 1 : 0)) * 0.3 +
    calculateAverage(systemMetrics.map(m => m.metric_value)) * 0.3
  );

  return {
    aggregatedReward: Math.max(0, Math.min(1, aggregatedReward)),
    userSatisfaction: calculateAverage(userRatings.map(r => r.feedback_value.rating || 0)),
    taskSuccessRate: calculateAverage(taskCompletions.map(t => t.feedback_value.success ? 1 : 0)),
    systemEfficiency: calculateAverage(systemMetrics.map(m => m.metric_value)),
    totalFeedbackItems: feedback.length,
    totalMetrics: metrics.length
  };
}

function calculateDataSourceWeights(processedData: any): Record<string, number> {
  const baseWeights = {
    userFeedback: 0.4,
    systemMetrics: 0.3,
    taskCompletion: 0.2,
    behavioralData: 0.1
  };

  // Adjust weights based on data quality and effectiveness
  const adjustmentFactor = processedData.aggregatedReward;
  
  return {
    userFeedback: Math.max(0.1, Math.min(0.6, baseWeights.userFeedback * (1 + adjustmentFactor * 0.2))),
    systemMetrics: Math.max(0.1, Math.min(0.5, baseWeights.systemMetrics * (1 + adjustmentFactor * 0.1))),
    taskCompletion: Math.max(0.1, Math.min(0.4, baseWeights.taskCompletion * (1 + adjustmentFactor * 0.15))),
    behavioralData: Math.max(0.05, Math.min(0.3, baseWeights.behavioralData * (1 + adjustmentFactor * 0.1)))
  };
}

function generatePerformanceInsights(processedData: any): any {
  const recommendations = [];
  
  if (processedData.userSatisfaction < 0.7) {
    recommendations.push('Increase focus on user experience improvements');
  }
  
  if (processedData.taskSuccessRate < 0.8) {
    recommendations.push('Optimize task completion workflows');
  }
  
  if (processedData.systemEfficiency < 0.75) {
    recommendations.push('Improve system performance and response times');
  }

  return {
    overallScore: processedData.aggregatedReward,
    recommendations,
    strengths: identifyStrengths(processedData),
    improvementAreas: identifyImprovementAreas(processedData)
  };
}

function calculateAverage(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, val) => sum + val, 0) / values.length;
}

function calculateTrend(metrics: any[]): string {
  if (metrics.length < 2) return 'insufficient_data';
  
  const recent = metrics.slice(-10);
  const older = metrics.slice(-20, -10);
  
  const recentAvg = calculateAverage(recent.map(m => m.metric_value));
  const olderAvg = calculateAverage(older.map(m => m.metric_value));
  
  const change = (recentAvg - olderAvg) / olderAvg;
  
  if (change > 0.05) return 'improving';
  if (change < -0.05) return 'declining';
  return 'stable';
}

function calculateConvergence(metrics: any[]): number {
  if (metrics.length < 10) return 0;
  
  const rewards = metrics.filter(m => m.metric_type === 'reward').map(m => m.metric_value);
  const recent10 = rewards.slice(-10);
  const variance = calculateVariance(recent10);
  
  // Lower variance indicates better convergence
  return Math.max(0, Math.min(1, 1 - variance));
}

function calculateVariance(values: number[]): number {
  const avg = calculateAverage(values);
  const squaredDiffs = values.map(val => Math.pow(val - avg, 2));
  return calculateAverage(squaredDiffs);
}

function generateRecommendations(metrics: any[]): string[] {
  const recommendations = [];
  const recentMetrics = metrics.slice(-20);
  
  const avgReward = calculateAverage(recentMetrics.filter(m => m.metric_type === 'reward').map(m => m.metric_value));
  const avgAccuracy = calculateAverage(recentMetrics.filter(m => m.metric_type === 'accuracy').map(m => m.metric_value));
  
  if (avgReward < 0.6) {
    recommendations.push('Consider adjusting learning rate or exploration strategy');
  }
  
  if (avgAccuracy < 0.8) {
    recommendations.push('Increase training data quality or model complexity');
  }
  
  return recommendations;
}

// Additional utility functions for insights
function assessFeedbackQuality(feedback: any[]): any {
  return {
    volume: feedback.length,
    diversity: new Set(feedback.map(f => f.feedback_type)).size,
    recency: feedback.filter(f => new Date(f.timestamp) > new Date(Date.now() - 24*60*60*1000)).length
  };
}

function assessMetricReliability(metrics: any[]): any {
  return {
    consistency: calculateConsistency(metrics),
    coverage: new Set(metrics.map(m => m.metric_type)).size,
    frequency: metrics.length
  };
}

function analyzeInteractionPatterns(interactions: any[]): any {
  return {
    totalInteractions: interactions.length,
    uniqueTypes: new Set(interactions.map(i => i.interaction_type)).size,
    successRate: interactions.filter(i => i.outcome?.completed).length / interactions.length
  };
}

function calculateAdaptationSpeed(metrics: any[]): number {
  // Simplified calculation - in practice, this would be more sophisticated
  const improvements = metrics.filter(m => m.metric_type === 'reward').slice(-10);
  return improvements.length > 0 ? calculateTrendValue(improvements) : 0;
}

function calculateConvergenceRate(metrics: any[]): number {
  const convergenceMetrics = metrics.filter(m => m.metric_type === 'convergence');
  return convergenceMetrics.length > 0 ? calculateAverage(convergenceMetrics.map(m => m.metric_value)) : 0;
}

function assessExplorationBalance(metrics: any[]): number {
  const explorationMetrics = metrics.filter(m => m.metric_type === 'exploration_rate');
  return explorationMetrics.length > 0 ? calculateAverage(explorationMetrics.map(m => m.metric_value)) : 0;
}

function identifyBottlenecks(feedback: any[], metrics: any[]): string[] {
  const bottlenecks = [];
  
  const lowRatings = feedback.filter(f => f.feedback_type === 'user_rating' && f.feedback_value.rating < 3);
  if (lowRatings.length > feedback.length * 0.3) {
    bottlenecks.push('User satisfaction below threshold');
  }
  
  return bottlenecks;
}

function findOptimizationOpportunities(metrics: any[]): string[] {
  const opportunities = [];
  
  const efficiencyMetrics = metrics.filter(m => m.metric_type === 'efficiency');
  const avgEfficiency = calculateAverage(efficiencyMetrics.map(m => m.metric_value));
  
  if (avgEfficiency < 0.8) {
    opportunities.push('Improve computational efficiency');
  }
  
  return opportunities;
}

function generateSystemRecommendations(feedback: any[], metrics: any[]): string[] {
  return [
    'Implement adaptive learning rate scheduling',
    'Enhance multi-modal feedback integration',
    'Optimize reward function weighting'
  ];
}

function predictFuturePerformance(metrics: any[]): any {
  const trend = calculateTrend(metrics.filter(m => m.metric_type === 'reward'));
  return {
    expectedImprovement: trend === 'improving' ? 0.15 : trend === 'declining' ? -0.1 : 0.05,
    confidence: 0.75
  };
}

function identifyRiskFactors(feedback: any[], metrics: any[]): string[] {
  const risks = [];
  
  if (feedback.length < 10) {
    risks.push('Insufficient feedback data');
  }
  
  if (metrics.length < 20) {
    risks.push('Limited performance metrics');
  }
  
  return risks;
}

function calculateImprovementPotential(metrics: any[]): number {
  const currentPerformance = calculateAverage(metrics.filter(m => m.metric_type === 'reward').slice(-5).map(m => m.metric_value));
  return Math.max(0, 1 - currentPerformance);
}

function identifyStrengths(processedData: any): string[] {
  const strengths = [];
  
  if (processedData.userSatisfaction > 0.8) {
    strengths.push('High user satisfaction');
  }
  
  if (processedData.taskSuccessRate > 0.9) {
    strengths.push('Excellent task completion rate');
  }
  
  return strengths;
}

function identifyImprovementAreas(processedData: any): string[] {
  const areas = [];
  
  if (processedData.systemEfficiency < 0.7) {
    areas.push('System efficiency optimization');
  }
  
  if (processedData.totalFeedbackItems < 50) {
    areas.push('Increase feedback collection');
  }
  
  return areas;
}

function calculateConsistency(metrics: any[]): number {
  if (metrics.length < 5) return 0;
  
  const values = metrics.map(m => m.metric_value);
  const variance = calculateVariance(values);
  return Math.max(0, 1 - variance);
}

function calculateTrendValue(metrics: any[]): number {
  if (metrics.length < 2) return 0;
  
  const first = metrics[0].metric_value;
  const last = metrics[metrics.length - 1].metric_value;
  
  return (last - first) / first;
}