import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bot, 
  Zap, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Settings, 
  Activity,
  Bug,
  Wrench,
  Shield,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { toast } from 'sonner';

interface Agent {
  id: string;
  name: string;
  type: 'monitor' | 'debug' | 'test' | 'finetune' | 'recovery';
  status: 'active' | 'idle' | 'working' | 'error';
  lastAction: string;
  successRate: number;
  tasksCompleted: number;
  icon: React.ReactNode;
  description: string;
}

interface SystemMetrics {
  overallHealth: number;
  activeIssues: number;
  resolvedIssues: number;
  systemUptime: number;
  lastTestRun: string;
}

interface Task {
  id: string;
  agentId: string;
  type: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  completedAt?: string;
  result?: string;
}

export default function AutomatedAgentSystem() {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: 'monitor-1',
      name: 'System Monitor Alpha',
      type: 'monitor',
      status: 'active',
      lastAction: 'Monitoring RAG system health',
      successRate: 94,
      tasksCompleted: 147,
      icon: <Activity className="h-4 w-4" />,
      description: 'Continuously monitors system health and detects anomalies'
    },
    {
      id: 'debug-1',
      name: 'Debug Agent Beta',
      type: 'debug',
      status: 'working',
      lastAction: 'Analyzing user_id constraint errors',
      successRate: 89,
      tasksCompleted: 73,
      icon: <Bug className="h-4 w-4" />,
      description: 'Identifies and fixes system errors automatically'
    },
    {
      id: 'test-1',
      name: 'Test Automation Gamma',
      type: 'test',
      status: 'idle',
      lastAction: 'Completed QC test suite',
      successRate: 96,
      tasksCompleted: 234,
      icon: <CheckCircle className="h-4 w-4" />,
      description: 'Runs automated tests and validates system functionality'
    },
    {
      id: 'finetune-1',
      name: 'Performance Tuner Delta',
      type: 'finetune',
      status: 'active',
      lastAction: 'Optimizing vector search parameters',
      successRate: 87,
      tasksCompleted: 56,
      icon: <Settings className="h-4 w-4" />,
      description: 'Fine-tunes system parameters for optimal performance'
    },
    {
      id: 'recovery-1',
      name: 'Recovery Agent Epsilon',
      type: 'recovery',
      status: 'idle',
      lastAction: 'System stable, no recovery needed',
      successRate: 98,
      tasksCompleted: 12,
      icon: <Shield className="h-4 w-4" />,
      description: 'Handles system recovery and failover operations'
    }
  ]);

  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    overallHealth: 78,
    activeIssues: 3,
    resolvedIssues: 47,
    systemUptime: 99.2,
    lastTestRun: '2 minutes ago'
  });

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      agentId: 'debug-1',
      type: 'Error Fix',
      description: 'Fix user_id constraint violations in MCP server',
      status: 'running',
      priority: 'high',
      createdAt: '10:30 AM'
    },
    {
      id: '2',
      agentId: 'debug-1',
      type: 'Error Fix',
      description: 'Resolve vector search function name mismatch',
      status: 'completed',
      priority: 'high',
      createdAt: '10:25 AM',
      completedAt: '10:28 AM',
      result: 'Successfully updated function calls'
    },
    {
      id: '3',
      agentId: 'test-1',
      type: 'Test Suite',
      description: 'Run comprehensive QC test suite',
      status: 'pending',
      priority: 'medium',
      createdAt: '10:32 AM'
    }
  ]);

  const [isSystemRunning, setIsSystemRunning] = useState(true);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'working': return 'bg-blue-500';
      case 'idle': return 'bg-gray-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const handleAgentAction = (agentId: string, action: string) => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId 
        ? { ...agent, status: 'working', lastAction: action }
        : agent
    ));

    // Create a new task
    const newTask: Task = {
      id: Date.now().toString(),
      agentId,
      type: action,
      description: `${action} initiated by user`,
      status: 'running',
      priority: 'medium',
      createdAt: new Date().toLocaleTimeString()
    };

    setTasks(prev => [newTask, ...prev]);
    toast.success(`${action} started for agent ${agentId}`);

    // Simulate task completion
    setTimeout(() => {
      setTasks(prev => prev.map(task => 
        task.id === newTask.id 
          ? { ...task, status: 'completed', completedAt: new Date().toLocaleTimeString(), result: 'Task completed successfully' }
          : task
      ));
      setAgents(prev => prev.map(agent => 
        agent.id === agentId 
          ? { ...agent, status: 'active', tasksCompleted: agent.tasksCompleted + 1 }
          : agent
      ));
    }, 3000);
  };

  const runSystemDiagnostics = () => {
    toast.info('Running comprehensive system diagnostics...');
    
    // Trigger diagnostics for all agents
    agents.forEach(agent => {
      handleAgentAction(agent.id, 'System Diagnostics');
    });

    // Update system metrics
    setTimeout(() => {
      setSystemMetrics(prev => ({
        ...prev,
        overallHealth: Math.min(prev.overallHealth + 5, 100),
        lastTestRun: 'Just now'
      }));
      toast.success('System diagnostics completed');
    }, 5000);
  };

  const toggleSystemStatus = () => {
    setIsSystemRunning(!isSystemRunning);
    const action = isSystemRunning ? 'paused' : 'resumed';
    toast.info(`Agent system ${action}`);
  };

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      // Update agent statuses randomly
      setAgents(prev => prev.map(agent => {
        const random = Math.random();
        if (random > 0.9 && agent.status === 'idle') {
          return { ...agent, status: 'active', lastAction: 'Automated monitoring check' };
        }
        return agent;
      }));

      // Update system metrics
      setSystemMetrics(prev => ({
        ...prev,
        systemUptime: Math.min(prev.systemUptime + 0.01, 100)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Automated Agent System</h1>
          <p className="text-muted-foreground">
            AI-powered system maintenance, testing, and error resolution
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={toggleSystemStatus}
            variant={isSystemRunning ? "destructive" : "default"}
            className="flex items-center space-x-2"
          >
            {isSystemRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            <span>{isSystemRunning ? 'Pause System' : 'Resume System'}</span>
          </Button>
          <Button onClick={runSystemDiagnostics} className="flex items-center space-x-2">
            <Zap className="h-4 w-4" />
            <span>Run Diagnostics</span>
          </Button>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">System Health</p>
                <p className="text-2xl font-bold">{systemMetrics.overallHealth}%</p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
            <Progress value={systemMetrics.overallHealth} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Issues</p>
                <p className="text-2xl font-bold text-red-500">{systemMetrics.activeIssues}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Resolved Issues</p>
                <p className="text-2xl font-bold text-green-500">{systemMetrics.resolvedIssues}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Uptime</p>
                <p className="text-2xl font-bold">{systemMetrics.systemUptime.toFixed(1)}%</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="agents" className="space-y-4">
        <TabsList>
          <TabsTrigger value="agents">Active Agents</TabsTrigger>
          <TabsTrigger value="tasks">Task Queue</TabsTrigger>
          <TabsTrigger value="logs">System Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent) => (
              <Card key={agent.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {agent.icon}
                      <CardTitle className="text-sm">{agent.name}</CardTitle>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(agent.status)}`} />
                  </div>
                  <Badge variant="outline" className="w-fit">
                    {agent.type}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-xs text-muted-foreground">{agent.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Success Rate</span>
                      <span>{agent.successRate}%</span>
                    </div>
                    <Progress value={agent.successRate} className="h-2" />
                  </div>

                  <div className="text-xs space-y-1">
                    <p><span className="font-medium">Status:</span> {agent.status}</p>
                    <p><span className="font-medium">Last Action:</span> {agent.lastAction}</p>
                    <p><span className="font-medium">Tasks Completed:</span> {agent.tasksCompleted}</p>
                  </div>

                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleAgentAction(agent.id, 'Manual Scan')}
                      disabled={!isSystemRunning}
                    >
                      <Wrench className="h-3 w-3 mr-1" />
                      Scan
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleAgentAction(agent.id, 'System Repair')}
                      disabled={!isSystemRunning}
                    >
                      <RotateCcw className="h-3 w-3 mr-1" />
                      Repair
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle>Task Queue</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <Badge variant={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                          <span className="font-medium">{task.type}</span>
                          <Badge variant="outline">{task.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                        <p className="text-xs text-muted-foreground">
                          Created: {task.createdAt}
                          {task.completedAt && ` • Completed: ${task.completedAt}`}
                        </p>
                        {task.result && (
                          <p className="text-xs text-green-600 mt-1">{task.result}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          Agent: {agents.find(a => a.id === task.agentId)?.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>System Activity Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-2 font-mono text-xs">
                  <div className="text-green-600">[10:32:15] Debug Agent Beta: Fixed user_id constraint in MCP server</div>
                  <div className="text-blue-600">[10:31:42] System Monitor Alpha: Detected anomaly in RAG system</div>
                  <div className="text-green-600">[10:31:20] Test Automation Gamma: QC test suite completed - 8/10 passed</div>
                  <div className="text-yellow-600">[10:30:55] Performance Tuner Delta: Optimizing vector search parameters</div>
                  <div className="text-green-600">[10:30:30] Debug Agent Beta: UUID format issue resolved</div>
                  <div className="text-blue-600">[10:29:15] System Monitor Alpha: Health check completed - 78% overall</div>
                  <div className="text-red-600">[10:28:45] System Alert: RAG connection failure detected</div>
                  <div className="text-green-600">[10:28:12] Recovery Agent Epsilon: System recovery initiated</div>
                  <div className="text-blue-600">[10:27:30] Test Automation Gamma: Automated test cycle started</div>
                  <div className="text-green-600">[10:26:55] Debug Agent Beta: Memory storage optimization completed</div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}