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
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Zap,
  Cpu,
  MemoryStick,
  HardDrive,
  Network,
  Plus,
  Settings,
  Filter,
  Search,
  Download,
  Activity,
  Timer,
  TrendingUp,
  Users,
  Code,
  Database,
  Globe
} from "lucide-react";

interface Task {
  id: string;
  name: string;
  type: 'workflow' | 'computation' | 'api' | 'analysis' | 'training';
  status: 'running' | 'queued' | 'completed' | 'failed' | 'paused';
  priority: 'low' | 'medium' | 'high' | 'critical';
  progress: number;
  startTime: string;
  estimatedCompletion: string;
  resourceUsage: {
    cpu: number;
    memory: number;
    storage: number;
    network: number;
  };
  assignedAgent: string;
  description: string;
  logs: string[];
}

interface SystemResource {
  name: string;
  current: number;
  total: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
}

const mockTasks: Task[] = [
  {
    id: '1',
    name: 'Customer Data Analysis',
    type: 'analysis',
    status: 'running',
    priority: 'high',
    progress: 67,
    startTime: '2 hours ago',
    estimatedCompletion: '45 minutes',
    resourceUsage: { cpu: 45, memory: 62, storage: 23, network: 12 },
    assignedAgent: 'Agent-Analytics-01',
    description: 'Processing customer behavior patterns from Q4 data',
    logs: ['Started data ingestion', 'Applied preprocessing filters', 'Running ML analysis']
  },
  {
    id: '2',
    name: 'Model Training Pipeline',
    type: 'training',
    status: 'running',
    priority: 'critical',
    progress: 23,
    startTime: '6 hours ago',
    estimatedCompletion: '4 hours',
    resourceUsage: { cpu: 89, memory: 78, storage: 67, network: 34 },
    assignedAgent: 'Agent-ML-02',
    description: 'Training new recommendation model with updated dataset',
    logs: ['Initialized training environment', 'Loaded dataset (2.3M samples)', 'Started gradient descent']
  },
  {
    id: '3',
    name: 'API Integration Test',
    type: 'api',
    status: 'completed',
    priority: 'medium',
    progress: 100,
    startTime: '4 hours ago',
    estimatedCompletion: 'Completed',
    resourceUsage: { cpu: 0, memory: 0, storage: 0, network: 0 },
    assignedAgent: 'Agent-API-03',
    description: 'Testing new payment gateway integration endpoints',
    logs: ['Connected to test environment', 'Ran 150 test cases', 'All tests passed successfully']
  },
  {
    id: '4',
    name: 'Document Processing Workflow',
    type: 'workflow',
    status: 'queued',
    priority: 'low',
    progress: 0,
    startTime: 'Not started',
    estimatedCompletion: '2 hours',
    resourceUsage: { cpu: 0, memory: 0, storage: 0, network: 0 },
    assignedAgent: 'Agent-Doc-01',
    description: 'Process and categorize incoming legal documents',
    logs: ['Task queued, waiting for resources']
  },
  {
    id: '5',
    name: 'Real-time Sentiment Monitor',
    type: 'computation',
    status: 'failed',
    priority: 'medium',
    progress: 34,
    startTime: '1 hour ago',
    estimatedCompletion: 'Failed',
    resourceUsage: { cpu: 0, memory: 0, storage: 0, network: 0 },
    assignedAgent: 'Agent-NLP-04',
    description: 'Monitor social media sentiment for brand mentions',
    logs: ['Started data collection', 'API rate limit exceeded', 'Task failed - retrying in 10 minutes']
  }
];

const mockResources: SystemResource[] = [
  { name: 'CPU Usage', current: 68, total: 100, unit: '%', status: 'warning' },
  { name: 'Memory', current: 12.4, total: 32, unit: 'GB', status: 'normal' },
  { name: 'Storage', current: 2.1, total: 10, unit: 'TB', status: 'normal' },
  { name: 'Network I/O', current: 450, total: 1000, unit: 'Mbps', status: 'normal' },
  { name: 'Active Agents', current: 8, total: 12, unit: '', status: 'normal' },
  { name: 'Queue Length', current: 23, total: 100, unit: 'tasks', status: 'warning' }
];

