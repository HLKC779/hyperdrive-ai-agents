import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Database, 
  Search, 
  RefreshCw, 
  Trash2, 
  Eye, 
  Brain,
  HardDrive,
  Network,
  Clock,
  Layers,
  Zap,
  BarChart3
} from 'lucide-react';

interface MemoryEntry {
  id: string;
  type: 'episodic' | 'semantic' | 'working' | 'procedural';
  content: string;
  timestamp: string;
  relevance: number;
  size: number;
  agentId: string;
}

interface MemoryStore {
  name: string;
  type: 'redis' | 'postgresql' | 'neo4j' | 'vector';
  usage: number;
  capacity: number;
  status: 'healthy' | 'warning' | 'error';
  latency: number;
  entries: number;
}

const MemorySystem = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMemoryType, setSelectedMemoryType] = useState<string>('all');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);
  const { toast } = useToast();

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      // Simulate memory synchronization process
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: "Memory Sync Complete",
        description: "All memory stores have been synchronized successfully.",
      });
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "Failed to synchronize memory stores. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCleanup = async () => {
    setIsCleaning(true);
    try {
      // Simulate memory cleanup process
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({
        title: "Memory Cleanup Complete",
        description: "Removed 247 duplicate entries and freed 12.3 MB of storage.",
      });
    } catch (error) {
      toast({
        title: "Cleanup Failed",
        description: "Failed to clean up memory stores. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCleaning(false);
    }
  };

  const memoryStores: MemoryStore[] = [
    {
      name: 'Short-term Memory',
      type: 'redis',
      usage: 67,
      capacity: 16384, // MB
      status: 'healthy',
      latency: 0.8,
      entries: 45672
    },
    {
      name: 'Long-term Storage',
      type: 'postgresql',
      usage: 34,
      capacity: 512000, // MB
      status: 'healthy',
      latency: 12.3,
      entries: 2847391
    },
    {
      name: 'Knowledge Graph',
      type: 'neo4j',
      usage: 45,
      capacity: 128000, // MB
      status: 'warning',
      latency: 25.7,
      entries: 198573
    },
    {
      name: 'Vector Embeddings',
      type: 'vector',
      usage: 78,
      capacity: 256000, // MB
      status: 'healthy',
      latency: 3.2,
      entries: 1247832
    }
  ];

  const recentMemories: MemoryEntry[] = [
    {
      id: 'mem-001',
      type: 'episodic',
      content: 'User requested analysis of Q3 financial data with focus on revenue trends',
      timestamp: '2 minutes ago',
      relevance: 95,
      size: 2.4,
      agentId: 'agent-001'
    },
    {
      id: 'mem-002',
      type: 'semantic',
      content: 'Python best practices for error handling in async functions',
      timestamp: '5 minutes ago',
      relevance: 88,
      size: 1.2,
      agentId: 'agent-002'
    },
    {
      id: 'mem-003',
      type: 'working',
      content: 'Current task context: Code review for authentication module',
      timestamp: '1 minute ago',
      relevance: 92,
      size: 0.8,
      agentId: 'agent-002'
    },
    {
      id: 'mem-004',
      type: 'procedural',
      content: 'Step-by-step process for deploying ML models to production',
      timestamp: '10 minutes ago',
      relevance: 76,
      size: 3.1,
      agentId: 'agent-003'
    }
  ];

  const getStatusColor = (status: MemoryStore['status']) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getMemoryTypeColor = (type: MemoryEntry['type']) => {
    switch (type) {
      case 'episodic':
        return 'bg-blue-100 text-blue-800';
      case 'semantic':
        return 'bg-green-100 text-green-800';
      case 'working':
        return 'bg-yellow-100 text-yellow-800';
      case 'procedural':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredMemories = recentMemories.filter(memory => {
    const matchesSearch = memory.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedMemoryType === 'all' || memory.type === selectedMemoryType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Memory System</h2>
          <p className="text-muted-foreground">Hybrid memory architecture management</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSync}
            disabled={isSyncing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync'}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCleanup}
            disabled={isCleaning}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {isCleaning ? 'Cleaning...' : 'Cleanup'}
          </Button>
        </div>
      </div>

      {/* Memory Store Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {memoryStores.map((store, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{store.name}</CardTitle>
                <Badge variant="outline" className={getStatusColor(store.status)}>
                  {store.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {store.type === 'redis' && <HardDrive className="h-3 w-3" />}
                {store.type === 'postgresql' && <Database className="h-3 w-3" />}
                {store.type === 'neo4j' && <Network className="h-3 w-3" />}
                {store.type === 'vector' && <Layers className="h-3 w-3" />}
                {store.type.toUpperCase()}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Usage</span>
                  <span>{store.usage}%</span>
                </div>
                <Progress value={store.usage} className="h-1.5" />
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-muted-foreground">Latency</p>
                  <p className="font-medium">{store.latency}ms</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Entries</p>
                  <p className="font-medium">{store.entries.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Memory Management Tabs */}
      <Tabs defaultValue="browse" className="space-y-4">
        <TabsList>
          <TabsTrigger value="browse">Browse Memory</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="consolidation">Consolidation</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4">
          {/* Search and Filter */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Memory Explorer</CardTitle>
              <CardDescription>Search and browse stored memories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search memories..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <select
                  value={selectedMemoryType}
                  onChange={(e) => setSelectedMemoryType(e.target.value)}
                  className="px-3 py-2 border rounded-md bg-background"
                >
                  <option value="all">All Types</option>
                  <option value="episodic">Episodic</option>
                  <option value="semantic">Semantic</option>
                  <option value="working">Working</option>
                  <option value="procedural">Procedural</option>
                </select>
              </div>

              {/* Memory Entries */}
              <div className="space-y-3">
                {filteredMemories.map((memory) => (
                  <div key={memory.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge className={getMemoryTypeColor(memory.type)}>
                          {memory.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Agent: {memory.agentId}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          Relevance: {memory.relevance}%
                        </span>
                        <Button size="sm" variant="ghost">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm mb-2">{memory.content}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {memory.timestamp}
                        </span>
                        <span>Size: {memory.size} KB</span>
                      </div>
                      <span>ID: {memory.id}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Memory Analytics
              </CardTitle>
              <CardDescription>Performance metrics and usage patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold">4.2M</p>
                  <p className="text-sm text-muted-foreground">Total Memories</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">89%</p>
                  <p className="text-sm text-muted-foreground">Retrieval Accuracy</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">12ms</p>
                  <p className="text-sm text-muted-foreground">Avg Access Time</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consolidation">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Memory Consolidation
              </CardTitle>
              <CardDescription>Optimize and organize stored memories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Automatic Consolidation</h4>
                    <p className="text-sm text-muted-foreground">
                      Merge similar memories and remove duplicates
                    </p>
                  </div>
                  <Button variant="outline">
                    <Zap className="h-4 w-4 mr-2" />
                    Run Now
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Archive Old Memories</h4>
                    <p className="text-sm text-muted-foreground">
                      Move unused memories to long-term storage
                    </p>
                  </div>
                  <Button variant="outline">
                    <HardDrive className="h-4 w-4 mr-2" />
                    Archive
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Memory System Settings</CardTitle>
              <CardDescription>Configure memory storage and retrieval parameters</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Memory configuration options coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MemorySystem;