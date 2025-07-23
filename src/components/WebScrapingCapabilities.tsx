import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe2, Code2, FileText, Image, Download, Play, Settings } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ScrapingTool {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'error';
  capabilities: string[];
  usageCount: number;
}

const scrapingTools: ScrapingTool[] = [
  {
    id: 'firecrawl',
    name: 'Firecrawl',
    description: 'AI-powered web scraping with automatic content extraction',
    status: 'active',
    capabilities: ['HTML', 'Markdown', 'PDF', 'Images', 'Dynamic Content'],
    usageCount: 156
  },
  {
    id: 'cheerio',
    name: 'Cheerio Parser',
    description: 'Server-side jQuery-like HTML parsing',
    status: 'active',
    capabilities: ['HTML', 'CSS Selectors', 'DOM Manipulation'],
    usageCount: 89
  },
  {
    id: 'puppeteer',
    name: 'Puppeteer',
    description: 'Headless Chrome automation for dynamic content',
    status: 'inactive',
    capabilities: ['JavaScript Rendering', 'Screenshots', 'PDF Generation'],
    usageCount: 23
  },
  {
    id: 'playwright',
    name: 'Playwright',
    description: 'Cross-browser automation and scraping',
    status: 'active',
    capabilities: ['Multi-browser', 'Mobile Emulation', 'Network Interception'],
    usageCount: 67
  }
];

export default function WebScrapingCapabilities() {
  const [tools, setTools] = useState<ScrapingTool[]>(scrapingTools);
  const [targetUrl, setTargetUrl] = useState('');
  const [scrapingResults, setScrapingResults] = useState<any>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [selectedTool, setSelectedTool] = useState('firecrawl');
  const [extractionRules, setExtractionRules] = useState('');
  const { toast } = useToast();

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'secondary';
      case 'error': return 'destructive';
      default: return 'outline';
    }
  };

  const handleExtraction = async () => {
    if (!targetUrl.trim()) return;

    setIsExtracting(true);
    try {
      // Simulate web scraping
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResults = {
        url: targetUrl,
        title: "Sample Page Title",
        content: "This is the extracted content from the webpage. It includes all the main text content, structured data, and other relevant information that was scraped from the target URL.",
        metadata: {
          description: "Sample meta description from the page",
          keywords: ["web", "scraping", "automation"],
          author: "Sample Author",
          publishDate: "2024-01-15"
        },
        images: [
          "https://example.com/image1.jpg",
          "https://example.com/image2.jpg"
        ],
        links: [
          { text: "Internal Link 1", url: "/page1" },
          { text: "External Link", url: "https://external.com" }
        ],
        extractedData: {
          headings: ["Main Heading", "Subheading 1", "Subheading 2"],
          paragraphs: 5,
          tables: 1,
          forms: 0
        }
      };
      
      setScrapingResults(mockResults);
      toast({
        title: "Extraction completed",
        description: `Successfully scraped content from ${targetUrl}`,
      });
    } catch (error) {
      toast({
        title: "Extraction failed",
        description: "Unable to scrape the webpage. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExtracting(false);
    }
  };

  const toggleTool = (toolId: string) => {
    setTools(prev => prev.map(tool => 
      tool.id === toolId 
        ? { ...tool, status: tool.status === 'active' ? 'inactive' : 'active' }
        : tool
    ));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tools.map((tool) => (
          <Card key={tool.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Code2 className="h-5 w-5 text-primary" />
                <Badge variant={getStatusVariant(tool.status)}>
                  {tool.status}
                </Badge>
              </div>
              <CardTitle className="text-sm">{tool.name}</CardTitle>
              <CardDescription className="text-xs">
                {tool.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-1">
                {tool.capabilities.slice(0, 3).map((cap, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {cap}
                  </Badge>
                ))}
                {tool.capabilities.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{tool.capabilities.length - 3}
                  </Badge>
                )}
              </div>
              <div className="text-xs">
                <span className="text-muted-foreground">Usage: </span>
                <span className="font-medium">{tool.usageCount} extractions</span>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={tool.status === 'active' ? 'secondary' : 'default'}
                  onClick={() => toggleTool(tool.id)}
                  className="flex-1 text-xs"
                >
                  {tool.status === 'active' ? 'Disable' : 'Enable'}
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
            <Globe2 className="h-5 w-5" />
            Web Content Extraction
          </CardTitle>
          <CardDescription>
            Extract and analyze content from any webpage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="extract" className="space-y-4">
            <TabsList>
              <TabsTrigger value="extract">Extract Content</TabsTrigger>
              <TabsTrigger value="rules">Custom Rules</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
            </TabsList>

            <TabsContent value="extract" className="space-y-4">
              <div className="flex gap-2">
                <select 
                  value={selectedTool}
                  onChange={(e) => setSelectedTool(e.target.value)}
                  className="px-3 py-2 border rounded-md bg-background"
                >
                  {tools.filter(tool => tool.status === 'active').map(tool => (
                    <option key={tool.id} value={tool.id}>{tool.name}</option>
                  ))}
                </select>
                <Input
                  placeholder="Enter URL to scrape..."
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={handleExtraction}
                  disabled={isExtracting || !targetUrl.trim()}
                >
                  {isExtracting ? <Play className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                  Extract
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="rules" className="space-y-4">
              <div className="space-y-3">
                <label className="text-sm font-medium">Custom Extraction Rules (CSS Selectors/XPath)</label>
                <Textarea
                  placeholder="Enter custom extraction rules, e.g.:
title: h1
content: .main-content p
price: .price-display
images: img[src]"
                  value={extractionRules}
                  onChange={(e) => setExtractionRules(e.target.value)}
                  rows={8}
                />
                <Button size="sm">
                  Save Rules
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="results" className="space-y-4">
              {scrapingResults ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Extraction Results</h4>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Export JSON
                      </Button>
                      <Button size="sm" variant="outline">
                        <FileText className="h-4 w-4 mr-1" />
                        Export CSV
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <Card className="p-4">
                      <h5 className="font-medium mb-2">Basic Information</h5>
                      <div className="space-y-2 text-sm">
                        <div><strong>URL:</strong> {scrapingResults.url}</div>
                        <div><strong>Title:</strong> {scrapingResults.title}</div>
                        <div><strong>Description:</strong> {scrapingResults.metadata.description}</div>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h5 className="font-medium mb-2">Extracted Content</h5>
                      <div className="bg-muted p-3 rounded text-sm">
                        {scrapingResults.content}
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h5 className="font-medium mb-2">Metadata</h5>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong>Headings:</strong> {scrapingResults.extractedData.headings.length}
                        </div>
                        <div>
                          <strong>Paragraphs:</strong> {scrapingResults.extractedData.paragraphs}
                        </div>
                        <div>
                          <strong>Images:</strong> {scrapingResults.images.length}
                        </div>
                        <div>
                          <strong>Links:</strong> {scrapingResults.links.length}
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Globe2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No extraction results yet. Run an extraction to see results here.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}