const ExecutionEngine = () => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'running': return <Play className="h-4 w-4 text-green-500" />;
      case 'queued': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'paused': return <Pause className="h-4 w-4 text-gray-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusVariant = (status: Task['status']) => {
    switch (status) {
      case 'running': return 'default' as const;
      case 'queued': return 'secondary' as const;
      case 'completed': return 'outline' as const;
      case 'failed': return 'destructive' as const;
      case 'paused': return 'secondary' as const;
      default: return 'secondary' as const;
    }
  };

  const getPriorityVariant = (priority: Task['priority']) => {
    switch (priority) {
      case 'critical': return 'destructive' as const;
      case 'high': return 'default' as const;
      case 'medium': return 'secondary' as const;
      case 'low': return 'outline' as const;
      default: return 'secondary' as const;
    }
  };

  const getTypeIcon = (type: Task['type']) => {
    const icons = {
      workflow: Activity,
      computation: Cpu,
      api: Globe,
      analysis: TrendingUp,
      training: Database
    };
    return icons[type] || Activity;
  };

  const getResourceStatus = (resource: SystemResource) => {
    const percentage = (resource.current / resource.total) * 100;
    if (percentage > 80) return 'critical';
    if (percentage > 60) return 'warning';
    return 'normal';
  };

  const getResourceColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-500';
      case 'warning': return 'text-yellow-500';
      case 'normal': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const handleTaskAction = (taskId: string, action: 'pause' | 'resume' | 'stop' | 'restart') => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        switch (action) {
          case 'pause':
            return { ...task, status: 'paused' as const };
          case 'resume':
            return { ...task, status: 'running' as const };
          case 'stop':
            return { ...task, status: 'failed' as const, progress: 0 };
          case 'restart':
            return { ...task, status: 'queued' as const, progress: 0 };
          default:
            return task;
        }
      }
      return task;
    }));
  };

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = selectedStatus === 'all' || task.status === selectedStatus;
    const matchesType = selectedType === 'all' || task.type === selectedType;
    const matchesSearch = task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });

  const taskStats = {
    total: tasks.length,
    running: tasks.filter(t => t.status === 'running').length,
    queued: tasks.filter(t => t.status === 'queued').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    failed: tasks.filter(t => t.status === 'failed').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Execution Engine</h1>
          <p className="text-muted-foreground">
            Monitor and manage task execution, resource usage, and system performance
          </p>
        </div>
        <Dialog open={isCreateTaskOpen} onOpenChange={setIsCreateTaskOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
              <DialogDescription>
                Define a new task for execution by the AI agents
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="task-name">Task Name</Label>
                <Input id="task-name" placeholder="Enter task name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="task-type">Type</Label>
                  <select id="task-type" className="w-full border rounded-md px-3 py-2">
                    <option value="workflow">Workflow</option>
                    <option value="computation">Computation</option>
                    <option value="api">API Task</option>
                    <option value="analysis">Analysis</option>
                    <option value="training">Training</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <select id="priority" className="w-full border rounded-md px-3 py-2">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Describe the task..." rows={3} />
              </div>
              <Button className="w-full">Create and Queue Task</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="tasks" className="space-y-6">
        <TabsList>
          <TabsTrigger value="tasks">Active Tasks</TabsTrigger>
          <TabsTrigger value="resources">System Resources</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="queue">Task Queue</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-6">
          {/* Task Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{taskStats.total}</p>
                    <p className="text-sm text-muted-foreground">Total Tasks</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Play className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">{taskStats.running}</p>
                    <p className="text-sm text-muted-foreground">Running</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="text-2xl font-bold">{taskStats.queued}</p>
                    <p className="text-sm text-muted-foreground">Queued</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{taskStats.completed}</p>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <XCircle className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="text-2xl font-bold">{taskStats.failed}</p>
                    <p className="text-sm text-muted-foreground">Failed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border rounded-md px-3 py-2 bg-background"
            >
              <option value="all">All Status</option>
              <option value="running">Running</option>
              <option value="queued">Queued</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="paused">Paused</option>
            </select>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="border rounded-md px-3 py-2 bg-background"
            >
              <option value="all">All Types</option>
              <option value="workflow">Workflow</option>
              <option value="computation">Computation</option>
              <option value="api">API Task</option>
              <option value="analysis">Analysis</option>
              <option value="training">Training</option>
            </select>
          </div>

          {/* Task List */}
          <div className="space-y-4">
            {filteredTasks.map((task) => {
              const TypeIcon = getTypeIcon(task.type);
              return (
                <Card key={task.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <TypeIcon className="h-5 w-5 text-primary" />
                        <div>
                          <CardTitle className="text-lg">{task.name}</CardTitle>
                          <CardDescription>{task.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getPriorityVariant(task.priority)}>
                          {task.priority}
                        </Badge>
                        <Badge variant={getStatusVariant(task.status)}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(task.status)}
                            <span>{task.status}</span>
                          </div>
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{task.progress}%</span>
                        </div>
                        <Progress value={task.progress} className="h-2" />
                      </div>
                      <div className="text-sm">
                        <p className="text-muted-foreground">Started: {task.startTime}</p>
                        <p className="text-muted-foreground">ETA: {task.estimatedCompletion}</p>
                        <p className="text-muted-foreground">Agent: {task.assignedAgent}</p>
                      </div>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span>CPU:</span>
                          <span>{task.resourceUsage.cpu}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Memory:</span>
                          <span>{task.resourceUsage.memory}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Network:</span>
                          <span>{task.resourceUsage.network}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        {task.status === 'running' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTaskAction(task.id, 'pause')}
                          >
                            <Pause className="h-3 w-3 mr-1" />
                            Pause
                          </Button>
                        )}
                        {task.status === 'paused' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTaskAction(task.id, 'resume')}
                          >
                            <Play className="h-3 w-3 mr-1" />
                            Resume
                          </Button>
                        )}
                        {['running', 'paused'].includes(task.status) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTaskAction(task.id, 'stop')}
                          >
                            <Square className="h-3 w-3 mr-1" />
                            Stop
                          </Button>
                        )}
                        {['failed', 'completed'].includes(task.status) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTaskAction(task.id, 'restart')}
                          >
                            <RotateCcw className="h-3 w-3 mr-1" />
                            Restart
                          </Button>
                        )}
                      </div>
                      <Button variant="ghost" size="sm">
                        View Logs
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockResources.map((resource, index) => {
              const percentage = (resource.current / resource.total) * 100;
              const status = getResourceStatus(resource);
              return (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{resource.name}</span>
                      <Badge variant={status === 'critical' ? 'destructive' : status === 'warning' ? 'secondary' : 'outline'}>
                        {status}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Usage</span>
                      <span>
                        {resource.current}{resource.unit} / {resource.total}{resource.unit}
                      </span>
                    </div>
                    <Progress value={percentage} className="h-3" />
                    <p className={`text-sm font-medium ${getResourceColor(status)}`}>
                      {percentage.toFixed(1)}% utilized
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Task Completion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 border border-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Performance metrics chart</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resource Usage Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 border border-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Activity className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Resource usage timeline</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="queue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Task Queue Management</CardTitle>
              <CardDescription>
                Monitor and manage the execution queue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks.filter(t => t.status === 'queued').map((task, index) => (
                  <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium">#{index + 1}</span>
                      <div>
                        <p className="font-medium">{task.name}</p>
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={getPriorityVariant(task.priority)}>
                        {task.priority}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Priority Up
                      </Button>
                    </div>
                  </div>
                ))}
                {tasks.filter(t => t.status === 'queued').length === 0 && (
                  <div className="text-center py-8">
                    <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No tasks in queue</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExecutionEngine;