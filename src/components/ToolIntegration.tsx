import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Search, 
  Code, 
  Database, 
  FileText, 
  Calculator, 
  Globe, 
  Camera, 
  MessageSquare,
  Settings,
  Plus,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  Code2,
  Monitor,
  Wand2
} from "lucide-react";
import SearchAPIIntegration from "./SearchAPIIntegration";
import WebScrapingCapabilities from "./WebScrapingCapabilities";
import HeadlessBrowserAutomation from "./HeadlessBrowserAutomation";
import PromptEngineeringGenerator from "./PromptEngineeringGenerator";

interface Tool {
  id: string;
  name: string;
  category: 'search' | 'code' | 'database' | 'file' | 'math' | 'api' | 'vision' | 'nlp';
  status: 'active' | 'inactive' | 'error' | 'pending';
  description: string;
  apiEndpoint: string;
  lastUsed: string;
  usageCount: number;
  successRate: number;
  avgResponseTime: number;
  capabilities: string[];
}

const mockTools: Tool[] = [
  {
    id: '1',
    name: 'Web Search API',
    category: 'search',
    status: 'active',
    description: 'Advanced web search with semantic understanding',
    apiEndpoint: 'https://api.websearch.ai/v1',
    lastUsed: '2 minutes ago',
    usageCount: 1247,
    successRate: 98.5,
    avgResponseTime: 450,
    capabilities: ['Real-time search', 'Entity extraction', 'Sentiment analysis']
  },
  {
    id: '2',
    name: 'Code Executor',
    category: 'code',
    status: 'active',
    description: 'Secure code execution environment',
    apiEndpoint: 'https://api.coderunner.dev/v2',
    lastUsed: '5 minutes ago',
    usageCount: 892,
    successRate: 94.2,
    avgResponseTime: 1200,
    capabilities: ['Python', 'JavaScript', 'SQL', 'Shell commands']
  },
  {
    id: '3',
    name: 'Vector Database',
    category: 'database',
    status: 'active',
    description: 'High-performance vector similarity search',
    apiEndpoint: 'https://vectordb.cluster.local:8080',
    lastUsed: '1 minute ago',
    usageCount: 2341,
    successRate: 99.1,
    avgResponseTime: 85,
    capabilities: ['Semantic search', 'Clustering', 'Similarity matching']
  },
  {
    id: '4',
    name: 'Document Parser',
    category: 'file',
    status: 'inactive',
    description: 'Advanced document processing and extraction',
    apiEndpoint: 'https://api.docparser.ai/v1',
    lastUsed: '1 hour ago',
    usageCount: 456,
    successRate: 96.8,
    avgResponseTime: 2300,
    capabilities: ['PDF parsing', 'OCR', 'Structure extraction']
  },
  {
    id: '5',
    name: 'Math Solver',
    category: 'math',
    status: 'error',
    description: 'Symbolic and numerical computation engine',
    apiEndpoint: 'https://api.mathengine.com/v3',
    lastUsed: '30 minutes ago',
    usageCount: 234,
    successRate: 91.7,
    avgResponseTime: 670,
    capabilities: ['Algebra', 'Calculus', 'Statistics', 'Graph plotting']
  },
  {
    id: '6',
    name: 'Vision Analyzer',
    category: 'vision',
    status: 'pending',
    description: 'Computer vision and image analysis',
    apiEndpoint: 'https://vision.ai.cluster.local/v1',
    lastUsed: 'Never',
    usageCount: 0,
    successRate: 0,
    avgResponseTime: 0,
    capabilities: ['Object detection', 'OCR', 'Scene analysis']
  }
];

