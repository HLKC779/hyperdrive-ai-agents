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
import AnalyticsDashboard from "./AnalyticsDashboard";
import { 
  Database, 
  Brain, 
  Network, 
  FileText, 
  Search, 
  Plus,
  Upload,
  Download,
  Trash2,
  Edit,
  Eye,
  Share,
  Star,
  Clock,
  Users,
  Tag,
  Filter,
  BarChart3,
  RefreshCw
} from "lucide-react";

interface KnowledgeItem {
  id: string;
  title: string;
  type: 'document' | 'entity' | 'relationship' | 'rule' | 'fact';
  category: string;
  content: string;
  confidence: number;
  lastUpdated: string;
  usageCount: number;
  creator: string;
  tags: string[];
  relationships: string[];
  status: 'active' | 'draft' | 'archived';
}

interface KnowledgeGraph {
  nodes: number;
  edges: number;
  domains: string[];
  lastSync: string;
}

const mockKnowledgeItems: KnowledgeItem[] = [
  {
    id: '1',
    title: 'Natural Language Processing Fundamentals',
    type: 'document',
    category: 'AI/ML',
    content: 'Comprehensive guide covering tokenization, embeddings, transformers...',
    confidence: 95.2,
    lastUpdated: '2 hours ago',
    usageCount: 342,
    creator: 'AI System',
    tags: ['NLP', 'Transformers', 'Embeddings'],
    relationships: ['2', '5'],
    status: 'active'
  },
  {
    id: '2',
    title: 'BERT Model Architecture',
    type: 'entity',
    category: 'AI/ML',
    content: 'Bidirectional Encoder Representations from Transformers - detailed technical specs',
    confidence: 98.7,
    lastUpdated: '4 hours ago',
    usageCount: 156,
    creator: 'Human Expert',
    tags: ['BERT', 'Architecture', 'Encoder'],
    relationships: ['1', '3'],
    status: 'active'
  },
  {
    id: '3',
    title: 'Attention Mechanism Principles',
    type: 'rule',
    category: 'AI/ML',
    content: 'Self-attention and cross-attention mechanisms in neural networks',
    confidence: 92.4,
    lastUpdated: '1 day ago',
    usageCount: 89,
    creator: 'AI System',
    tags: ['Attention', 'Neural Networks'],
    relationships: ['2', '4'],
    status: 'active'
  },
  {
    id: '4',
    title: 'Customer Service Best Practices',
    type: 'document',
    category: 'Business',
    content: 'Guidelines for effective customer interaction and problem resolution',
    confidence: 87.6,
    lastUpdated: '3 days ago',
    usageCount: 234,
    creator: 'Human Expert',
    tags: ['Customer Service', 'Best Practices'],
    relationships: [],
    status: 'draft'
  },
  {
    id: '5',
    title: 'Transformer → GPT Evolution',
    type: 'relationship',
    category: 'AI/ML',
    content: 'Historical development path from transformer architecture to GPT models',
    confidence: 94.1,
    lastUpdated: '5 hours ago',
    usageCount: 67,
    creator: 'AI System',
    tags: ['GPT', 'History', 'Evolution'],
    relationships: ['1', '2'],
    status: 'active'
  }
];

const mockGraphStats: KnowledgeGraph = {
  nodes: 15420,
  edges: 34567,
  domains: ['AI/ML', 'Business', 'Technology', 'Science', 'Healthcare'],
  lastSync: '15 minutes ago'
};

