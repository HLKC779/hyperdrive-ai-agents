import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Cpu, 
  TrendingUp,
  TrendingDown,
  Zap,
  Bell,
  X
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AgentMetric {
  id: string;
  agent_id: string;
  agent_name: string;
  status: 'active' | 'idle' | 'busy' | 'error';
  performance: number;
  tasks_completed: number;
  avg_response_time: number;
  memory_usage: number;
  cpu_usage?: number;
  error_count: number;
  last_activity: string;
  created_at: string;
}

interface AgentAlert {
  id: string;
  agent_id: string;
  agent_name: string;
  alert_type: 'performance' | 'error' | 'memory' | 'timeout' | 'offline';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  resolved: boolean;
  created_at: string;
}

const AgentRealtimeMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<AgentMetric[]>([]);
  const [alerts, setAlerts] = useState<AgentAlert[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    loadInitialData();
    setupRealtimeSubscription();
  }, []);

  const loadInitialData = async () => {
    try {
      // Load latest metrics for each agent
      const { data: metricsData, error: metricsError } = await supabase
        .from('agent_metrics')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (metricsError) throw metricsError;
      if (metricsData) setMetrics(metricsData as AgentMetric[]);

      // Load unresolved alerts
      const { data: alertsData, error: alertsError } = await supabase
        .from('agent_alerts')
        .select('*')
        .eq('resolved', false)
        .order('created_at', { ascending: false });

      if (alertsError) throw alertsError;
      if (alertsData) setAlerts(alertsData as AgentAlert[]);

    } catch (error) {
      console.error('Error loading initial data:', error);
      toast.error('Failed to load monitoring data');
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('agent-monitoring')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'agent_metrics'
        },
        (payload) => {
          console.log('Metrics change:', payload);
          
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const newMetric = payload.new as AgentMetric;
            setMetrics(prev => {
              const filtered = prev.filter(m => m.agent_id !== newMetric.agent_id);
              return [newMetric, ...filtered].slice(0, 20);
            });
            
            // Check for performance issues
            checkMetricThresholds(newMetric);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'agent_alerts'
        },
        (payload) => {
          console.log('Alert change:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newAlert = payload.new as AgentAlert;
            setAlerts(prev => [newAlert, ...prev]);
            
            // Show toast notification
            const severity = newAlert.severity;
            if (severity === 'critical' || severity === 'high') {
              toast.error(`🚨 ${newAlert.agent_name}: ${newAlert.message}`);
            } else {
              toast.warning(`⚠️ ${newAlert.agent_name}: ${newAlert.message}`);
            }
          } else if (payload.eventType === 'UPDATE') {
            const updatedAlert = payload.new as AgentAlert;
            setAlerts(prev => 
              prev.map(a => a.id === updatedAlert.id ? updatedAlert : a)
                .filter(a => !a.resolved)
            );
          }
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
        setIsConnected(status === 'SUBSCRIBED');
        if (status === 'SUBSCRIBED') {
          toast.success('📡 Real-time monitoring connected');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const checkMetricThresholds = (metric: AgentMetric) => {
    // Check if we need to create alerts
    const alerts = [];

    if (metric.performance < 70) {
      alerts.push({
        agent_id: metric.agent_id,
        agent_name: metric.agent_name,
        alert_type: 'performance' as const,
        severity: metric.performance < 50 ? 'critical' as const : 'high' as const,
        message: `Performance dropped to ${metric.performance}%`,
        resolved: false
      });
    }

    if (metric.memory_usage > 85) {
      alerts.push({
        agent_id: metric.agent_id,
        agent_name: metric.agent_name,
        alert_type: 'memory' as const,
        severity: metric.memory_usage > 95 ? 'critical' as const : 'high' as const,
        message: `High memory usage: ${metric.memory_usage}%`,
        resolved: false
      });
    }

    if (metric.error_count > 5) {
      alerts.push({
        agent_id: metric.agent_id,
        agent_name: metric.agent_name,
        alert_type: 'error' as const,
        severity: 'high' as const,
        message: `Multiple errors detected: ${metric.error_count} errors`,
        resolved: false
      });
    }

    // Insert alerts into database
    if (alerts.length > 0) {
      alerts.forEach(async (alert) => {
        await supabase.from('agent_alerts').insert(alert);
      });
    }
  };

  const resolveAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('agent_alerts')
        .update({ resolved: true, resolved_at: new Date().toISOString() })
        .eq('id', alertId);

      if (error) throw error;
      toast.success('Alert resolved');
    } catch (error) {
      console.error('Error resolving alert:', error);
      toast.error('Failed to resolve alert');
    }
  };

  const getStatusIcon = (status: AgentMetric['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'busy':
        return <Activity className="h-4 w-4 text-blue-500" />;
      case 'idle':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  const getSeverityBadge = (severity: AgentAlert['severity']) => {
    const variants = {
      low: 'outline',
      medium: 'secondary',
      high: 'default',
      critical: 'destructive'
    } as const;
    
    return <Badge variant={variants[severity]}>{severity.toUpperCase()}</Badge>;
  };

  const getAverageStat = (key: keyof Pick<AgentMetric, 'performance' | 'memory_usage' | 'avg_response_time'>) => {
    if (metrics.length === 0) return 0;
    const sum = metrics.reduce((acc, m) => acc + Number(m[key]), 0);
    return Math.round(sum / metrics.length);
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Real-Time Agent Monitor
              </CardTitle>
              <CardDescription>Live metrics and alerts from all agents</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
              <span className="text-sm text-muted-foreground">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{metrics.length}</p>
              <p className="text-sm text-muted-foreground">Active Agents</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{getAverageStat('performance')}%</p>
              <p className="text-sm text-muted-foreground">Avg Performance</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{getAverageStat('memory_usage')}%</p>
              <p className="text-sm text-muted-foreground">Avg Memory</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{alerts.length}</p>
              <p className="text-sm text-muted-foreground">Active Alerts</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Live Agent Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {metrics.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No metrics available. Agents will appear here when they report metrics.
                  </p>
                ) : (
                  metrics.map((metric) => (
                    <Card key={metric.id} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(metric.status)}
                            <h4 className="font-semibold">{metric.agent_name}</h4>
                          </div>
                          <Badge variant="outline">{metric.status}</Badge>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Performance</span>
                            <span className="font-medium">{metric.performance}%</span>
                          </div>
                          <Progress value={metric.performance} className="h-2" />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Memory</span>
                            <span className="font-medium">{metric.memory_usage}%</span>
                          </div>
                          <Progress value={metric.memory_usage} className="h-2" />
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <p className="text-muted-foreground">Tasks</p>
                            <p className="font-semibold">{metric.tasks_completed}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Response</p>
                            <p className="font-semibold">{metric.avg_response_time}s</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Errors</p>
                            <p className="font-semibold text-red-600">{metric.error_count}</p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Active Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-3">
                {alerts.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-2" />
                    <p className="text-muted-foreground">All clear! No active alerts.</p>
                  </div>
                ) : (
                  alerts.map((alert) => (
                    <Card key={alert.id} className="p-4 border-l-4" style={{
                      borderLeftColor: 
                        alert.severity === 'critical' ? 'rgb(239, 68, 68)' :
                        alert.severity === 'high' ? 'rgb(245, 158, 11)' :
                        alert.severity === 'medium' ? 'rgb(59, 130, 246)' :
                        'rgb(156, 163, 175)'
                    }}>
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <AlertTriangle className="h-4 w-4" />
                              <span className="font-semibold text-sm">{alert.agent_name}</span>
                              {getSeverityBadge(alert.severity)}
                            </div>
                            <p className="text-sm">{alert.message}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(alert.created_at).toLocaleTimeString()}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => resolveAlert(alert.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AgentRealtimeMonitor;
