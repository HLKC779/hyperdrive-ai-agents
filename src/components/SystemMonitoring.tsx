import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  BarChart3, 
  Activity, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Cpu,
  MemoryStick,
  HardDrive,
  Network,
  Zap,
  RefreshCw,
  Download,
  Settings,
  Play,
  Pause,
  Square,
  Users,
  Database,
  Globe,
  Shield,
  Eye,
  Bell,
  Filter,
  Calendar,
  LineChart
} from "lucide-react";

interface SystemMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  status: 'healthy' | 'warning' | 'critical';
  threshold: number;
  lastUpdated: string;
}

interface Alert {
  id: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  acknowledged: boolean;
  source: string;
}

interface PerformanceData {
  timestamp: string;
  cpu: number;
  memory: number;
  tasks: number;
  responseTime: number;
}

const mockSystemMetrics: SystemMetric[] = [
  {
    id: '1',
    name: 'CPU Usage',
    value: 68,
    unit: '%',
    trend: 'up',
    status: 'warning',
    threshold: 80,
    lastUpdated: '2 seconds ago'
  },
  {
    id: '2',
    name: 'Memory Usage',
    value: 45,
    unit: '%',
    trend: 'stable',
    status: 'healthy',
    threshold: 85,
    lastUpdated: '2 seconds ago'
  },
  {
    id: '3',
    name: 'Active Agents',
    value: 12,
    unit: '',
    trend: 'up',
    status: 'healthy',
    threshold: 20,
    lastUpdated: '5 seconds ago'
  },
  {
    id: '4',
    name: 'Task Queue',
    value: 23,
    unit: 'tasks',
    trend: 'down',
    status: 'healthy',
    threshold: 100,
    lastUpdated: '1 second ago'
  },
  {
    id: '5',
    name: 'Response Time',
    value: 1.2,
    unit: 's',
    trend: 'stable',
    status: 'healthy',
    threshold: 3.0,
    lastUpdated: '3 seconds ago'
  },
  {
    id: '6',
    name: 'Success Rate',
    value: 94.7,
    unit: '%',
    trend: 'up',
    status: 'healthy',
    threshold: 90,
    lastUpdated: '10 seconds ago'
  }
];

const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'warning',
    title: 'High CPU Usage',
    message: 'CPU usage has been above 70% for the last 15 minutes',
    timestamp: '5 minutes ago',
    acknowledged: false,
    source: 'System Monitor'
  },
  {
    id: '2',
    type: 'error',
    title: 'Agent Timeout',
    message: 'Research Agent #3 has not responded for 30 seconds',
    timestamp: '8 minutes ago',
    acknowledged: false,
    source: 'Agent Manager'
  },
  {
    id: '3',
    type: 'info',
    title: 'Model Update Available',
    message: 'New version of GPT-4 integration is available for deployment',
    timestamp: '2 hours ago',
    acknowledged: true,
    source: 'Model Registry'
  }
];

const mockPerformanceData: PerformanceData[] = [
  { timestamp: '14:00', cpu: 45, memory: 52, tasks: 18, responseTime: 1.1 },
  { timestamp: '14:05', cpu: 52, memory: 48, tasks: 23, responseTime: 1.3 },
  { timestamp: '14:10', cpu: 48, memory: 55, tasks: 19, responseTime: 1.0 },
  { timestamp: '14:15', cpu: 63, memory: 59, tasks: 31, responseTime: 1.5 },
  { timestamp: '14:20', cpu: 68, memory: 45, tasks: 23, responseTime: 1.2 },
];

