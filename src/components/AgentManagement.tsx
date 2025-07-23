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
  Wrench,
  Cog,
  Rocket
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
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isSystemConfigOpen, setIsSystemConfigOpen] = useState(false);
  const [newAgentForm, setNewAgentForm] = useState({ name: '', type: '', description: '' });

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

  const handleViewDetails = (agent: Agent) => {
    setSelectedAgent(agent);
    setIsDetailsDialogOpen(true);
  };

  const handleConfigureAgent = (agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    if (agent) {
      alert(`Configuring ${agent.name} - Settings panel would open here`);
    }
  };

  const handleCreateAgent = () => {
    if (newAgentForm.name && newAgentForm.type) {
      const newAgent: Agent = {
        id: `agent-${Date.now()}`,
        name: newAgentForm.name,
        type: newAgentForm.type,
        status: 'idle',
        performance: Math.floor(Math.random() * 20) + 80,
        tasksCompleted: 0,
        avgResponseTime: Math.random() * 2 + 1,
        memoryUsage: Math.floor(Math.random() * 30) + 20,
        lastActivity: 'Just created',
        capabilities: newAgentForm.type === 'Research' ? ['Web Search', 'Data Analysis'] : 
                     newAgentForm.type === 'Development' ? ['Code Generation', 'Testing'] :
                     newAgentForm.type === 'Language' ? ['Text Analysis', 'Translation'] :
                     ['General Tasks']
      };

      setAgents(prev => [...prev, newAgent]);
      setNewAgentForm({ name: '', type: '', description: '' });
      setIsCreateDialogOpen(false);
    }
  };

  const handleSystemConfig = () => {
    setIsSystemConfigOpen(true);
  };

  const handleDeployAgent = () => {
    // Simulate deployment process
    const randomAgent = agents[Math.floor(Math.random() * agents.length)];
    if (randomAgent) {
      // Update agent status to show deployment
      setAgents(prev => 
        prev.map(agent => 
          agent.id === randomAgent.id 
            ? { ...agent, status: 'active' as const, lastActivity: 'Deployed now' }
            : agent
        )
      );
      alert(`Successfully deployed agent: ${randomAgent.name}`);
    } else {
      alert('No agents available for deployment. Please create an agent first.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Multi-Task Agent System</h2>
          <p className="text-muted-foreground">Intelligent agents for technical support and user assistance</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleSystemConfig}>
            <Cog className="h-4 w-4 mr-2" />
            System Config
          </Button>
          <Button onClick={handleDeployAgent}>
            <Rocket className="h-4 w-4 mr-2" />
            Deploy Agent
          </Button>
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
                  <Input 
                    id="name" 
                    placeholder="Agent name" 
                    className="col-span-3" 
                    value={newAgentForm.name}
                    onChange={(e) => setNewAgentForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Type
                  </Label>
                  <Select 
                    value={newAgentForm.type}
                    onValueChange={(value) => setNewAgentForm(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select agent type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Research">Research Agent</SelectItem>
                      <SelectItem value="Development">Development Agent</SelectItem>
                      <SelectItem value="Language">Language Processing</SelectItem>
                      <SelectItem value="Multimodal">Multi-Modal Agent</SelectItem>
                      <SelectItem value="Analysis">Data Analysis</SelectItem>
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
                    value={newAgentForm.description}
                    onChange={(e) => setNewAgentForm(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateAgent}>
                  Create Agent
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
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
                  onClick={() => handleConfigureAgent(agent.id)}
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
                  onClick={() => handleViewDetails(agent)}
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

      {/* Agent Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              {selectedAgent?.name} - Detailed Information
            </DialogTitle>
            <DialogDescription>
              Complete details and performance metrics for this agent
            </DialogDescription>
          </DialogHeader>
          {selectedAgent && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Agent ID</Label>
                  <p className="text-sm text-muted-foreground">{selectedAgent.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Type</Label>
                  <p className="text-sm text-muted-foreground">{selectedAgent.type}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(selectedAgent.status)}
                    <Badge variant={getStatusVariant(selectedAgent.status)}>
                      {selectedAgent.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Last Activity</Label>
                  <p className="text-sm text-muted-foreground">{selectedAgent.lastActivity}</p>
                </div>
              </div>

              {/* Performance Metrics */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Performance Metrics</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{selectedAgent.performance}%</p>
                        <p className="text-sm text-muted-foreground">Overall Performance</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{selectedAgent.tasksCompleted}</p>
                        <p className="text-sm text-muted-foreground">Tasks Completed</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-orange-600">{selectedAgent.avgResponseTime}s</p>
                        <p className="text-sm text-muted-foreground">Avg Response Time</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">{selectedAgent.memoryUsage}%</p>
                        <p className="text-sm text-muted-foreground">Memory Usage</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Capabilities */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Capabilities</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedAgent.capabilities.map((capability, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {capability}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between pt-4">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleAgentAction(selectedAgent.id, 'start')}
                    disabled={selectedAgent.status === 'active'}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Agent
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleAgentAction(selectedAgent.id, 'pause')}
                    disabled={selectedAgent.status === 'idle'}
                  >
                    <Pause className="h-4 w-4 mr-2" />
                    Pause Agent
                  </Button>
                </div>
                <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* System Config Dialog */}
      <Dialog open={isSystemConfigOpen} onOpenChange={setIsSystemConfigOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Cog className="h-5 w-5 text-primary" />
              System Configuration
            </DialogTitle>
            <DialogDescription>
              Configure global system settings and agent parameters
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* System Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Total Agents</Label>
                <p className="text-lg font-semibold">{agents.length}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Active Agents</Label>
                <p className="text-lg font-semibold text-green-600">
                  {agents.filter(a => a.status === 'active').length}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">System Uptime</Label>
                <p className="text-lg font-semibold">99.8%</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Memory Usage</Label>
                <p className="text-lg font-semibold">
                  {Math.round(agents.reduce((sum, agent) => sum + agent.memoryUsage, 0) / agents.length)}%
                </p>
              </div>
            </div>

            {/* Configuration Options */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Max Concurrent Agents</Label>
                <Select defaultValue="10">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 Agents</SelectItem>
                    <SelectItem value="10">10 Agents</SelectItem>
                    <SelectItem value="20">20 Agents</SelectItem>
                    <SelectItem value="unlimited">Unlimited</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Performance Threshold</Label>
                <Select defaultValue="80">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="70">70%</SelectItem>
                    <SelectItem value="80">80%</SelectItem>
                    <SelectItem value="90">90%</SelectItem>
                    <SelectItem value="95">95%</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Auto-scaling</Label>
                <Select defaultValue="enabled">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="enabled">Enabled</SelectItem>
                    <SelectItem value="disabled">Disabled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsSystemConfigOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                alert('System configuration saved successfully!');
                setIsSystemConfigOpen(false);
              }}>
                Save Configuration
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AgentManagement;