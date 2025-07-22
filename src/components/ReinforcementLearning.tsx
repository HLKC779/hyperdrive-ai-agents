import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  TrendingUp, 
  Activity, 
  Target, 
  Zap, 
  BarChart3,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Settings
} from 'lucide-react';
import { useRLSystem } from '@/hooks/useRLSystem';
import { toast } from 'sonner';

interface RLAgent {
  id: string;
  name: string;
  status: 'active' | 'training' | 'paused' | 'converged';
  currentReward: number;
  totalEpisodes: number;
  learningRate: number;
  explorationRate: number;
  convergenceScore: number;
  performance: {
    accuracy: number;
    efficiency: number;
    adaptability: number;
  };
  dataSourceWeights: {
    userFeedback: number;
    systemMetrics: number;
    taskCompletion: number;
    behavioralData: number;
  };
}

interface TrainingSession {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed' | 'failed';
  agentIds: string[];
  progress: number;
  totalRewards: number;
  convergenceAchieved: boolean;
  startTime: string;
  environmentId: string;
}

interface FeedbackMetrics {
  userRatings: { average: number; count: number; trend: string };
  systemPerformance: { average: number; count: number; trend: string };
  taskCompletion: { rate: number; quality: number; trend: string };
  behavioralInsights: { engagementScore: number; adaptationRate: number };
}

