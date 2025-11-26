import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, TrendingUp, Zap, Heart, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

interface AgentAIAssistantProps {
  agents: Agent[];
}

const AgentAIAssistant: React.FC<AgentAIAssistantProps> = ({ agents }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('performance');

  const analyzeAgents = async (analysisType: string) => {
    setIsAnalyzing(true);
    setAnalysis(null);

    try {
      const { data, error } = await supabase.functions.invoke('agent-ai-assistant', {
        body: { 
          agents: agents.map(a => ({
            id: a.id,
            name: a.name,
            type: a.type,
            status: a.status,
            performance: a.performance,
            tasksCompleted: a.tasksCompleted,
            avgResponseTime: a.avgResponseTime,
            memoryUsage: a.memoryUsage,
            capabilities: a.capabilities
          })),
          analysisType 
        }
      });

      if (error) {
        console.error('Analysis error:', error);
        toast.error('Failed to analyze agents: ' + error.message);
        return;
      }

      if (data?.success && data.analysis) {
        setAnalysis(data.analysis);
        toast.success('Analysis complete!');
      } else {
        toast.error('No analysis data received');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to analyze agents');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatAnalysis = (text: string) => {
    return text.split('\n').map((line, index) => {
      if (line.startsWith('#')) {
        return <h3 key={index} className="text-lg font-semibold mt-4 mb-2">{line.replace(/^#+\s*/, '')}</h3>;
      }
      if (line.match(/^\d+\./)) {
        return <li key={index} className="ml-4 my-1">{line}</li>;
      }
      if (line.startsWith('- ')) {
        return <li key={index} className="ml-4 my-1 list-disc">{line.substring(2)}</li>;
      }
      if (line.trim() === '') {
        return <br key={index} />;
      }
      return <p key={index} className="my-2">{line}</p>;
    });
  };

  const getAnalysisIcon = (type: string) => {
    switch (type) {
      case 'performance':
        return <TrendingUp className="h-5 w-5" />;
      case 'capabilities':
        return <Zap className="h-5 w-5" />;
      case 'optimization':
        return <Sparkles className="h-5 w-5" />;
      case 'health':
        return <Heart className="h-5 w-5" />;
      default:
        return <Sparkles className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                AI Agent Assistant
              </CardTitle>
              <CardDescription>
                Get intelligent insights and recommendations powered by AI
              </CardDescription>
            </div>
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="h-3 w-3" />
              Powered by Lovable AI
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="performance" className="gap-1">
                <TrendingUp className="h-4 w-4" />
                Performance
              </TabsTrigger>
              <TabsTrigger value="capabilities" className="gap-1">
                <Zap className="h-4 w-4" />
                Capabilities
              </TabsTrigger>
              <TabsTrigger value="optimization" className="gap-1">
                <Sparkles className="h-4 w-4" />
                Optimization
              </TabsTrigger>
              <TabsTrigger value="health" className="gap-1">
                <Heart className="h-4 w-4" />
                Health
              </TabsTrigger>
            </TabsList>

            <TabsContent value="performance" className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Analyze agent performance metrics and identify optimization opportunities
                </p>
                <Button 
                  onClick={() => analyzeAgents('performance')}
                  disabled={isAnalyzing || agents.length === 0}
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Analyze Performance
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="capabilities" className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Review agent capabilities and discover enhancement opportunities
                </p>
                <Button 
                  onClick={() => analyzeAgents('capabilities')}
                  disabled={isAnalyzing || agents.length === 0}
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Analyze Capabilities
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="optimization" className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Get configuration and workload optimization recommendations
                </p>
                <Button 
                  onClick={() => analyzeAgents('optimization')}
                  disabled={isAnalyzing || agents.length === 0}
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Optimize Agents
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="health" className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Assess agent health and get reliability recommendations
                </p>
                <Button 
                  onClick={() => analyzeAgents('health')}
                  disabled={isAnalyzing || agents.length === 0}
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Heart className="h-4 w-4 mr-2" />
                      Check Health
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {agents.length === 0 && (
            <Card className="mt-4 bg-muted/50">
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  No agents available. Create agents to get AI-powered insights.
                </p>
              </CardContent>
            </Card>
          )}

          {analysis && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getAnalysisIcon(activeTab)}
                  AI Analysis Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  {formatAnalysis(analysis)}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{agents.length}</p>
              <p className="text-sm text-muted-foreground">Total Agents</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {agents.filter(a => a.status === 'active').length}
              </p>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {Math.round(agents.reduce((sum, a) => sum + a.performance, 0) / agents.length || 0)}%
              </p>
              <p className="text-sm text-muted-foreground">Avg Performance</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {agents.reduce((sum, a) => sum + a.tasksCompleted, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Total Tasks</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentAIAssistant;