const SystemMonitoring = () => {
  const [metrics, setMetrics] = useState<SystemMetric[]>(mockSystemMetrics);
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [selectedTimeRange, setSelectedTimeRange] = useState('1h');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  const getStatusColor = (status: SystemMetric['status']) => {
    switch (status) {
      case 'healthy': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusBadgeVariant = (status: SystemMetric['status']) => {
    switch (status) {
      case 'healthy': return 'default' as const;
      case 'warning': return 'secondary' as const;
      case 'critical': return 'destructive' as const;
      default: return 'outline' as const;
    }
  };

  const getTrendIcon = (trend: SystemMetric['trend']) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
      case 'stable': return <Activity className="h-4 w-4 text-gray-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default: return <CheckCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getAlertVariant = (type: Alert['type']) => {
    switch (type) {
      case 'error': return 'destructive' as const;
      case 'warning': return 'secondary' as const;
      case 'info': return 'outline' as const;
      default: return 'outline' as const;
    }
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  const refreshMetrics = () => {
    // Simulate metrics refresh
    setMetrics(metrics.map(metric => ({
      ...metric,
      value: metric.value + (Math.random() - 0.5) * 10,
      lastUpdated: 'Just now'
    })));
  };

  const healthyMetrics = metrics.filter(m => m.status === 'healthy').length;
  const warningMetrics = metrics.filter(m => m.status === 'warning').length;
  const criticalMetrics = metrics.filter(m => m.status === 'critical').length;
  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">System Monitoring</h1>
          <p className="text-muted-foreground">
            Real-time performance analytics and system health monitoring
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={refreshMetrics}
            disabled={autoRefresh}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Monitoring Configuration</DialogTitle>
                <DialogDescription>
                  Configure alerts, thresholds, and monitoring settings
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="refresh-interval">Refresh Interval (seconds)</Label>
                  <Input id="refresh-interval" defaultValue="5" type="number" />
                </div>
                <div>
                  <Label htmlFor="cpu-threshold">CPU Threshold (%)</Label>
                  <Input id="cpu-threshold" defaultValue="80" type="number" />
                </div>
                <div>
                  <Label htmlFor="memory-threshold">Memory Threshold (%)</Label>
                  <Input id="memory-threshold" defaultValue="85" type="number" />
                </div>
                <Button className="w-full">Save Configuration</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{healthyMetrics}</p>
                <p className="text-sm text-muted-foreground">Healthy</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{warningMetrics}</p>
                <p className="text-sm text-muted-foreground">Warnings</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{criticalMetrics}</p>
                <p className="text-sm text-muted-foreground">Critical</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{unacknowledgedAlerts}</p>
                <p className="text-sm text-muted-foreground">Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="metrics" className="space-y-6">
        <TabsList>
          <TabsTrigger value="metrics">Real-time Metrics</TabsTrigger>
          <TabsTrigger value="performance">Performance Trends</TabsTrigger>
          <TabsTrigger value="alerts">Alerts & Events</TabsTrigger>
          <TabsTrigger value="agents">Agent Health</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-6">
          {/* Time Range Selector */}
          <div className="flex items-center gap-4">
            <Label>Time Range:</Label>
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="border rounded-md px-3 py-1 bg-background"
            >
              <option value="5m">5 minutes</option>
              <option value="1h">1 hour</option>
              <option value="6h">6 hours</option>
              <option value="24h">24 hours</option>
              <option value="7d">7 days</option>
            </select>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="auto-refresh"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
              />
              <Label htmlFor="auto-refresh">Auto-refresh</Label>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {metrics.map((metric) => (
              <Card key={metric.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{metric.name}</CardTitle>
                    <Badge variant={getStatusBadgeVariant(metric.status)}>
                      {metric.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold">
                      {metric.value.toFixed(metric.unit === 's' ? 1 : 0)}{metric.unit}
                    </span>
                    {getTrendIcon(metric.trend)}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Threshold</span>
                      <span>{metric.threshold}{metric.unit}</span>
                    </div>
                    <Progress 
                      value={(metric.value / metric.threshold) * 100} 
                      className="h-2"
                    />
                  </div>

                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>Updated: {metric.lastUpdated}</span>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-3 w-3 mr-1" />
                      Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Timeline</CardTitle>
                <CardDescription>System performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 border border-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <LineChart className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Performance chart visualization</p>
                    <p className="text-sm text-gray-400">Real-time metrics would be plotted here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resource Utilization</CardTitle>
                <CardDescription>Current resource usage breakdown</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <Cpu className="h-4 w-4" />
                      CPU
                    </span>
                    <span>68%</span>
                  </div>
                  <Progress value={68} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <MemoryStick className="h-4 w-4" />
                      Memory
                    </span>
                    <span>45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <HardDrive className="h-4 w-4" />
                      Storage
                    </span>
                    <span>23%</span>
                  </div>
                  <Progress value={23} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <Network className="h-4 w-4" />
                      Network
                    </span>
                    <span>12%</span>
                  </div>
                  <Progress value={12} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Data</CardTitle>
              <CardDescription>Historical performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Time</th>
                      <th className="text-left p-2">CPU %</th>
                      <th className="text-left p-2">Memory %</th>
                      <th className="text-left p-2">Active Tasks</th>
                      <th className="text-left p-2">Response Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockPerformanceData.map((data, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2">{data.timestamp}</td>
                        <td className="p-2">{data.cpu}%</td>
                        <td className="p-2">{data.memory}%</td>
                        <td className="p-2">{data.tasks}</td>
                        <td className="p-2">{data.responseTime}s</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">System Alerts</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                Mark All Read
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {alerts.map((alert) => (
              <Card key={alert.id} className={alert.acknowledged ? 'opacity-60' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{alert.title}</h4>
                          <Badge variant={getAlertVariant(alert.type)} className="text-xs">
                            {alert.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {alert.message}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{alert.timestamp}</span>
                          <span>Source: {alert.source}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!alert.acknowledged && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => acknowledgeAlert(alert.id)}
                        >
                          Acknowledge
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="agents" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Research Agent #1</span>
                  <Badge variant="default">Active</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>CPU Usage</span>
                  <span>23%</span>
                </div>
                <Progress value={23} className="h-2" />
                <div className="flex justify-between text-sm">
                  <span>Memory Usage</span>
                  <span>156MB</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tasks Completed</span>
                  <span>47</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Uptime</span>
                  <span>4h 23m</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Code Agent #1</span>
                  <Badge variant="default">Active</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>CPU Usage</span>
                  <span>34%</span>
                </div>
                <Progress value={34} className="h-2" />
                <div className="flex justify-between text-sm">
                  <span>Memory Usage</span>
                  <span>298MB</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tasks Completed</span>
                  <span>23</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Uptime</span>
                  <span>2h 45m</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Data Agent #1</span>
                  <Badge variant="secondary">Warning</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>CPU Usage</span>
                  <span>78%</span>
                </div>
                <Progress value={78} className="h-2" />
                <div className="flex justify-between text-sm">
                  <span>Memory Usage</span>
                  <span>512MB</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tasks Completed</span>
                  <span>89</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Uptime</span>
                  <span>6h 12m</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemMonitoring;