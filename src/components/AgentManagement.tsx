import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AgentChat from './AgentChat';
import TechnicalSupportAgent from './TechnicalSupportAgent';
import { 
  Brain, 
  Plus, 
  Play, 
  Pause, 
  RotateCcw, 
  Settings,
  Activity,
  Clock,
  Zap,
  AlertTriangle,
  CheckCircle2,
  MessageCircle,
  Wrench
} from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'idle' | 'busy' | 'error';
  performance: number;
  tasksCompleted: number;
  avgResponseTime: number;
  memoryUsage: number;
  lastActivity: string;
  capabilities: string[];
}

const AgentManagement = () => {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: 'agent-001',
      name: 'Research Agent Alpha',
      type: 'Research',
      status: 'active',
      performance: 96,
      tasksCompleted: 247,
      avgResponseTime: 2.3,
      memoryUsage: 45,
      lastActivity: '2 minutes ago',
      capabilities: ['Web Search', 'Data Analysis', 'Report Generation', 'Technical Documentation']
    },
    {
      id: 'agent-002',
      name: 'Code Generation Beta',
      type: 'Development',
      status: 'busy',
      performance: 92,
      tasksCompleted: 189,
      avgResponseTime: 5.7,
      memoryUsage: 72,
      lastActivity: 'Active now',
      capabilities: ['Code Generation', 'Code Review', 'Testing', 'Debugging', 'Technical Support']
    },
    {
      id: 'agent-003',
      name: 'NLP Processor Gamma',
      type: 'Language',
      status: 'idle',
      performance: 89,
      tasksCompleted: 356,
      avgResponseTime: 1.8,
      memoryUsage: 32,
      lastActivity: '15 minutes ago',
      capabilities: ['Text Analysis', 'Sentiment Analysis', 'Translation', 'User Support']
    },
    {
      id: 'agent-004',
      name: 'Technical Support Delta',
      type: 'Support',
      status: 'active',
      performance: 94,
      tasksCompleted: 412,
      avgResponseTime: 3.2,
      memoryUsage: 56,
      lastActivity: '1 minute ago',
      capabilities: ['Issue Resolution', 'Troubleshooting', 'User Assistance', 'Knowledge Base']
    }
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const getStatusIcon = (status: Agent['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'busy':
        return <Activity className="h-4 w-4 text-blue-500" />;
      case 'idle':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusVariant = (status: Agent['status']) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'busy':
        return 'secondary';
      case 'idle':
        return 'outline';
      case 'error':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const handleAgentAction = (agentId: string, action: 'start' | 'pause' | 'restart') => {
    setAgents(prev => 
      prev.map(agent => 
        agent.id === agentId 
          ? { 
              ...agent, 
              status: action === 'start' ? 'active' : action === 'pause' ? 'idle' : 'active'
            }
          : agent
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Multi-Task Agent System</h2>
          <p className="text-muted-foreground">Intelligent agents for technical support and user assistance</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Agent
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Agent</DialogTitle>
              <DialogDescription>
                Configure a new AI agent for your system
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" placeholder="Agent name" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select agent type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="research">Research Agent</SelectItem>
                    <SelectItem value="development">Development Agent</SelectItem>
                    <SelectItem value="language">Language Processing</SelectItem>
                    <SelectItem value="multimodal">Multi-Modal Agent</SelectItem>
                    <SelectItem value="analysis">Data Analysis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the agent's purpose and capabilities"
                  className="col-span-3"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(false)}>
                Create Agent
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="agents" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="agents">Agent Overview</TabsTrigger>
          <TabsTrigger value="chat">Support Chat</TabsTrigger>
          <TabsTrigger value="technical">Technical Center</TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="space-y-4">
          {/* Agent Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <Card key={agent.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{agent.name}</CardTitle>
                </div>
                <div className="flex items-center gap-1">
                  {getStatusIcon(agent.status)}
                  <Badge variant={getStatusVariant(agent.status)}>
                    {agent.status}
                  </Badge>
                </div>
              </div>
              <CardDescription>
                {agent.type} • ID: {agent.id}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Performance Metrics */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Performance</p>
                  <p className="font-semibold">{agent.performance}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Tasks Done</p>
                  <p className="font-semibold">{agent.tasksCompleted}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Avg Response</p>
                  <p className="font-semibold">{agent.avgResponseTime}s</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Memory</p>
                  <p className="font-semibold">{agent.memoryUsage}%</p>
                </div>
              </div>

              {/* Capabilities */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">Capabilities</p>
                <div className="flex flex-wrap gap-1">
                  {agent.capabilities.map((capability, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {capability}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Last Activity */}
              <div className="text-sm text-muted-foreground">
                Last activity: {agent.lastActivity}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAgentAction(agent.id, 'start')}
                  disabled={agent.status === 'active'}
                >
                  <Play className="h-3 w-3 mr-1" />
                  Start
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAgentAction(agent.id, 'pause')}
                  disabled={agent.status === 'idle'}
                >
                  <Pause className="h-3 w-3 mr-1" />
                  Pause
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAgentAction(agent.id, 'restart')}
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Restart
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => console.log(`Configuring agent ${agent.id}`)}
                >
                  <Settings className="h-3 w-3" />
                </Button>
              </div>

              {/* View Details Button */}
              <div className="pt-2">
                <Button 
                  size="sm" 
                  variant="secondary"
                  className="w-full"
                  onClick={() => console.log(`Viewing details for agent ${agent.id}`)}
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

          {/* System Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                System Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {agents.filter(a => a.status === 'active').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Active Agents</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">
                    {agents.filter(a => a.status === 'busy').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Busy Agents</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {agents.reduce((sum, agent) => sum + agent.tasksCompleted, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Tasks</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {(agents.reduce((sum, agent) => sum + agent.performance, 0) / agents.length).toFixed(1)}%
                  </p>
                  <p className="text-sm text-muted-foreground">Avg Performance</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat">
          <AgentChat agents={agents} />
        </TabsContent>

        <TabsContent value="technical">
          <TechnicalSupportAgent />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AgentManagement;