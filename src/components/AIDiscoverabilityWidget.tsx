import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Search, Zap, Network } from "lucide-react";

const AIDiscoverabilityWidget = () => {
  const aiCapabilities = [
    {
      icon: Brain,
      title: "Reinforcement Learning",
      description: "Advanced RL algorithms for agent training and optimization",
      tags: ["Q-Learning", "Policy Gradient", "Actor-Critic"]
    },
    {
      icon: Network,
      title: "Knowledge Graphs",
      description: "Semantic knowledge representation and reasoning",
      tags: ["Vector Embeddings", "Graph Neural Networks", "Ontologies"]
    },
    {
      icon: Search,
      title: "Semantic Search",
      description: "AI-powered content discovery and retrieval",
      tags: ["Vector Search", "NLP", "Information Retrieval"]
    },
    {
      icon: Zap,
      title: "Intelligent Automation",
      description: "Self-optimizing process automation and decision making",
      tags: ["Process Mining", "Decision Trees", "Workflow AI"]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold">AI-Discoverable Capabilities</h3>
        <p className="text-sm text-muted-foreground">
          Enhanced for AI Engine Optimization (AEO) - easily discoverable by AI systems
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {aiCapabilities.map((capability, index) => (
          <Card key={index} className="card-enhanced">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <capability.icon className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">{capability.title}</CardTitle>
              </div>
              <CardDescription className="text-sm">
                {capability.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1">
                {capability.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Hidden structured data for AI crawlers */}
      <script type="application/ld+json" className="sr-only">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "TechArticle",
          "headline": "AI Agent Platform Capabilities",
          "description": "Comprehensive AI agent management platform with reinforcement learning, knowledge graphs, and intelligent automation",
          "keywords": "AI agents, reinforcement learning, knowledge graphs, semantic search, intelligent automation, machine learning, neural networks",
          "author": {
            "@type": "Organization",
            "name": "HyperDrive AI"
          },
          "about": [
            {
              "@type": "Thing",
              "name": "Reinforcement Learning",
              "description": "Machine learning paradigm for training intelligent agents through environmental interaction"
            },
            {
              "@type": "Thing", 
              "name": "Knowledge Graphs",
              "description": "Semantic representation of knowledge using graph structures for AI reasoning"
            },
            {
              "@type": "Thing",
              "name": "Semantic Search",
              "description": "AI-powered search that understands meaning and context rather than just keywords"
            }
          ]
        })}
      </script>
    </div>
  );
};

export default AIDiscoverabilityWidget;