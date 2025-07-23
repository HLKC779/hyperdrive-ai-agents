import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Search, Globe, Zap, Settings } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface SearchAPI {
  id: string;
  name: string;
  provider: string;
  status: 'active' | 'inactive' | 'error';
  rateLimitPerMin: number;
  usedToday: number;
  apiKeyRequired: boolean;
}

const searchAPIs: SearchAPI[] = [
  {
    id: 'google-search',
    name: 'Google Custom Search',
    provider: 'Google',
    status: 'active',
    rateLimitPerMin: 100,
    usedToday: 245,
    apiKeyRequired: true
  },
  {
    id: 'bing-search',
    name: 'Bing Web Search',
    provider: 'Microsoft',
    status: 'active',
    rateLimitPerMin: 1000,
    usedToday: 89,
    apiKeyRequired: true
  },
  {
    id: 'duckduckgo',
    name: 'DuckDuckGo Instant Answer',
    provider: 'DuckDuckGo',
    status: 'active',
    rateLimitPerMin: 60,
    usedToday: 156,
    apiKeyRequired: false
  },
  {
    id: 'serp-api',
    name: 'SerpAPI',
    provider: 'SerpAPI',
    status: 'inactive',
    rateLimitPerMin: 100,
    usedToday: 0,
    apiKeyRequired: true
  }
];

export default function SearchAPIIntegration() {
  const [apis, setApis] = useState<SearchAPI[]>(searchAPIs);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedAPI, setSelectedAPI] = useState<string>('duckduckgo');
  const { toast } = useToast();

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'secondary';
      case 'error': return 'destructive';
      default: return 'outline';
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      // Simulate search API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockResults = [
        {
          title: "Sample Search Result 1",
          url: "https://example1.com",
          snippet: "This is a sample search result snippet that would be returned from the search API..."
        },
        {
          title: "Sample Search Result 2", 
          url: "https://example2.com",
          snippet: "Another sample result showing how the search integration would work in practice..."
        },
        {
          title: "Sample Search Result 3",
          url: "https://example3.com", 
          snippet: "Third result demonstrating the search API integration capabilities..."
        }
      ];
      
      setSearchResults(mockResults);
      toast({
        title: "Search completed",
        description: `Found ${mockResults.length} results using ${apis.find(api => api.id === selectedAPI)?.name}`,
      });
    } catch (error) {
      toast({
        title: "Search failed",
        description: "Unable to perform search. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const toggleAPI = (apiId: string) => {
    setApis(prev => prev.map(api => 
      api.id === apiId 
        ? { ...api, status: api.status === 'active' ? 'inactive' : 'active' }
        : api
    ));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {apis.map((api) => (
          <Card key={api.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Globe className="h-5 w-5 text-primary" />
                <Badge variant={getStatusVariant(api.status)}>
                  {api.status}
                </Badge>
              </div>
              <CardTitle className="text-sm">{api.name}</CardTitle>
              <CardDescription className="text-xs">
                {api.provider}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span>Rate Limit:</span>
                  <span>{api.rateLimitPerMin}/min</span>
                </div>
                <div className="flex justify-between">
                  <span>Used Today:</span>
                  <span>{api.usedToday}</span>
                </div>
                <div className="flex justify-between">
                  <span>API Key:</span>
                  <span>{api.apiKeyRequired ? 'Required' : 'Not needed'}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={api.status === 'active' ? 'secondary' : 'default'}
                  onClick={() => toggleAPI(api.id)}
                  className="flex-1 text-xs"
                >
                  {api.status === 'active' ? 'Disable' : 'Enable'}
                </Button>
                <Button size="sm" variant="outline" className="px-2">
                  <Settings className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Test Interface
          </CardTitle>
          <CardDescription>
            Test your search API integrations with live queries
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <select 
              value={selectedAPI}
              onChange={(e) => setSelectedAPI(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              {apis.filter(api => api.status === 'active').map(api => (
                <option key={api.id} value={api.id}>{api.name}</option>
              ))}
            </select>
            <Input
              placeholder="Enter search query..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button 
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
            >
              {isSearching ? <Zap className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              Search
            </Button>
          </div>

          {searchResults.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold">Search Results:</h4>
              {searchResults.map((result, index) => (
                <Card key={index} className="p-4">
                  <h5 className="font-medium text-primary hover:underline cursor-pointer">
                    {result.title}
                  </h5>
                  <p className="text-sm text-muted-foreground mt-1">{result.url}</p>
                  <p className="text-sm mt-2">{result.snippet}</p>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}