const ReinforcementLearning = () => {
  const [agents, setAgents] = useState<RLAgent[]>([]);
  const [trainingSessions, setTrainingSessions] = useState<TrainingSession[]>([]);
  const [feedbackMetrics, setFeedbackMetrics] = useState<FeedbackMetrics | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { 
    isLoading: rlLoading, 
    collectFeedback, 
    startTrainingSession, 
    updateTrainingSession 
  } = useRLSystem();

  // Initialize mock data - in production, this would come from your RL backend
  useEffect(() => {
    const mockAgents: RLAgent[] = [
      {
        id: 'agent-1',
        name: 'Adaptive UI Agent',
        status: 'active',
        currentReward: 0.78,
        totalEpisodes: 1247,
        learningRate: 0.01,
        explorationRate: 0.15,
        convergenceScore: 0.82,
        performance: { accuracy: 0.89, efficiency: 0.76, adaptability: 0.92 },
        dataSourceWeights: { userFeedback: 0.4, systemMetrics: 0.3, taskCompletion: 0.2, behavioralData: 0.1 }
      },
      {
        id: 'agent-2',
        name: 'Task Optimization Agent',
        status: 'training',
        currentReward: 0.65,
        totalEpisodes: 892,
        learningRate: 0.015,
        explorationRate: 0.25,
        convergenceScore: 0.67,
        performance: { accuracy: 0.84, efficiency: 0.91, adaptability: 0.73 },
        dataSourceWeights: { userFeedback: 0.2, systemMetrics: 0.4, taskCompletion: 0.3, behavioralData: 0.1 }
      },
      {
        id: 'agent-3',
        name: 'Personalization Agent',
        status: 'converged',
        currentReward: 0.93,
        totalEpisodes: 2156,
        learningRate: 0.005,
        explorationRate: 0.05,
        convergenceScore: 0.95,
        performance: { accuracy: 0.96, efficiency: 0.88, adaptability: 0.94 },
        dataSourceWeights: { userFeedback: 0.5, systemMetrics: 0.1, taskCompletion: 0.2, behavioralData: 0.2 }
      }
    ];

    const mockSessions: TrainingSession[] = [
      {
        id: 'session-1',
        name: 'Multi-Agent Collaborative Learning',
        status: 'active',
        agentIds: ['agent-1', 'agent-2'],
        progress: 67,
        totalRewards: 156.7,
        convergenceAchieved: false,
        startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        environmentId: 'env-ui-optimization'
      },
      {
        id: 'session-2',
        name: 'Personalization Enhancement',
        status: 'completed',
        agentIds: ['agent-3'],
        progress: 100,
        totalRewards: 298.4,
        convergenceAchieved: true,
        startTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        environmentId: 'env-personalization'
      }
    ];

    const mockMetrics: FeedbackMetrics = {
      userRatings: { average: 4.2, count: 1847, trend: 'up' },
      systemPerformance: { average: 0.87, count: 5623, trend: 'stable' },
      taskCompletion: { rate: 0.91, quality: 0.84, trend: 'up' },
      behavioralInsights: { engagementScore: 0.79, adaptationRate: 0.73 }
    };

    setAgents(mockAgents);
    setTrainingSessions(mockSessions);
    setFeedbackMetrics(mockMetrics);
    setLoading(false);
  }, []);

  const handleStartTraining = async (agentId: string) => {
    try {
      const result = await startTrainingSession({
        sessionName: `Training for Agent ${agentId}`,
        agentIds: [agentId],
        environmentId: 'env-adaptive-ui',
        status: 'active',
        configuration: { agentId, learningRate: 0.01, explorationRate: 0.15 }
      });

      if (result) {
        // Update agent status
        setAgents(prev => prev.map(agent => 
          agent.id === agentId ? { ...agent, status: 'training' as const } : agent
        ));
      }
    } catch (error) {
      console.error('Training error:', error);
    }
  };

  const handleStopTraining = async (sessionId: string) => {
    try {
      const success = await updateTrainingSession(sessionId, { 
        status: 'paused', 
        endTime: new Date().toISOString() 
      });

      if (success) {
        // Update local state
        setTrainingSessions(prev => prev.map(session => 
          session.id === sessionId ? { ...session, status: 'paused' as const } : session
        ));
      }
    } catch (error) {
      console.error('Stop training error:', error);
    }
  };

  const collectUserFeedback = async (rating: number, context: any) => {
    try {
      await collectFeedback({
        sessionId: crypto.randomUUID(),
        agentId: selectedAgent || 'general',
        feedbackType: 'user_rating',
        feedbackValue: { rating, timestamp: new Date().toISOString() },
        context: context
      });
    } catch (error) {
      console.error('Feedback error:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Activity className="h-4 w-4 text-green-500" />;
      case 'training': return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'converged': return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'paused': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'training': return 'secondary';
      case 'converged': return 'outline';
      case 'paused': return 'destructive';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reinforcement Learning System</h2>
          <p className="text-muted-foreground">
            Multi-source feedback learning and adaptive intelligence
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Settings className="h-4 w-4" />
          Configure System
        </Button>
      </div>

      {/* Feedback Metrics Overview */}
      {feedbackMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">User Ratings</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{feedbackMetrics.userRatings.average.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">
                {feedbackMetrics.userRatings.count} ratings collected
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Performance</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(feedbackMetrics.systemPerformance.average * 100).toFixed(0)}%</div>
              <p className="text-xs text-muted-foreground">
                {feedbackMetrics.systemPerformance.count} metrics collected
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Task Completion</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(feedbackMetrics.taskCompletion.rate * 100).toFixed(0)}%</div>
              <p className="text-xs text-muted-foreground">
                Quality: {(feedbackMetrics.taskCompletion.quality * 100).toFixed(0)}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Engagement Score</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(feedbackMetrics.behavioralInsights.engagementScore * 100).toFixed(0)}%</div>
              <p className="text-xs text-muted-foreground">
                Adaptation: {(feedbackMetrics.behavioralInsights.adaptationRate * 100).toFixed(0)}%
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="agents" className="space-y-4">
        <TabsList>
          <TabsTrigger value="agents">RL Agents</TabsTrigger>
          <TabsTrigger value="training">Training Sessions</TabsTrigger>
          <TabsTrigger value="feedback">Feedback Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="space-y-4">
          <div className="grid gap-4">
            {agents.map((agent) => (
              <Card key={agent.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Brain className="h-6 w-6 text-primary" />
                    <div>
                      <h3 className="text-lg font-semibold">{agent.name}</h3>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(agent.status)}
                        <Badge variant={getStatusVariant(agent.status)}>
                          {agent.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleStartTraining(agent.id)}
                    disabled={rlLoading || agent.status === 'training'}
                    className="gap-2"
                  >
                    <RefreshCw className={`h-4 w-4 ${rlLoading ? 'animate-spin' : ''}`} />
                    {agent.status === 'training' ? 'Training...' : 'Start Training'}
                  </Button>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Current Reward</p>
                    <p className="text-2xl font-bold text-primary">{agent.currentReward.toFixed(3)}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Episodes</p>
                    <p className="text-2xl font-bold">{agent.totalEpisodes.toLocaleString()}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Learning Rate</p>
                    <p className="text-2xl font-bold">{agent.learningRate}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Exploration</p>
                    <p className="text-2xl font-bold">{(agent.explorationRate * 100).toFixed(0)}%</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Convergence Score</span>
                      <span>{(agent.convergenceScore * 100).toFixed(0)}%</span>
                    </div>
                    <Progress value={agent.convergenceScore * 100} className="h-2" />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Accuracy</span>
                        <span>{(agent.performance.accuracy * 100).toFixed(0)}%</span>
                      </div>
                      <Progress value={agent.performance.accuracy * 100} className="h-1" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Efficiency</span>
                        <span>{(agent.performance.efficiency * 100).toFixed(0)}%</span>
                      </div>
                      <Progress value={agent.performance.efficiency * 100} className="h-1" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Adaptability</span>
                        <span>{(agent.performance.adaptability * 100).toFixed(0)}%</span>
                      </div>
                      <Progress value={agent.performance.adaptability * 100} className="h-1" />
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                    <h4 className="text-sm font-medium mb-2">Data Source Weights</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span>User Feedback:</span>
                        <span>{(agent.dataSourceWeights.userFeedback * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>System Metrics:</span>
                        <span>{(agent.dataSourceWeights.systemMetrics * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Task Completion:</span>
                        <span>{(agent.dataSourceWeights.taskCompletion * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Behavioral Data:</span>
                        <span>{(agent.dataSourceWeights.behavioralData * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="training" className="space-y-4">
          <div className="grid gap-4">
            {trainingSessions.map((session) => (
              <Card key={session.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{session.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusIcon(session.status)}
                      <Badge variant={getStatusVariant(session.status)}>
                        {session.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {session.agentIds.length} agent(s)
                      </span>
                    </div>
                  </div>
                  {session.status === 'active' && (
                    <Button
                      variant="outline"
                      onClick={() => handleStopTraining(session.id)}
                    >
                      Pause Training
                    </Button>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Training Progress</span>
                      <span>{session.progress}%</span>
                    </div>
                    <Progress value={session.progress} className="h-2" />
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total Rewards</p>
                      <p className="text-lg font-semibold">{session.totalRewards.toFixed(1)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Environment</p>
                      <p className="text-lg font-semibold">{session.environmentId}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Started</p>
                      <p className="text-lg font-semibold">
                        {new Date(session.startTime).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {session.convergenceAchieved && (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        Convergence achieved! This agent has reached optimal performance.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-4">
          <Card className="p-6">
            <CardHeader>
              <CardTitle>Feedback Collection & Analysis</CardTitle>
              <CardDescription>
                Real-time insights from multi-source feedback data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Data Source Contribution</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">User Interactions</span>
                      <span className="text-sm font-medium">42%</span>
                    </div>
                    <Progress value={42} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">System Metrics</span>
                      <span className="text-sm font-medium">28%</span>
                    </div>
                    <Progress value={28} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Task Completion</span>
                      <span className="text-sm font-medium">20%</span>
                    </div>
                    <Progress value={20} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Behavioral Data</span>
                      <span className="text-sm font-medium">10%</span>
                    </div>
                    <Progress value={10} className="h-2" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Learning Effectiveness</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Adaptation Speed</p>
                      <p className="text-2xl font-bold text-green-600">+23%</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Prediction Accuracy</p>
                      <p className="text-2xl font-bold text-blue-600">87%</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">User Satisfaction</p>
                      <p className="text-2xl font-bold text-purple-600">4.2/5</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">System Efficiency</p>
                      <p className="text-2xl font-bold text-orange-600">+15%</p>
                    </div>
                  </div>
                </div>
              </div>

              <Alert>
                <TrendingUp className="h-4 w-4" />
                <AlertDescription>
                  System performance has improved by 23% over the last 7 days through 
                  multi-source feedback integration and continuous learning.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReinforcementLearning;