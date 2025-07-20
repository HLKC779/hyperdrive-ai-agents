import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { 
  Brain, 
  TrendingUp, 
  Zap, 
  Target, 
  Cpu, 
  MemoryStick, 
  HardDrive, 
  Network,
  Activity,
  Settings,
  Lightbulb,
  Gauge,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  Clock,
  BarChart
} from 'lucide-react';

interface ResourcePrediction {
  timestamp: string;
  predictedCpu: number;
  predictedMemory: number;
  actualCpu?: number;
  actualMemory?: number;
  confidence: number;
}

interface TaskPrediction {
  taskId: string;
  taskName: string;
  estimatedCompletion: number; // minutes
  confidence: number;
  factors: string[];
}

interface Recommendation {
  id: string;
  type: 'optimization' | 'scaling' | 'scheduling' | 'resource';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  savings: string;
  implemented: boolean;
}

interface AutoScalingRule {
  id: string;
  name: string;
  metric: 'cpu' | 'memory' | 'queue_length' | 'response_time';
  threshold: number;
  action: 'scale_up' | 'scale_down';
  enabled: boolean;
  cooldown: number; // minutes
}

const SmartFeatures = () => {
  const [aiOptimizationEnabled, setAiOptimizationEnabled] = useState(true);
  const [autoScalingEnabled, setAutoScalingEnabled] = useState(true);
  const [predictiveAnalyticsEnabled, setPredictiveAnalyticsEnabled] = useState(true);
  const [smartRecommendationsEnabled, setSmartRecommendationsEnabled] = useState(true);

  const [resourcePredictions, setResourcePredictions] = useState<ResourcePrediction[]>([]);
  const [taskPredictions, setTaskPredictions] = useState<TaskPrediction[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [scalingRules, setScalingRules] = useState<AutoScalingRule[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Initialize data
  useEffect(() => {
    // Generate mock resource predictions
    const predictions: ResourcePrediction[] = [];
    for (let i = 0; i < 24; i++) {
      const time = new Date();
      time.setHours(time.getHours() + i);
      predictions.push({
        timestamp: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        predictedCpu: Math.floor(Math.random() * 40) + 30 + Math.sin(i / 4) * 20,
        predictedMemory: Math.floor(Math.random() * 30) + 40 + Math.cos(i / 6) * 15,
        confidence: Math.floor(Math.random() * 20) + 80
      });
    }
    setResourcePredictions(predictions);

    // Generate task predictions
    setTaskPredictions([
      {
        taskId: '1',
        taskName: 'Customer Data Analysis',
        estimatedCompletion: 127,
        confidence: 87,
        factors: ['historical data', 'current load', 'data size']
      },
      {
        taskId: '2',
        taskName: 'Model Training Pipeline',
        estimatedCompletion: 243,
        confidence: 92,
        factors: ['model complexity', 'dataset size', 'GPU availability']
      },
      {
        taskId: '3',
        taskName: 'API Integration Test',
        estimatedCompletion: 45,
        confidence: 95,
        factors: ['API response time', 'test complexity', 'network latency']
      }
    ]);

    // Generate recommendations
    setRecommendations([
      {
        id: '1',
        type: 'optimization',
        title: 'Optimize Memory Usage',
        description: 'Reduce memory allocation by 25% by implementing data streaming for large datasets',
        impact: 'high',
        effort: 'medium',
        savings: '32% faster execution',
        implemented: false
      },
      {
        id: '2',
        type: 'scaling',
        title: 'Auto-scale During Peak Hours',
        description: 'Add 2 additional compute nodes between 2-4 PM when queue length exceeds 15 tasks',
        impact: 'high',
        effort: 'low',
        savings: '45% reduction in wait time',
        implemented: true
      },
      {
        id: '3',
        type: 'scheduling',
        title: 'Intelligent Task Batching',
        description: 'Group similar computation tasks to improve GPU utilization by 38%',
        impact: 'medium',
        effort: 'medium',
        savings: '23% cost reduction',
        implemented: false
      },
      {
        id: '4',
        type: 'resource',
        title: 'Predictive Resource Allocation',
        description: 'Pre-allocate resources based on historical patterns to reduce startup time',
        impact: 'medium',
        effort: 'high',
        savings: '18% faster task startup',
        implemented: false
      }
    ]);

    // Generate auto-scaling rules
    setScalingRules([
      {
        id: '1',
        name: 'CPU Scale Up',
        metric: 'cpu',
        threshold: 80,
        action: 'scale_up',
        enabled: true,
        cooldown: 5
      },
      {
        id: '2',
        name: 'Memory Scale Up',
        metric: 'memory',
        threshold: 75,
        action: 'scale_up',
        enabled: true,
        cooldown: 10
      },
      {
        id: '3',
        name: 'Queue Length Scale Up',
        metric: 'queue_length',
        threshold: 20,
        action: 'scale_up',
        enabled: true,
        cooldown: 3
      },
      {
        id: '4',
        name: 'CPU Scale Down',
        metric: 'cpu',
        threshold: 30,
        action: 'scale_down',
        enabled: true,
        cooldown: 15
      }
    ]);
  }, []);

  // Simulate AI analysis
  const runAiAnalysis = async () => {
    setIsAnalyzing(true);
    
    // Simulate analysis time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Update predictions with "improved" data
    setResourcePredictions(current => 
      current.map(pred => ({
        ...pred,
        confidence: Math.min(pred.confidence + Math.floor(Math.random() * 10), 98)
      }))
    );

    // Add new recommendation
    const newRecommendation: Recommendation = {
      id: Date.now().toString(),
      type: 'optimization',
      title: 'AI-Optimized Resource Allocation',
      description: 'ML model suggests reallocating 15% of resources to high-priority tasks for optimal throughput',
      impact: 'high',
      effort: 'low',
      savings: '28% efficiency gain',
      implemented: false
    };

    setRecommendations(current => [newRecommendation, ...current]);
    setIsAnalyzing(false);

    toast({
      title: "AI Analysis Complete! 🧠",
      description: "New optimization recommendations generated based on current patterns",
    });
  };

  const implementRecommendation = (id: string) => {
    setRecommendations(current => 
      current.map(rec => 
        rec.id === id ? { ...rec, implemented: true } : rec
      )
    );
    
    const recommendation = recommendations.find(r => r.id === id);
    toast({
      title: "Recommendation Implemented! ✅",
      description: `Applied: ${recommendation?.title}`,
    });
  };

  const toggleScalingRule = (id: string) => {
    setScalingRules(current => 
      current.map(rule => 
        rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
      )
    );
  };

  const getImpactColor = (impact: string) => {
    const colors = {
      high: 'text-red-600 bg-red-50',
      medium: 'text-yellow-600 bg-yellow-50',
      low: 'text-green-600 bg-green-50'
    };
    return colors[impact as keyof typeof colors] || 'text-gray-600 bg-gray-50';
  };

  const getEffortColor = (effort: string) => {
    const colors = {
      low: 'text-green-600 bg-green-50',
      medium: 'text-yellow-600 bg-yellow-50',
      high: 'text-red-600 bg-red-50'
    };
    return colors[effort as keyof typeof colors] || 'text-gray-600 bg-gray-50';
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            Smart AI Features
          </h2>
          <p className="text-muted-foreground">
            AI-powered optimization, predictions, and intelligent automation
          </p>
        </div>
        <Button 
          onClick={runAiAnalysis}
          disabled={isAnalyzing}
          className="relative"
        >
          {isAnalyzing ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
              Analyzing...
            </>
          ) : (
            <>
              <Brain className="h-4 w-4 mr-2" />
              Run AI Analysis
            </>
          )}
        </Button>
      </div>

      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            AI Control Panel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="ai-optimization">AI Optimization</Label>
                <p className="text-sm text-muted-foreground">Auto-optimize resource allocation</p>
              </div>
              <Switch
                id="ai-optimization"
                checked={aiOptimizationEnabled}
                onCheckedChange={setAiOptimizationEnabled}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-scaling">Auto-scaling</Label>
                <p className="text-sm text-muted-foreground">Dynamic resource scaling</p>
              </div>
              <Switch
                id="auto-scaling"
                checked={autoScalingEnabled}
                onCheckedChange={setAutoScalingEnabled}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="predictive-analytics">Predictive Analytics</Label>
                <p className="text-sm text-muted-foreground">Task completion predictions</p>
              </div>
              <Switch
                id="predictive-analytics"
                checked={predictiveAnalyticsEnabled}
                onCheckedChange={setPredictiveAnalyticsEnabled}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="smart-recommendations">Recommendations</Label>
                <p className="text-sm text-muted-foreground">AI-powered suggestions</p>
              </div>
              <Switch
                id="smart-recommendations"
                checked={smartRecommendationsEnabled}
                onCheckedChange={setSmartRecommendationsEnabled}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="optimization" className="space-y-6">
        <TabsList>
          <TabsTrigger value="optimization">Resource Optimization</TabsTrigger>
          <TabsTrigger value="predictions">Predictive Analytics</TabsTrigger>
          <TabsTrigger value="scaling">Auto-scaling</TabsTrigger>
          <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="optimization">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Resource Allocation Optimization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Cpu className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">CPU Efficiency</span>
                      </div>
                      <div className="text-2xl font-bold">87%</div>
                      <div className="text-xs text-green-600">+12% from AI optimization</div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <MemoryStick className="h-4 w-4 text-purple-500" />
                        <span className="text-sm font-medium">Memory Efficiency</span>
                      </div>
                      <div className="text-2xl font-bold">92%</div>
                      <div className="text-xs text-green-600">+18% from AI optimization</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Optimization Progress</span>
                      <span>78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                    <p className="text-xs text-muted-foreground">AI continuously optimizing based on usage patterns</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5" />
                  Predicted Resource Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={resourcePredictions.slice(0, 12)}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="timestamp" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="predictedCpu"
                      stackId="1"
                      stroke="hsl(var(--chart-1))"
                      fill="hsl(var(--chart-1))"
                      fillOpacity={0.6}
                      name="Predicted CPU %"
                    />
                    <Area
                      type="monotone"
                      dataKey="predictedMemory"
                      stackId="1"
                      stroke="hsl(var(--chart-2))"
                      fill="hsl(var(--chart-2))"
                      fillOpacity={0.6}
                      name="Predicted Memory %"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictions">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Task Completion Predictions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {taskPredictions.map((prediction) => (
                    <div key={prediction.taskId} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{prediction.taskName}</h4>
                        <Badge variant="outline" className="text-xs">
                          {prediction.confidence}% confidence
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <span className="text-sm text-muted-foreground">Estimated Completion</span>
                          <p className="text-lg font-bold text-primary">
                            {formatTime(prediction.estimatedCompletion)}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Confidence Level</span>
                          <div className="flex items-center gap-2">
                            <Progress value={prediction.confidence} className="h-2 flex-1" />
                            <span className="text-sm">{prediction.confidence}%</span>
                          </div>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Prediction Factors</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {prediction.factors.map((factor) => (
                              <Badge key={factor} variant="secondary" className="text-xs">
                                {factor}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scaling">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="h-5 w-5" />
                  Auto-scaling Rules
                  <Badge variant={autoScalingEnabled ? "default" : "secondary"}>
                    {autoScalingEnabled ? "Active" : "Disabled"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scalingRules.map((rule) => (
                    <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{rule.name}</h4>
                          <Badge variant={rule.enabled ? "default" : "secondary"} className="text-xs">
                            {rule.enabled ? "Enabled" : "Disabled"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {rule.action === 'scale_up' ? 'Scale up' : 'Scale down'} when {rule.metric.replace('_', ' ')} 
                          {rule.action === 'scale_up' ? ' exceeds' : ' falls below'} {rule.threshold}
                          {rule.metric === 'cpu' || rule.metric === 'memory' ? '%' : 
                           rule.metric === 'queue_length' ? ' tasks' : 'ms'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {rule.cooldown}min cooldown
                        </span>
                        <Switch
                          checked={rule.enabled}
                          onCheckedChange={() => toggleScalingRule(rule.id)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-5 w-5 text-green-500" />
                    <span className="font-medium">Scaling Events (24h)</span>
                  </div>
                  <div className="text-2xl font-bold">7</div>
                  <div className="text-xs text-green-600">3 scale-ups, 4 scale-downs</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-blue-500" />
                    <span className="font-medium">Avg Response Time</span>
                  </div>
                  <div className="text-2xl font-bold">1.2s</div>
                  <div className="text-xs text-green-600">-0.3s from auto-scaling</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-5 w-5 text-purple-500" />
                    <span className="font-medium">Cost Savings</span>
                  </div>
                  <div className="text-2xl font-bold">23%</div>
                  <div className="text-xs text-green-600">vs fixed capacity</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="recommendations">
          <div className="space-y-4">
            {recommendations.map((recommendation) => (
              <Card key={recommendation.id} className={recommendation.implemented ? "border-green-200 bg-green-50/50" : ""}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold">{recommendation.title}</h3>
                        {recommendation.implemented && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Implemented
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {recommendation.description}
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium">Impact:</span>
                          <Badge variant="outline" className={getImpactColor(recommendation.impact)}>
                            {recommendation.impact}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium">Effort:</span>
                          <Badge variant="outline" className={getEffortColor(recommendation.effort)}>
                            {recommendation.effort}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium">Savings:</span>
                          <span className="text-xs text-green-600 font-medium">
                            {recommendation.savings}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      {!recommendation.implemented ? (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => implementRecommendation(recommendation.id)}
                        >
                          Implement
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      ) : (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Done
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SmartFeatures;