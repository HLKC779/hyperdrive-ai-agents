import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Activity, 
  ArrowUp, 
  ArrowDown, 
  Minus,
  RefreshCw,
  Settings2,
  Zap,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Loader2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ScalingConfig {
  minInstances: number;
  maxInstances: number;
  cpuThresholdUp: number;
  cpuThresholdDown: number;
  memoryThresholdUp: number;
  memoryThresholdDown: number;
  performanceThresholdUp: number;
  performanceThresholdDown: number;
  cooldownPeriod: number;
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

interface AnalysisResult {
  success: boolean;
  decisions: ScalingDecision[];
  summary: {
    totalAgents: number;
    scaleUpCount: number;
    scaleDownCount: number;
    noChangeCount: number;
  };
}

const defaultConfig: ScalingConfig = {
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

const AgentAutoScaler: React.FC = () => {
  const [isAutoScaleEnabled, setIsAutoScaleEnabled] = useState(false);
  const [config, setConfig] = useState<ScalingConfig>(defaultConfig);
  const [decisions, setDecisions] = useState<ScalingDecision[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isExecuting, setIsExecuting] = useState<string | null>(null);
  const [lastAnalysis, setLastAnalysis] = useState<Date | null>(null);
  const [showConfig, setShowConfig] = useState(false);

  const analyzeScaling = useCallback(async () => {
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('agent-auto-scaler', {
        body: { action: 'analyze', config }
      });

      if (error) throw error;

      const result = data as AnalysisResult;
      if (result.success) {
        setDecisions(result.decisions);
        setLastAnalysis(new Date());
        
        if (result.summary.scaleUpCount > 0 || result.summary.scaleDownCount > 0) {
          toast.info(`Scaling analysis complete: ${result.summary.scaleUpCount} scale up, ${result.summary.scaleDownCount} scale down`);
        } else {
          toast.success('All agents operating within optimal range');
        }
      }
    } catch (error) {
      console.error('Scaling analysis error:', error);
      toast.error('Failed to analyze scaling requirements');
    } finally {
      setIsAnalyzing(false);
    }
  }, [config]);

  const executeScaling = async (agentId: string, agentName: string) => {
    setIsExecuting(agentId);
    try {
      const { data, error } = await supabase.functions.invoke('agent-auto-scaler', {
        body: { action: 'execute', agentId }
      });

      if (error) throw error;

      toast.success(`Scaling executed for ${agentName}`);
      
      // Update local state
      setDecisions(prev => prev.map(d => 
        d.agentId === agentId 
          ? { ...d, action: 'no_change', reason: 'Scaling executed', currentInstances: d.recommendedInstances }
          : d
      ));
    } catch (error) {
      console.error('Scaling execution error:', error);
      toast.error('Failed to execute scaling');
    } finally {
      setIsExecuting(null);
    }
  };

  const executeAllScaling = async () => {
    const toScale = decisions.filter(d => d.action !== 'no_change');
    
    for (const decision of toScale) {
      await executeScaling(decision.agentId, decision.agentName);
    }
    
    toast.success(`Executed scaling for ${toScale.length} agents`);
  };

  // Auto-analyze when enabled
  useEffect(() => {
    if (isAutoScaleEnabled) {
      analyzeScaling();
      const interval = setInterval(analyzeScaling, config.cooldownPeriod * 1000);
      return () => clearInterval(interval);
    }
  }, [isAutoScaleEnabled, analyzeScaling, config.cooldownPeriod]);

  const getActionIcon = (action: ScalingDecision['action']) => {
    switch (action) {
      case 'scale_up':
        return <ArrowUp className="h-4 w-4 text-orange-500" />;
      case 'scale_down':
        return <ArrowDown className="h-4 w-4 text-blue-500" />;
      default:
        return <Minus className="h-4 w-4 text-green-500" />;
    }
  };

  const getActionBadge = (action: ScalingDecision['action']) => {
    const variants = {
      scale_up: 'destructive' as const,
      scale_down: 'secondary' as const,
      no_change: 'outline' as const
    };
    const labels = {
      scale_up: 'Scale Up',
      scale_down: 'Scale Down',
      no_change: 'Optimal'
    };
    return <Badge variant={variants[action]}>{labels[action]}</Badge>;
  };

  const summary = {
    total: decisions.length,
    scaleUp: decisions.filter(d => d.action === 'scale_up').length,
    scaleDown: decisions.filter(d => d.action === 'scale_down').length,
    optimal: decisions.filter(d => d.action === 'no_change').length
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Automated Agent Scaling
              </CardTitle>
              <CardDescription>
                Automatically scale agent resources based on real-time metrics
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="auto-scale"
                  checked={isAutoScaleEnabled}
                  onCheckedChange={setIsAutoScaleEnabled}
                />
                <Label htmlFor="auto-scale">Auto-Scale</Label>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowConfig(!showConfig)}
              >
                <Settings2 className="h-4 w-4 mr-2" />
                Configure
              </Button>
              <Button 
                onClick={analyzeScaling} 
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Analyze
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold">{summary.total}</p>
              <p className="text-sm text-muted-foreground">Total Agents</p>
            </div>
            <div className="text-center p-4 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <div className="flex items-center justify-center gap-1">
                <TrendingUp className="h-5 w-5 text-orange-500" />
                <p className="text-2xl font-bold text-orange-600">{summary.scaleUp}</p>
              </div>
              <p className="text-sm text-muted-foreground">Need Scale Up</p>
            </div>
            <div className="text-center p-4 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center justify-center gap-1">
                <TrendingDown className="h-5 w-5 text-blue-500" />
                <p className="text-2xl font-bold text-blue-600">{summary.scaleDown}</p>
              </div>
              <p className="text-sm text-muted-foreground">Can Scale Down</p>
            </div>
            <div className="text-center p-4 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center justify-center gap-1">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <p className="text-2xl font-bold text-green-600">{summary.optimal}</p>
              </div>
              <p className="text-sm text-muted-foreground">Optimal</p>
            </div>
          </div>

          {lastAnalysis && (
            <p className="text-xs text-muted-foreground text-center">
              Last analysis: {lastAnalysis.toLocaleTimeString()}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Configuration Panel */}
      {showConfig && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Scaling Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label>CPU Threshold (Scale Up): {config.cpuThresholdUp}%</Label>
                  <Slider
                    value={[config.cpuThresholdUp]}
                    onValueChange={([value]) => setConfig(prev => ({ ...prev, cpuThresholdUp: value }))}
                    max={100}
                    min={50}
                    step={5}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>CPU Threshold (Scale Down): {config.cpuThresholdDown}%</Label>
                  <Slider
                    value={[config.cpuThresholdDown]}
                    onValueChange={([value]) => setConfig(prev => ({ ...prev, cpuThresholdDown: value }))}
                    max={50}
                    min={10}
                    step={5}
                    className="mt-2"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label>Memory Threshold (Scale Up): {config.memoryThresholdUp}%</Label>
                  <Slider
                    value={[config.memoryThresholdUp]}
                    onValueChange={([value]) => setConfig(prev => ({ ...prev, memoryThresholdUp: value }))}
                    max={100}
                    min={50}
                    step={5}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Memory Threshold (Scale Down): {config.memoryThresholdDown}%</Label>
                  <Slider
                    value={[config.memoryThresholdDown]}
                    onValueChange={([value]) => setConfig(prev => ({ ...prev, memoryThresholdDown: value }))}
                    max={50}
                    min={10}
                    step={5}
                    className="mt-2"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label>Performance Threshold (Scale Up): {config.performanceThresholdUp}%</Label>
                  <Slider
                    value={[config.performanceThresholdUp]}
                    onValueChange={([value]) => setConfig(prev => ({ ...prev, performanceThresholdUp: value }))}
                    max={80}
                    min={40}
                    step={5}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Performance Threshold (Scale Down): {config.performanceThresholdDown}%</Label>
                  <Slider
                    value={[config.performanceThresholdDown]}
                    onValueChange={([value]) => setConfig(prev => ({ ...prev, performanceThresholdDown: value }))}
                    max={100}
                    min={80}
                    step={5}
                    className="mt-2"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label>Min Instances: {config.minInstances}</Label>
                  <Slider
                    value={[config.minInstances]}
                    onValueChange={([value]) => setConfig(prev => ({ ...prev, minInstances: value }))}
                    max={5}
                    min={1}
                    step={1}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Max Instances: {config.maxInstances}</Label>
                  <Slider
                    value={[config.maxInstances]}
                    onValueChange={([value]) => setConfig(prev => ({ ...prev, maxInstances: value }))}
                    max={20}
                    min={5}
                    step={1}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setConfig(defaultConfig)}>
                Reset to Defaults
              </Button>
              <Button onClick={() => {
                toast.success('Configuration saved');
                setShowConfig(false);
              }}>
                Save Configuration
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scaling Decisions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Scaling Decisions
            </CardTitle>
            {decisions.filter(d => d.action !== 'no_change').length > 0 && (
              <Button onClick={executeAllScaling} variant="default">
                <Zap className="h-4 w-4 mr-2" />
                Execute All Scaling
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {decisions.length === 0 ? (
                <div className="text-center py-12">
                  <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No scaling analysis available. Click "Analyze" to check agent scaling requirements.
                  </p>
                </div>
              ) : (
                decisions.map((decision) => (
                  <Card key={decision.agentId} className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getActionIcon(decision.action)}
                          <div>
                            <h4 className="font-semibold">{decision.agentName}</h4>
                            <p className="text-sm text-muted-foreground">{decision.agentId}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getActionBadge(decision.action)}
                          {decision.action !== 'no_change' && (
                            <Button
                              size="sm"
                              onClick={() => executeScaling(decision.agentId, decision.agentName)}
                              disabled={isExecuting === decision.agentId}
                            >
                              {isExecuting === decision.agentId ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>Execute</>
                              )}
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-sm">{decision.reason}</p>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Performance</p>
                          <div className="flex items-center gap-2">
                            <Progress value={decision.metrics.avgPerformance} className="h-2 flex-1" />
                            <span className="font-semibold">{decision.metrics.avgPerformance}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Memory</p>
                          <div className="flex items-center gap-2">
                            <Progress value={decision.metrics.avgMemory} className="h-2 flex-1" />
                            <span className="font-semibold">{decision.metrics.avgMemory}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-muted-foreground">CPU</p>
                          <div className="flex items-center gap-2">
                            <Progress value={decision.metrics.avgCpu} className="h-2 flex-1" />
                            <span className="font-semibold">{decision.metrics.avgCpu}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Error Rate</p>
                          <p className="font-semibold">{decision.metrics.errorRate}/interval</p>
                        </div>
                      </div>

                      {decision.action !== 'no_change' && (
                        <div className="flex items-center justify-between text-sm bg-primary/10 p-3 rounded-lg">
                          <span>Instance Recommendation:</span>
                          <span className="font-semibold">
                            {decision.currentInstances} → {decision.recommendedInstances} instances
                          </span>
                        </div>
                      )}
                    </div>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentAutoScaler;