const ToolIntegration = () => {
  const [tools, setTools] = useState<Tool[]>(mockTools);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddToolOpen, setIsAddToolOpen] = useState(false);

  const getCategoryIcon = (category: Tool['category']) => {
    const icons = {
      search: Search,
      code: Code,
      database: Database,
      file: FileText,
      math: Calculator,
      api: Globe,
      vision: Camera,
      nlp: MessageSquare
    };
    return icons[category] || Settings;
  };

  const getStatusIcon = (status: Tool['status']) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'inactive': return <XCircle className="h-4 w-4 text-gray-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return <XCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusVariant = (status: Tool['status']) => {
    switch (status) {
      case 'active': return 'default' as const;
      case 'inactive': return 'secondary' as const;
      case 'error': return 'destructive' as const;
      case 'pending': return 'outline' as const;
      default: return 'secondary' as const;
    }
  };

  const handleToolAction = (toolId: string, action: 'start' | 'stop' | 'restart') => {
    setTools(tools.map(tool => {
      if (tool.id === toolId) {
        switch (action) {
          case 'start':
            return { ...tool, status: 'active' as const };
          case 'stop':
            return { ...tool, status: 'inactive' as const };
          case 'restart':
            return { ...tool, status: 'pending' as const };
          default:
            return tool;
        }
      }
      return tool;
    }));
  };

  const filteredTools = tools.filter(tool => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categoryStats = {
    total: tools.length,
    active: tools.filter(t => t.status === 'active').length,
    inactive: tools.filter(t => t.status === 'inactive').length,
    error: tools.filter(t => t.status === 'error').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tool Integration</h1>
          <p className="text-muted-foreground">
            Manage external tools, APIs, and web automation capabilities
          </p>
        </div>
        <Dialog open={isAddToolOpen} onOpenChange={setIsAddToolOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Tool
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Tool</DialogTitle>
              <DialogDescription>
                Configure a new external tool or API integration
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="tool-name">Tool Name</Label>
                <Input id="tool-name" placeholder="Enter tool name" />
              </div>
              <div>
                <Label htmlFor="api-endpoint">API Endpoint</Label>
                <Input id="api-endpoint" placeholder="https://api.example.com/v1" />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input id="description" placeholder="Tool description and capabilities" />
              </div>
              <Button className="w-full">Add Tool</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Web Capabilities Tabs */}
      <Tabs defaultValue="search-apis" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="search-apis" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search APIs
          </TabsTrigger>
          <TabsTrigger value="web-scraping" className="flex items-center gap-2">
            <Code2 className="h-4 w-4" />
            Web Scraping
          </TabsTrigger>
          <TabsTrigger value="browser-automation" className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            Browser Automation
          </TabsTrigger>
          <TabsTrigger value="prompt-engineering" className="flex items-center gap-2">
            <Wand2 className="h-4 w-4" />
            Prompt Engineering
          </TabsTrigger>
          <TabsTrigger value="legacy-tools" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Legacy Tools
          </TabsTrigger>
        </TabsList>

        <TabsContent value="search-apis">
          <SearchAPIIntegration />
        </TabsContent>

        <TabsContent value="web-scraping">
          <WebScrapingCapabilities />
        </TabsContent>

        <TabsContent value="browser-automation">
          <HeadlessBrowserAutomation />
        </TabsContent>

        <TabsContent value="prompt-engineering">
          <PromptEngineeringGenerator />
        </TabsContent>

        <TabsContent value="legacy-tools" className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{categoryStats.total}</p>
                    <p className="text-sm text-muted-foreground">Total Tools</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">{categoryStats.active}</p>
                    <p className="text-sm text-muted-foreground">Active</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <XCircle className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-2xl font-bold">{categoryStats.inactive}</p>
                    <p className="text-sm text-muted-foreground">Inactive</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <XCircle className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="text-2xl font-bold">{categoryStats.error}</p>
                    <p className="text-sm text-muted-foreground">Errors</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border rounded-md px-3 py-2 bg-background"
            >
              <option value="all">All Categories</option>
              <option value="search">Search</option>
              <option value="code">Code</option>
              <option value="database">Database</option>
              <option value="file">File Processing</option>
              <option value="math">Math</option>
              <option value="vision">Vision</option>
              <option value="nlp">NLP</option>
            </select>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool) => {
              const IconComponent = getCategoryIcon(tool.category);
              return (
                <Card key={tool.id} className="h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <IconComponent className="h-5 w-5" />
                        <CardTitle className="text-lg">{tool.name}</CardTitle>
                      </div>
                      <Badge variant={getStatusVariant(tool.status)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(tool.status)}
                          <span className="capitalize">{tool.status}</span>
                        </div>
                      </Badge>
                    </div>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Success Rate</span>
                        <span>{tool.successRate}%</span>
                      </div>
                      <Progress value={tool.successRate} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Usage Count</p>
                        <p className="font-medium">{tool.usageCount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Avg Response</p>
                        <p className="font-medium">{tool.avgResponseTime}ms</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-muted-foreground">Last Used</p>
                        <p className="font-medium">{tool.lastUsed}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Capabilities</p>
                      <div className="flex flex-wrap gap-1">
                        {tool.capabilities.slice(0, 3).map((capability, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {capability}
                          </Badge>
                        ))}
                        {tool.capabilities.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{tool.capabilities.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {tool.status === 'active' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToolAction(tool.id, 'stop')}
                        >
                          <Pause className="h-3 w-3 mr-1" />
                          Stop
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToolAction(tool.id, 'start')}
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Start
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToolAction(tool.id, 'restart')}
                      >
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Restart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ToolIntegration;