const KnowledgeBase = () => {
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>(mockKnowledgeItems);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddKnowledgeOpen, setIsAddKnowledgeOpen] = useState(false);

  const getTypeIcon = (type: KnowledgeItem['type']) => {
    const icons = {
      document: FileText,
      entity: Database,
      relationship: Network,
      rule: Brain,
      fact: Star
    };
    return icons[type] || FileText;
  };

  const getTypeColor = (type: KnowledgeItem['type']) => {
    const colors = {
      document: 'bg-blue-100 text-blue-800',
      entity: 'bg-green-100 text-green-800',
      relationship: 'bg-purple-100 text-purple-800',
      rule: 'bg-orange-100 text-orange-800',
      fact: 'bg-yellow-100 text-yellow-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getStatusVariant = (status: KnowledgeItem['status']) => {
    switch (status) {
      case 'active': return 'default' as const;
      case 'draft': return 'secondary' as const;
      case 'archived': return 'outline' as const;
      default: return 'secondary' as const;
    }
  };

  const filteredItems = knowledgeItems.filter(item => {
    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesCategory && matchesSearch;
  });

  const categoryStats = {
    total: knowledgeItems.length,
    active: knowledgeItems.filter(item => item.status === 'active').length,
    draft: knowledgeItems.filter(item => item.status === 'draft').length,
    archived: knowledgeItems.filter(item => item.status === 'archived').length
  };

  const typeDistribution = {
    documents: knowledgeItems.filter(item => item.type === 'document').length,
    entities: knowledgeItems.filter(item => item.type === 'entity').length,
    relationships: knowledgeItems.filter(item => item.type === 'relationship').length,
    rules: knowledgeItems.filter(item => item.type === 'rule').length,
    facts: knowledgeItems.filter(item => item.type === 'fact').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Knowledge Base</h1>
          <p className="text-muted-foreground">
            Manage structured knowledge, documents, and relationship graphs
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Dialog open={isAddKnowledgeOpen} onOpenChange={setIsAddKnowledgeOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Knowledge
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Knowledge Item</DialogTitle>
                <DialogDescription>
                  Create a new knowledge item for the system to learn from
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" placeholder="Enter knowledge title" />
                  </div>
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <select id="type" className="w-full border rounded-md px-3 py-2">
                      <option value="document">Document</option>
                      <option value="entity">Entity</option>
                      <option value="relationship">Relationship</option>
                      <option value="rule">Rule</option>
                      <option value="fact">Fact</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" placeholder="e.g., AI/ML, Business, Technology" />
                </div>
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea id="content" placeholder="Enter detailed content..." rows={4} />
                </div>
                <div>
                  <Label htmlFor="tags">Tags</Label>
                  <Input id="tags" placeholder="tag1, tag2, tag3" />
                </div>
                <Button className="w-full">Add to Knowledge Base</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="knowledge" className="space-y-6">
        <TabsList>
          <TabsTrigger value="knowledge">Knowledge Items</TabsTrigger>
          <TabsTrigger value="graph">Knowledge Graph</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="knowledge" className="space-y-6">
          {/* Knowledge Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Database className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{categoryStats.total}</p>
                    <p className="text-sm text-muted-foreground">Total Items</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-green-500" />
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
                  <Edit className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="text-2xl font-bold">{categoryStats.draft}</p>
                    <p className="text-sm text-muted-foreground">Drafts</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-2xl font-bold">{categoryStats.archived}</p>
                    <p className="text-sm text-muted-foreground">Archived</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search knowledge base..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="border rounded-md px-3 py-2 bg-background"
            >
              <option value="all">All Types</option>
              <option value="document">Documents</option>
              <option value="entity">Entities</option>
              <option value="relationship">Relationships</option>
              <option value="rule">Rules</option>
              <option value="fact">Facts</option>
            </select>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border rounded-md px-3 py-2 bg-background"
            >
              <option value="all">All Categories</option>
              <option value="AI/ML">AI/ML</option>
              <option value="Business">Business</option>
              <option value="Technology">Technology</option>
            </select>
          </div>

          {/* Knowledge Items */}
          <div className="space-y-4">
            {filteredItems.map((item) => {
              const IconComponent = getTypeIcon(item.type);
              return (
                <Card key={item.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${getTypeColor(item.type)}`}>
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{item.title}</CardTitle>
                          <CardDescription className="flex items-center gap-2">
                            <span>{item.category}</span>
                            <span>•</span>
                            <span>Updated {item.lastUpdated}</span>
                            <span>•</span>
                            <span>Used {item.usageCount} times</span>
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getStatusVariant(item.status)}>
                          {item.status}
                        </Badge>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {item.content}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex flex-wrap gap-1">
                        {item.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>Confidence: {item.confidence}%</span>
                        <Progress value={item.confidence} className="w-16 h-2" />
                      </div>
                    </div>

                    {item.relationships.length > 0 && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Network className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Connected to {item.relationships.length} item(s)
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="graph" className="space-y-6">
          {/* Graph Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Network className="h-5 w-5" />
                  <span>Graph Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Nodes</span>
                  <span className="font-bold">{mockGraphStats.nodes.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Edges</span>
                  <span className="font-bold">{mockGraphStats.edges.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Sync</span>
                  <span className="text-sm text-muted-foreground">{mockGraphStats.lastSync}</span>
                </div>
                <Button className="w-full" variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Graph
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Knowledge Domains</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mockGraphStats.domains.map((domain, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm">{domain}</span>
                      <Badge variant="outline">{Math.floor(Math.random() * 1000) + 100}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Type Distribution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Documents</span>
                    <span>{typeDistribution.documents}</span>
                  </div>
                  <Progress value={(typeDistribution.documents / knowledgeItems.length) * 100} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Entities</span>
                    <span>{typeDistribution.entities}</span>
                  </div>
                  <Progress value={(typeDistribution.entities / knowledgeItems.length) * 100} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Relationships</span>
                    <span>{typeDistribution.relationships}</span>
                  </div>
                  <Progress value={(typeDistribution.relationships / knowledgeItems.length) * 100} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Graph Visualization Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Knowledge Graph Visualization</CardTitle>
              <CardDescription>
                Interactive network visualization of knowledge relationships
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Network className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Graph visualization would render here</p>
                  <p className="text-sm text-gray-400">Interactive D3.js or similar network graph</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Usage Analytics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AnalyticsDashboard />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Knowledge Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {knowledgeItems
                    .sort((a, b) => b.usageCount - a.usageCount)
                    .slice(0, 5)
                    .map((item, index) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">#{index + 1}</span>
                          <span className="text-sm truncate">{item.title}</span>
                        </div>
                        <Badge variant="outline">{item.usageCount}</Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KnowledgeBase;