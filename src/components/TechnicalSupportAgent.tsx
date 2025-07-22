import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Wrench, 
  Code, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  Bug,
  Zap,
  Terminal,
  FileText,
  HelpCircle
} from 'lucide-react';

interface TechnicalIssue {
  id: string;
  title: string;
  category: 'bug' | 'performance' | 'configuration' | 'deployment';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'resolved';
  description: string;
  solution?: string;
  assignedAgent?: string;
  createdAt: Date;
}

interface KnowledgeBaseItem {
  id: string;
  title: string;
  category: string;
  content: string;
  tags: string[];
  helpful: number;
}

const TechnicalSupportAgent = () => {
  const [issues, setIssues] = useState<TechnicalIssue[]>([
    {
      id: 'issue-001',
      title: 'React Component Not Rendering',
      category: 'bug',
      severity: 'high',
      status: 'resolved',
      description: 'Component returns undefined instead of JSX',
      solution: 'Added proper return statement and fixed conditional rendering logic',
      assignedAgent: 'Code Generation Beta',
      createdAt: new Date(Date.now() - 3600000)
    },
    {
      id: 'issue-002',
      title: 'API Response Time Too Slow',
      category: 'performance',
      severity: 'medium',
      status: 'in-progress',
      description: 'Database queries taking over 5 seconds to respond',
      assignedAgent: 'Research Agent Alpha',
      createdAt: new Date(Date.now() - 7200000)
    },
    {
      id: 'issue-003',
      title: 'TypeScript Build Errors',
      category: 'configuration',
      severity: 'medium',
      status: 'open',
      description: 'Multiple type errors preventing successful build',
      createdAt: new Date(Date.now() - 1800000)
    }
  ]);

  const [knowledgeBase] = useState<KnowledgeBaseItem[]>([
    {
      id: 'kb-001',
      title: 'How to Debug React Component Issues',
      category: 'Development',
      content: `1. Check the React Developer Tools
2. Use console.log to track props and state
3. Verify component lifecycle methods
4. Check for conditional rendering issues
5. Ensure proper key props for lists`,
      tags: ['react', 'debugging', 'components'],
      helpful: 45
    },
    {
      id: 'kb-002',
      title: 'Optimizing API Performance',
      category: 'Performance',
      content: `1. Implement proper caching strategies
2. Use pagination for large datasets
3. Add database indexing
4. Optimize database queries
5. Consider using CDN for static assets`,
      tags: ['api', 'performance', 'optimization'],
      helpful: 32
    },
    {
      id: 'kb-003',
      title: 'TypeScript Configuration Best Practices',
      category: 'Configuration',
      content: `1. Use strict mode for better type checking
2. Configure path mapping for cleaner imports
3. Set up proper ESLint rules
4. Use interfaces for object types
5. Enable incremental compilation`,
      tags: ['typescript', 'configuration', 'setup'],
      helpful: 28
    }
  ]);

  const getSeverityColor = (severity: TechnicalIssue['severity']) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: TechnicalIssue['status']) => {
    switch (status) {
      case 'resolved': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'open': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <HelpCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getCategoryIcon = (category: TechnicalIssue['category']) => {
    switch (category) {
      case 'bug': return <Bug className="h-4 w-4" />;
      case 'performance': return <Zap className="h-4 w-4" />;
      case 'configuration': return <Terminal className="h-4 w-4" />;
      case 'deployment': return <FileText className="h-4 w-4" />;
      default: return <Wrench className="h-4 w-4" />;
    }
  };

  const handleIssueStatusChange = (issueId: string, newStatus: TechnicalIssue['status']) => {
    setIssues(prev => 
      prev.map(issue => 
        issue.id === issueId 
          ? { ...issue, status: newStatus }
          : issue
      )
    );
  };

  const getQuickSolutions = () => [
    {
      title: "Clear Browser Cache",
      description: "Resolve caching issues",
      command: "Ctrl+Shift+R or Cmd+Shift+R"
    },
    {
      title: "Restart Development Server",
      description: "Fix hot reload issues",
      command: "npm run dev or yarn dev"
    },
    {
      title: "Install Missing Dependencies",
      description: "Resolve package errors",
      command: "npm install or yarn install"
    },
    {
      title: "Check Console Errors",
      description: "Find JavaScript errors",
      command: "Press F12 to open DevTools"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Wrench className="h-6 w-6" />
            Technical Support Center
          </h2>
          <p className="text-muted-foreground">AI-powered technical assistance and troubleshooting</p>
        </div>
      </div>

      <Tabs defaultValue="issues" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="issues">Active Issues</TabsTrigger>
          <TabsTrigger value="solutions">Quick Solutions</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
          <TabsTrigger value="diagnostics">Diagnostics</TabsTrigger>
        </TabsList>

        <TabsContent value="issues" className="space-y-4">
          <div className="grid gap-4">
            {issues.map((issue) => (
              <Card key={issue.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getCategoryIcon(issue.category)}
                      <div>
                        <CardTitle className="text-lg">{issue.title}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>ID: {issue.id}</span>
                          <span>•</span>
                          <span>{issue.createdAt.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(issue.status)}
                      <Badge variant={getSeverityColor(issue.severity)}>
                        {issue.severity}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground">{issue.description}</p>
                  </div>
                  
                  {issue.solution && (
                    <div>
                      <h4 className="font-medium mb-2">Solution</h4>
                      <Alert>
                        <CheckCircle2 className="h-4 w-4" />
                        <AlertDescription>{issue.solution}</AlertDescription>
                      </Alert>
                    </div>
                  )}
                  
                  {issue.assignedAgent && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Assigned to:</span>
                      <Badge variant="outline">{issue.assignedAgent}</Badge>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    {issue.status === 'open' && (
                      <Button 
                        size="sm" 
                        onClick={() => handleIssueStatusChange(issue.id, 'in-progress')}
                      >
                        Start Working
                      </Button>
                    )}
                    {issue.status === 'in-progress' && (
                      <Button 
                        size="sm" 
                        onClick={() => handleIssueStatusChange(issue.id, 'resolved')}
                      >
                        Mark Resolved
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="solutions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getQuickSolutions().map((solution, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Code className="h-5 w-5 text-primary mt-1" />
                    <div className="flex-1">
                      <h3 className="font-medium">{solution.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{solution.description}</p>
                      <code className="bg-muted px-2 py-1 rounded text-xs">
                        {solution.command}
                      </code>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="knowledge" className="space-y-4">
          <div className="grid gap-4">
            {knowledgeBase.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{item.category}</Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-3 w-3" />
                        {item.helpful} helpful
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="whitespace-pre-line text-sm">{item.content}</div>
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="diagnostics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Terminal className="h-5 w-5" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Server Status</span>
                    <Badge className="bg-green-500">Online</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Database</span>
                    <Badge className="bg-green-500">Connected</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">API Response</span>
                    <Badge className="bg-green-500">Normal</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Zap className="h-5 w-5" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Response Time</span>
                    <span className="text-sm font-medium">245ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Memory Usage</span>
                    <span className="text-sm font-medium">68%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">CPU Usage</span>
                    <span className="text-sm font-medium">34%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Bug className="h-5 w-5" />
                  Error Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Errors (24h)</span>
                    <span className="text-sm font-medium">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Warnings</span>
                    <span className="text-sm font-medium">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Info Logs</span>
                    <span className="text-sm font-medium">1,247</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TechnicalSupportAgent;