import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import KnowledgeGraphFlow from './KnowledgeGraphFlow';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Network, 
  Brain, 
  TreePine, 
  GitBranch, 
  Target, 
  Zap,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  RotateCcw,
  ArrowLeft
} from 'lucide-react';

interface ReasoningProcess {
  id: string;
  name: string;
  type: 'causal' | 'probabilistic' | 'symbolic' | 'neural';
  status: 'running' | 'completed' | 'failed' | 'queued';
  progress: number;
  confidence: number;
  startTime: string;
  estimatedCompletion: string;
  steps: ReasoningStep[];
}

interface ReasoningStep {
  id: string;
  description: string;
  status: 'completed' | 'current' | 'pending';
  confidence: number;
  evidence: string[];
}

interface DecisionNode {
  id: string;
  question: string;
  confidence: number;
  evidence: number;
  children: DecisionNode[];
  decision?: string;
}

const ReasoningEngine = () => {
  const [selectedProcess, setSelectedProcess] = useState<string | null>(null);
  const [isCreatingReasoning, setIsCreatingReasoning] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [processingActions, setProcessingActions] = useState<{[key: string]: boolean}>({});
  const { toast } = useToast();

  const handleNewReasoning = async () => {
    setIsCreatingReasoning(true);
    try {
      // Simulate creating a new reasoning process
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({
        title: "New Reasoning Process Created",
        description: "Started 'Customer Behavior Analysis' with neural reasoning type.",
      });
    } catch (error) {
      toast({
        title: "Failed to Create Reasoning",
        description: "Unable to start new reasoning process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingReasoning(false);
    }
  };

  const handleReset = async () => {
    setIsResetting(true);
    try {
      // Simulate reset process
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSelectedProcess(null);
      toast({
        title: "Reasoning Engine Reset",
        description: "All processes paused and system state cleared successfully.",
      });
    } catch (error) {
      toast({
        title: "Reset Failed",
        description: "Failed to reset reasoning engine. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };

  const handlePauseProcess = async (processId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent card click
    setProcessingActions(prev => ({ ...prev, [processId]: true }));
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Process Paused",
        description: `Reasoning process ${processId} has been paused successfully.`,
      });
    } catch (error) {
      toast({
        title: "Pause Failed",
        description: "Failed to pause the reasoning process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingActions(prev => ({ ...prev, [processId]: false }));
    }
  };

  const handleResumeProcess = async (processId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent card click
    setProcessingActions(prev => ({ ...prev, [processId]: true }));
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Process Resumed",
        description: `Reasoning process ${processId} has been resumed successfully.`,
      });
    } catch (error) {
      toast({
        title: "Resume Failed",
        description: "Failed to resume the reasoning process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingActions(prev => ({ ...prev, [processId]: false }));
    }
  };

  const reasoningProcesses: ReasoningProcess[] = [
    {
      id: 'reasoning-001',
      name: 'Market Analysis Decision Tree',
      type: 'probabilistic',
      status: 'running',
      progress: 67,
      confidence: 84,
      startTime: '2 minutes ago',
      estimatedCompletion: '3 minutes remaining',
      steps: [
        {
          id: 'step-1',
          description: 'Data collection and preprocessing',
          status: 'completed',
          confidence: 95,
          evidence: ['Historical data', 'Market indicators', 'Economic factors']
        },
        {
          id: 'step-2',
          description: 'Pattern recognition and trend analysis',
          status: 'current',
          confidence: 78,
          evidence: ['Technical indicators', 'Volume analysis', 'Sentiment data']
        },
        {
          id: 'step-3',
          description: 'Risk assessment and probability calculation',
          status: 'pending',
          confidence: 0,
          evidence: []
        }
      ]
    },
    {
      id: 'reasoning-002',
      name: 'Code Optimization Strategy',
      type: 'symbolic',
      status: 'completed',
      progress: 100,
      confidence: 92,
      startTime: '10 minutes ago',
      estimatedCompletion: 'Completed',
      steps: [
        {
          id: 'step-1',
          description: 'Code structure analysis',
          status: 'completed',
          confidence: 97,
          evidence: ['Complexity metrics', 'Performance benchmarks', 'Code smells']
        },
        {
          id: 'step-2',
          description: 'Optimization opportunity identification',
          status: 'completed',
          confidence: 89,
          evidence: ['Bottleneck analysis', 'Resource usage', 'Algorithm efficiency']
        },
        {
          id: 'step-3',
          description: 'Solution recommendation',
          status: 'completed',
          confidence: 94,
          evidence: ['Best practices', 'Performance impact', 'Implementation cost']
        }
      ]
    },
    {
      id: 'reasoning-003',
      name: 'Resource Allocation Problem',
      type: 'neural',
      status: 'queued',
      progress: 0,
      confidence: 0,
      startTime: 'Queued',
      estimatedCompletion: 'Pending start',
      steps: []
    }
  ];

  const decisionTree: DecisionNode = {
    id: 'root',
    question: 'Should we deploy the new feature?',
    confidence: 87,
    evidence: 12,
    decision: 'Proceed with caution',
    children: [
      {
        id: 'performance',
        question: 'Will it impact performance?',
        confidence: 92,
        evidence: 8,
        decision: 'Minimal impact expected',
        children: [
          {
            id: 'load-test',
            question: 'Load test results acceptable?',
            confidence: 95,
            evidence: 5,
            decision: 'Yes, within limits',
            children: []
          }
        ]
      },
      {
        id: 'user-impact',
        question: 'How will users be affected?',
        confidence: 78,
        evidence: 6,
        decision: 'Positive impact likely',
        children: [
          {
            id: 'user-feedback',
            question: 'Beta feedback positive?',
            confidence: 85,
            evidence: 4,
            decision: 'Mostly positive',
            children: []
          }
        ]
      }
    ]
  };

  const getStatusIcon = (status: ReasoningProcess['status']) => {
    switch (status) {
      case 'running':
        return <Activity className="h-4 w-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'queued':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeColor = (type: ReasoningProcess['type']) => {
    switch (type) {
      case 'causal':
        return 'bg-blue-100 text-blue-800';
      case 'probabilistic':
        return 'bg-green-100 text-green-800';
      case 'symbolic':
        return 'bg-purple-100 text-purple-800';
      case 'neural':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderDecisionNode = (node: DecisionNode, level = 0) => {
    return (
      <div key={node.id} className={`${level > 0 ? 'ml-6 mt-2' : ''} space-y-2`}>
        <div className="p-3 border rounded-lg bg-card">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-sm">{node.question}</h4>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {node.confidence}% confident
              </Badge>
              <Badge variant="outline" className="text-xs">
                {node.evidence} evidence
              </Badge>
            </div>
          </div>
          {node.decision && (
            <p className="text-xs text-muted-foreground">
              Decision: {node.decision}
            </p>
          )}
          <Progress value={node.confidence} className="h-1 mt-2" />
        </div>
        {node.children.map(child => renderDecisionNode(child, level + 1))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Reasoning Engine</h2>
            <p className="text-muted-foreground">Advanced reasoning and decision making</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleNewReasoning}
            disabled={isCreatingReasoning}
          >
            <TreePine className="h-4 w-4 mr-2" />
            {isCreatingReasoning ? 'Creating...' : 'New Reasoning'}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleReset}
            disabled={isResetting}
          >
            <RotateCcw className={`h-4 w-4 mr-2 ${isResetting ? 'animate-spin' : ''}`} />
            {isResetting ? 'Resetting...' : 'Reset'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="processes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="processes">Active Processes</TabsTrigger>
          <TabsTrigger value="decision-tree">Decision Trees</TabsTrigger>
          <TabsTrigger value="knowledge-graph">Knowledge Graph</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="processes" className="space-y-4">
          {/* Active Reasoning Processes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {reasoningProcesses.map((process) => (
              <Card key={process.id} className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedProcess(process.id)}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{process.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(process.status)}
                      <Badge className={getTypeColor(process.type)}>
                        {process.type}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription>
                    ID: {process.id} • {process.startTime}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Progress */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{process.progress}%</span>
                    </div>
                    <Progress value={process.progress} className="h-2" />
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Confidence</p>
                      <p className="font-semibold">{process.confidence}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">ETA</p>
                      <p className="font-semibold text-xs">{process.estimatedCompletion}</p>
                    </div>
                  </div>

                  {/* Steps */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Reasoning Steps</p>
                    {process.steps.slice(0, 2).map((step) => (
                      <div key={step.id} className="flex items-center gap-2 text-xs">
                        {step.status === 'completed' && <CheckCircle className="h-3 w-3 text-green-500" />}
                        {step.status === 'current' && <Activity className="h-3 w-3 text-blue-500" />}
                        {step.status === 'pending' && <Clock className="h-3 w-3 text-gray-400" />}
                        <span className={step.status === 'pending' ? 'text-muted-foreground' : ''}>
                          {step.description}
                        </span>
                      </div>
                    ))}
                    {process.steps.length > 2 && (
                      <p className="text-xs text-muted-foreground">
                        +{process.steps.length - 2} more steps
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      disabled={process.status !== 'running' || processingActions[process.id]}
                      onClick={(e) => handlePauseProcess(process.id, e)}
                    >
                      <Pause className="h-3 w-3 mr-1" />
                      {processingActions[process.id] ? 'Pausing...' : 'Pause'}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      disabled={process.status === 'running' || processingActions[process.id]}
                      onClick={(e) => handleResumeProcess(process.id, e)}
                    >
                      <Play className="h-3 w-3 mr-1" />
                      {processingActions[process.id] ? 'Resuming...' : 'Resume'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="decision-tree" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                Decision Tree Analysis
              </CardTitle>
              <CardDescription>
                Visual representation of decision-making process
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderDecisionNode(decisionTree)}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="knowledge-graph" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5" />
                Knowledge Graph
              </CardTitle>
              <CardDescription>
                Conceptual relationships and knowledge connections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <KnowledgeGraphFlow />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Reasoning Analytics
              </CardTitle>
              <CardDescription>
                Performance metrics and accuracy analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold">87%</p>
                  <p className="text-sm text-muted-foreground">Average Confidence</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">94%</p>
                  <p className="text-sm text-muted-foreground">Decision Accuracy</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">2.3s</p>
                  <p className="text-sm text-muted-foreground">Avg Processing Time</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReasoningEngine;