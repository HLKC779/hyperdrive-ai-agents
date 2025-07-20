import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Database, 
  Cpu, 
  Network, 
  Shield, 
  BarChart3, 
  Settings, 
  Users,
  MessageSquare,
  Zap,
  Activity,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowRight,
  Code,
  Search,
  Globe
} from 'lucide-react';

const Dashboard = () => {
  const systemMetrics = {
    activeAgents: 12,
    totalTasks: 1247,
    completionRate: 94.7,
    responseTime: 1.2,
    memoryUsage: 73,
    cpuUsage: 45
  };

  const agentTypes = [
    { name: 'Research Agent', count: 3, status: 'active', performance: 96 },
    { name: 'Code Generation Agent', count: 2, status: 'active', performance: 92 },
    { name: 'Data Analysis Agent', count: 4, status: 'active', performance: 98 },
    { name: 'NLP Processing Agent', count: 2, status: 'active', performance: 89 },
    { name: 'Multi-Modal Agent', count: 1, status: 'idle', performance: 87 }
  ];

  const recentTasks = [
    { id: 1, task: 'Natural Language Query Processing', agent: 'NLP-Agent-01', status: 'completed', duration: '2.3s' },
    { id: 2, task: 'Code Review and Optimization', agent: 'Code-Agent-01', status: 'processing', duration: '15.7s' },
    { id: 3, task: 'Market Research Analysis', agent: 'Research-Agent-02', status: 'completed', duration: '45.2s' },
    { id: 4, task: 'Image Content Analysis', agent: 'Multi-Modal-01', status: 'queued', duration: '-' }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">AI Agent System</h1>
            <p className="text-muted-foreground">Advanced Scalable Multi-Agent Platform</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              System Config
            </Button>
            <Button size="sm">
              <Zap className="h-4 w-4 mr-2" />
              Deploy Agent
            </Button>
          </div>
        </div>

        {/* System Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemMetrics.activeAgents}</div>
              <p className="text-xs text-muted-foreground">
                +2 from last hour
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasks Processed</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemMetrics.totalTasks.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemMetrics.completionRate}%</div>
              <p className="text-xs text-muted-foreground">
                +2.3% from yesterday
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemMetrics.responseTime}s</div>
              <p className="text-xs text-muted-foreground">
                -0.3s improvement
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="agents">Agents</TabsTrigger>
            <TabsTrigger value="memory">Memory</TabsTrigger>
            <TabsTrigger value="reasoning">Reasoning</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* System Resources */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cpu className="h-5 w-5" />
                    System Resources
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Memory Usage</span>
                      <span>{systemMetrics.memoryUsage}%</span>
                    </div>
                    <Progress value={systemMetrics.memoryUsage} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>CPU Usage</span>
                      <span>{systemMetrics.cpuUsage}%</span>
                    </div>
                    <Progress value={systemMetrics.cpuUsage} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Recent Tasks */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Recent Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentTasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{task.task}</p>
                          <p className="text-xs text-muted-foreground">{task.agent}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={task.status === 'completed' ? 'default' : 
                                   task.status === 'processing' ? 'secondary' : 'outline'}
                          >
                            {task.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{task.duration}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Agent Performance Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Agent Performance Overview
                </CardTitle>
                <CardDescription>
                  Real-time performance metrics for all active agent types
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {agentTypes.map((agent, index) => (
                    <div key={index} className="p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{agent.name}</h4>
                        <Badge variant={agent.status === 'active' ? 'default' : 'secondary'}>
                          {agent.status}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Active Instances</span>
                          <span>{agent.count}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Performance</span>
                          <span>{agent.performance}%</span>
                        </div>
                        <Progress value={agent.performance} className="h-1.5" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agents">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Agent Management
                  </span>
                  <Link to="/agents">
                    <Button variant="outline" size="sm">
                      View Full Page <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardTitle>
                <CardDescription>Configure and monitor your AI agents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Research Agent</h4>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">3 instances running</p>
                    <Progress value={96} className="h-2 mt-2" />
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Code Agent</h4>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">2 instances running</p>
                    <Progress value={92} className="h-2 mt-2" />
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Data Agent</h4>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">4 instances running</p>
                    <Progress value={98} className="h-2 mt-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="memory">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Memory Systems
                  </span>
                  <Link to="/memory">
                    <Button variant="outline" size="sm">
                      View Full Page <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardTitle>
                <CardDescription>Hybrid memory architecture management</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Short-term Memory</h4>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Usage</span>
                      <span>2.4GB / 8GB</span>
                    </div>
                    <Progress value={30} className="h-2" />
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Knowledge Graph</h4>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Nodes</span>
                      <span>15,420</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reasoning">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Reasoning Engine
                  </span>
                  <Link to="/reasoning">
                    <Button variant="outline" size="sm">
                      View Full Page <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardTitle>
                <CardDescription>Advanced reasoning and decision making</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Active Reasoning Tasks</h4>
                    <p className="text-2xl font-bold">8</p>
                    <p className="text-sm text-muted-foreground">Currently processing</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Confidence Score</h4>
                    <p className="text-2xl font-bold">94.2%</p>
                    <p className="text-sm text-muted-foreground">Average confidence</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tools">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Tool Integration
                  </span>
                  <Link to="/tools">
                    <Button variant="outline" size="sm">
                      View Full Page <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardTitle>
                <CardDescription>Manage external tools and APIs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Search className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">Web Search API</p>
                      <p className="text-sm text-muted-foreground">Active</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Code className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">Code Executor</p>
                      <p className="text-sm text-muted-foreground">Active</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Database className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="font-medium">Vector DB</p>
                      <p className="text-sm text-muted-foreground">Error</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monitoring">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    System Monitoring
                  </span>
                  <Link to="/execution">
                    <Button variant="outline" size="sm">
                      View Execution Engine <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardTitle>
                <CardDescription>Performance analytics and system health</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">System Health</h4>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">All systems operational</span>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Active Tasks</h4>
                    <p className="text-2xl font-bold">23</p>
                    <p className="text-sm text-muted-foreground">Currently running</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;