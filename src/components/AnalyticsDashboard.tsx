import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Clock, CheckCircle, AlertTriangle, Activity, Target, Zap } from 'lucide-react';

interface HistoricalData {
  date: string;
  tasksCompleted: number;
  tasksCreated: number;
  avgExecutionTime: number;
  successRate: number;
  cpuAvg: number;
  memoryAvg: number;
}

interface TaskPattern {
  hour: string;
  workflowTasks: number;
  computationTasks: number;
  apiTasks: number;
  analysisTask: number;
  total: number;
}

interface PerformanceMetric {
  name: string;
  value: string;
  change: number;
  icon: React.ElementType;
  color: string;
}

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

const AnalyticsDashboard = () => {
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [taskPatterns, setTaskPatterns] = useState<TaskPattern[]>([]);

  useEffect(() => {
    // Generate mock historical data for the last 7 days
    const generateHistoricalData = () => {
      const data: HistoricalData[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        data.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          tasksCompleted: Math.floor(Math.random() * 50) + 20,
          tasksCreated: Math.floor(Math.random() * 60) + 25,
          avgExecutionTime: Math.floor(Math.random() * 300) + 120, // 2-7 minutes
          successRate: Math.floor(Math.random() * 20) + 80, // 80-100%
          cpuAvg: Math.floor(Math.random() * 30) + 40,
          memoryAvg: Math.floor(Math.random() * 25) + 45,
        });
      }
      setHistoricalData(data);
    };

    // Generate task execution patterns by hour
    const generateTaskPatterns = () => {
      const patterns: TaskPattern[] = [];
      for (let hour = 0; hour < 24; hour++) {
        const workflow = Math.floor(Math.random() * 15) + 5;
        const computation = Math.floor(Math.random() * 10) + 3;
        const api = Math.floor(Math.random() * 12) + 4;
        const analysis = Math.floor(Math.random() * 8) + 2;
        
        patterns.push({
          hour: `${hour}:00`,
          workflowTasks: workflow,
          computationTasks: computation,
          apiTasks: api,
          analysisTask: analysis,
          total: workflow + computation + api + analysis,
        });
      }
      setTaskPatterns(patterns);
    };

    generateHistoricalData();
    generateTaskPatterns();
  }, []);

  const taskTypeDistribution = [
    { name: 'Workflow', value: 45, color: COLORS[0] },
    { name: 'Computation', value: 25, color: COLORS[1] },
    { name: 'API Tasks', value: 20, color: COLORS[2] },
    { name: 'Analysis', value: 10, color: COLORS[3] },
  ];

  const performanceMetrics: PerformanceMetric[] = [
    {
      name: 'Avg Response Time',
      value: '2.3s',
      change: -12.5,
      icon: Clock,
      color: 'hsl(var(--chart-1))'
    },
    {
      name: 'Success Rate',
      value: '94.2%',
      change: 3.1,
      icon: CheckCircle,
      color: 'hsl(var(--chart-2))'
    },
    {
      name: 'Throughput',
      value: '47/hr',
      change: 8.7,
      icon: Zap,
      color: 'hsl(var(--chart-3))'
    },
    {
      name: 'Error Rate',
      value: '5.8%',
      change: -2.3,
      icon: AlertTriangle,
      color: 'hsl(var(--chart-4))'
    },
  ];

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-muted-foreground';
  };

  const getChangeIcon = (change: number) => {
    return change > 0 ? TrendingUp : TrendingUp;
  };

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {performanceMetrics.map((metric) => {
          const Icon = metric.icon;
          const ChangeIcon = getChangeIcon(metric.change);
          
          return (
            <Card key={metric.name} className="animate-fade-in">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <Icon className="h-5 w-5" style={{ color: metric.color }} />
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${getChangeColor(metric.change)}`}
                  >
                    <ChangeIcon className="h-3 w-3 mr-1" />
                    {Math.abs(metric.change)}%
                  </Badge>
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <div className="text-sm text-muted-foreground">{metric.name}</div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Task Volume Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="tasksCompleted" 
                      stroke="hsl(var(--chart-1))" 
                      strokeWidth={2}
                      name="Completed"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="tasksCreated" 
                      stroke="hsl(var(--chart-2))" 
                      strokeWidth={2}
                      name="Created"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Success Rate & Execution Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px'
                      }}
                    />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="successRate" 
                      stroke="hsl(var(--chart-2))" 
                      strokeWidth={2}
                      name="Success Rate %"
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="avgExecutionTime" 
                      stroke="hsl(var(--chart-3))" 
                      strokeWidth={2}
                      name="Avg Time (s)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Patterns Tab */}
        <TabsContent value="patterns">
          <Card>
            <CardHeader>
              <CardTitle>Task Execution Patterns (24h)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={taskPatterns}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }}
                  />
                  <Bar dataKey="workflowTasks" stackId="a" fill="hsl(var(--chart-1))" name="Workflow" />
                  <Bar dataKey="computationTasks" stackId="a" fill="hsl(var(--chart-2))" name="Computation" />
                  <Bar dataKey="apiTasks" stackId="a" fill="hsl(var(--chart-3))" name="API Tasks" />
                  <Bar dataKey="analysisTask" stackId="a" fill="hsl(var(--chart-4))" name="Analysis" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Distribution Tab */}
        <TabsContent value="distribution">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Task Type Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={taskTypeDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {taskTypeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resource Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px'
                      }}
                    />
                    <Bar dataKey="cpuAvg" fill="hsl(var(--chart-1))" name="CPU %" />
                    <Bar dataKey="memoryAvg" fill="hsl(var(--chart-2))" name="Memory %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Performance Bottleneck Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Critical Path Analysis</h4>
                    <p className="text-sm text-muted-foreground">
                      Workflow tasks taking 2.3x longer than expected during peak hours (2-4 PM)
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Resource Constraints</h4>
                    <p className="text-sm text-muted-foreground">
                      Memory utilization peaks at 78% during computation-heavy tasks
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Optimization Opportunities</h4>
                    <p className="text-sm text-muted-foreground">
                      Auto-scaling could reduce response time by 35% during traffic spikes
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;