import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Brain, 
  Database, 
  Cpu, 
  Activity, 
  Target, 
  Layers, 
  Workflow, 
  Settings,
  Users,
  MessageSquare,
  BarChart3,
  Shield,
  Zap,
  Camera,
  Mic,
  FileText,
  ChevronRight,
  Play,
  ArrowRight,
  ArrowLeft,
  Home
} from "lucide-react";

const ApplicationPresentation = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const modules = [
    {
      title: "Agent Management",
      icon: Users,
      description: "Intelligent AI agents for specialized tasks",
      useCases: [
        "Customer service automation",
        "Technical support assistance",
        "Content generation",
        "Data analysis and insights"
      ],
      operation: "Agents are deployed with specific roles, trained on domain data, and continuously optimized through reinforcement learning.",
      features: ["Multi-agent coordination", "Role-based specialization", "Performance tracking", "Auto-scaling"]
    },
    {
      title: "Knowledge Base",
      icon: Database,
      description: "Centralized repository of structured information",
      useCases: [
        "Document management",
        "FAQ automation",
        "Research and insights",
        "Knowledge discovery"
      ],
      operation: "Knowledge is ingested, processed, vectorized, and made searchable through semantic understanding.",
      features: ["Semantic search", "Auto-categorization", "Version control", "Access permissions"]
    },
    {
      title: "Memory System",
      icon: Brain,
      description: "Long-term and short-term memory for contextual AI",
      useCases: [
        "Conversation continuity",
        "User preference learning",
        "Historical context retention",
        "Personalized responses"
      ],
      operation: "Memory stores interactions, learns patterns, and provides context for future conversations.",
      features: ["Contextual memory", "Pattern recognition", "Memory consolidation", "Selective retention"]
    },
    {
      title: "Reasoning Engine",
      icon: Cpu,
      description: "Advanced logical reasoning and decision making",
      useCases: [
        "Complex problem solving",
        "Decision support",
        "Strategy planning",
        "Risk assessment"
      ],
      operation: "Processes information through multiple reasoning chains to reach logical conclusions.",
      features: ["Multi-step reasoning", "Causal analysis", "Probabilistic inference", "Chain-of-thought"]
    },
    {
      title: "Execution Engine",
      icon: Zap,
      description: "Automated task execution and workflow management",
      useCases: [
        "Process automation",
        "Task orchestration",
        "API integrations",
        "Workflow optimization"
      ],
      operation: "Executes tasks based on reasoning outputs with monitoring and error handling.",
      features: ["Task scheduling", "Error recovery", "Performance monitoring", "Resource optimization"]
    },
    {
      title: "Multi-Modal Processing",
      icon: Camera,
      description: "Process text, audio, images, and video",
      useCases: [
        "Document analysis",
        "Voice interaction",
        "Image recognition",
        "Video processing"
      ],
      operation: "Unified processing pipeline for different media types with cross-modal understanding.",
      features: ["Speech-to-text", "Text-to-speech", "Image analysis", "Video understanding"]
    },
    {
      title: "Reinforcement Learning",
      icon: Target,
      description: "Continuous learning and improvement system",
      useCases: [
        "Performance optimization",
        "Adaptive behavior",
        "User satisfaction improvement",
        "Automated tuning"
      ],
      operation: "Learns from feedback and interactions to continuously improve performance metrics.",
      features: ["Feedback loops", "Reward optimization", "Policy updates", "A/B testing"]
    },
    {
      title: "System Monitoring",
      icon: Activity,
      description: "Real-time system health and performance tracking",
      useCases: [
        "Performance monitoring",
        "Error detection",
        "Resource optimization",
        "Predictive maintenance"
      ],
      operation: "Monitors all system components with alerts, analytics, and automated responses.",
      features: ["Real-time metrics", "Alert system", "Predictive analytics", "Auto-scaling"]
    }
  ];

  const architectureFlow = [
    { step: 1, title: "Input Processing", description: "Multi-modal data ingestion" },
    { step: 2, title: "Knowledge Integration", description: "Context and memory retrieval" },
    { step: 3, title: "Reasoning", description: "Logical analysis and planning" },
    { step: 4, title: "Agent Coordination", description: "Task distribution and collaboration" },
    { step: 5, title: "Execution", description: "Action implementation and monitoring" },
    { step: 6, title: "Learning", description: "Feedback integration and optimization" }
  ];

  const businessBenefits = [
    {
      category: "Efficiency",
      benefits: ["80% reduction in response time", "50% decrease in operational costs", "24/7 availability"]
    },
    {
      category: "Scalability",
      benefits: ["Handle 1000+ concurrent users", "Auto-scaling based on demand", "Multi-tenant architecture"]
    },
    {
      category: "Intelligence",
      benefits: ["Context-aware responses", "Continuous learning", "Predictive insights"]
    },
    {
      category: "Integration",
      benefits: ["API-first design", "Multi-platform support", "Enterprise security"]
    }
  ];

  const slides = [
    "Overview",
    "Core Modules",
    "Architecture",
    "Use Cases",
    "Business Benefits",
    "Technical Specifications"
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Go Back Navigation */}
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Go Back</span>
        </Button>
        
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="flex items-center space-x-2"
        >
          <Home className="h-4 w-4" />
          <span>Dashboard</span>
        </Button>
      </div>

      {/* Presentation Header */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          AI Intelligence Platform
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Comprehensive AI system featuring multi-agent coordination, advanced reasoning, and continuous learning capabilities
        </p>
        <div className="flex justify-center space-x-4">
          <Badge variant="secondary" className="text-sm px-3 py-1">Enterprise Ready</Badge>
          <Badge variant="secondary" className="text-sm px-3 py-1">Multi-Modal</Badge>
          <Badge variant="secondary" className="text-sm px-3 py-1">Self-Learning</Badge>
        </div>
      </div>

      {/* Slide Navigation */}
      <div className="flex justify-center space-x-2 mb-8">
        {slides.map((slide, index) => (
          <Button
            key={slide}
            variant={currentSlide === index ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentSlide(index)}
            className="text-xs"
          >
            {slide}
          </Button>
        ))}
      </div>

      {/* Slide Content */}
      <div className="min-h-[600px]">
        {currentSlide === 0 && (
          <Card className="p-8">
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold">System Overview</h2>
                  <p className="text-lg text-muted-foreground">
                    A comprehensive AI platform that combines multiple specialized modules to deliver 
                    intelligent, adaptive, and scalable solutions for enterprise applications.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>8 Core AI Modules</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-secondary rounded-full"></div>
                      <span>Multi-Modal Processing</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      <span>Continuous Learning</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Key Capabilities</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <MessageSquare className="h-6 w-6 mb-2 text-primary" />
                      <div className="text-sm font-medium">Natural Language</div>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <Brain className="h-6 w-6 mb-2 text-primary" />
                      <div className="text-sm font-medium">Advanced Reasoning</div>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <Workflow className="h-6 w-6 mb-2 text-primary" />
                      <div className="text-sm font-medium">Task Automation</div>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <BarChart3 className="h-6 w-6 mb-2 text-primary" />
                      <div className="text-sm font-medium">Analytics & Insights</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {currentSlide === 1 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-center">Core Modules</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((module, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <module.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{module.title}</CardTitle>
                        <CardDescription className="text-sm">{module.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Use Cases:</h4>
                      <ul className="text-sm space-y-1">
                        {module.useCases.map((useCase, i) => (
                          <li key={i} className="flex items-center space-x-2">
                            <div className="w-1 h-1 bg-primary rounded-full"></div>
                            <span>{useCase}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Operation:</h4>
                      <p className="text-sm text-muted-foreground">{module.operation}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {currentSlide === 2 && (
          <Card className="p-8">
            <CardContent className="space-y-6">
              <h2 className="text-3xl font-bold text-center">System Architecture</h2>
              <div className="space-y-8">
                <div className="flex justify-center">
                  <div className="flex items-center space-x-4">
                    {architectureFlow.map((step, index) => (
                      <div key={index} className="flex items-center">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold mb-2">
                            {step.step}
                          </div>
                          <div className="text-sm font-medium">{step.title}</div>
                          <div className="text-xs text-muted-foreground max-w-24">{step.description}</div>
                        </div>
                        {index < architectureFlow.length - 1 && (
                          <ArrowRight className="h-6 w-6 text-muted-foreground mx-4" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Layers className="h-5 w-5" />
                        <span>Data Layer</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm space-y-1">
                        <li>• Knowledge Base</li>
                        <li>• Memory Systems</li>
                        <li>• User Profiles</li>
                        <li>• Training Data</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Brain className="h-5 w-5" />
                        <span>Intelligence Layer</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm space-y-1">
                        <li>• Reasoning Engine</li>
                        <li>• Agent Coordination</li>
                        <li>• Learning Algorithms</li>
                        <li>• Decision Making</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Zap className="h-5 w-5" />
                        <span>Execution Layer</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm space-y-1">
                        <li>• Task Execution</li>
                        <li>• API Integrations</li>
                        <li>• Monitoring</li>
                        <li>• Response Generation</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {currentSlide === 3 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-center">Real-World Use Cases</h2>
            <Tabs defaultValue="enterprise" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="enterprise">Enterprise</TabsTrigger>
                <TabsTrigger value="customer">Customer Service</TabsTrigger>
                <TabsTrigger value="healthcare">Healthcare</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
              </TabsList>
              
              <TabsContent value="enterprise" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Enterprise Operations</CardTitle>
                    <CardDescription>Streamline business processes with intelligent automation</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-2">Document Processing</h4>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                          <li>• Automated contract analysis</li>
                          <li>• Invoice processing and validation</li>
                          <li>• Report generation from data</li>
                          <li>• Compliance monitoring</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Decision Support</h4>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                          <li>• Risk assessment and analysis</li>
                          <li>• Market trend prediction</li>
                          <li>• Resource optimization</li>
                          <li>• Strategic planning assistance</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="customer" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Service Excellence</CardTitle>
                    <CardDescription>24/7 intelligent customer support with human-like understanding</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-2">Support Automation</h4>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                          <li>• Intelligent ticket routing</li>
                          <li>• Instant FAQ responses</li>
                          <li>• Multi-language support</li>
                          <li>• Escalation management</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Personalization</h4>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                          <li>• Customer history analysis</li>
                          <li>• Personalized recommendations</li>
                          <li>• Sentiment analysis</li>
                          <li>• Proactive issue resolution</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="healthcare" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Healthcare Intelligence</CardTitle>
                    <CardDescription>AI-powered healthcare support and decision assistance</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-2">Clinical Support</h4>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                          <li>• Symptom analysis and triage</li>
                          <li>• Medical record summarization</li>
                          <li>• Drug interaction checking</li>
                          <li>• Treatment plan optimization</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Administrative</h4>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                          <li>• Appointment scheduling</li>
                          <li>• Insurance verification</li>
                          <li>• Billing automation</li>
                          <li>• Regulatory compliance</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="education" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Educational Technology</CardTitle>
                    <CardDescription>Personalized learning and administrative efficiency</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-2">Learning Support</h4>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                          <li>• Adaptive learning paths</li>
                          <li>• Automated grading</li>
                          <li>• Student progress tracking</li>
                          <li>• Personalized tutoring</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Administration</h4>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                          <li>• Curriculum planning</li>
                          <li>• Resource allocation</li>
                          <li>• Performance analytics</li>
                          <li>• Parent communication</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {currentSlide === 4 && (
          <Card className="p-8">
            <CardContent className="space-y-6">
              <h2 className="text-3xl font-bold text-center">Business Benefits</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {businessBenefits.map((category, index) => (
                  <Card key={index} className="text-center">
                    <CardHeader>
                      <CardTitle className="text-lg">{category.category}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {category.benefits.map((benefit, i) => (
                          <li key={i} className="text-sm text-muted-foreground">
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Separator className="my-8" />
              
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="text-center">
                  <CardHeader>
                    <CardTitle className="text-4xl font-bold text-primary">95%</CardTitle>
                    <CardDescription>Accuracy Rate</CardDescription>
                  </CardHeader>
                </Card>
                <Card className="text-center">
                  <CardHeader>
                    <CardTitle className="text-4xl font-bold text-primary">24/7</CardTitle>
                    <CardDescription>Availability</CardDescription>
                  </CardHeader>
                </Card>
                <Card className="text-center">
                  <CardHeader>
                    <CardTitle className="text-4xl font-bold text-primary">10x</CardTitle>
                    <CardDescription>Faster Processing</CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </CardContent>
          </Card>
        )}

        {currentSlide === 5 && (
          <Card className="p-8">
            <CardContent className="space-y-6">
              <h2 className="text-3xl font-bold text-center">Technical Specifications</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Settings className="h-5 w-5" />
                        <span>Core Technologies</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">React + TypeScript</span>
                          <Badge variant="secondary">Frontend</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Supabase</span>
                          <Badge variant="secondary">Backend</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">PostgreSQL</span>
                          <Badge variant="secondary">Database</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Edge Functions</span>
                          <Badge variant="secondary">Compute</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Shield className="h-5 w-5" />
                        <span>Security Features</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm space-y-2">
                        <li>• Row Level Security (RLS)</li>
                        <li>• JWT Authentication</li>
                        <li>• Data encryption at rest</li>
                        <li>• API rate limiting</li>
                        <li>• Audit logging</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Activity className="h-5 w-5" />
                        <span>Performance Metrics</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Response Time</span>
                            <span>&lt; 200ms</span>
                          </div>
                          <Progress value={95} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Uptime</span>
                            <span>99.9%</span>
                          </div>
                          <Progress value={99.9} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Accuracy</span>
                            <span>95%</span>
                          </div>
                          <Progress value={95} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Workflow className="h-5 w-5" />
                        <span>Integration Options</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm space-y-2">
                        <li>• REST API endpoints</li>
                        <li>• Webhook integrations</li>
                        <li>• SDK libraries</li>
                        <li>• Custom connectors</li>
                        <li>• Enterprise SSO</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
          disabled={currentSlide === 0}
        >
          Previous
        </Button>
        
        <div className="flex space-x-1">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentSlide ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
        
        <Button
          variant="outline"
          onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
          disabled={currentSlide === slides.length - 1}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ApplicationPresentation;