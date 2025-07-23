import React, { useCallback, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Node,
  Edge,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, Zap, MessageCircle, Calendar, MapPin, TrendingUp } from 'lucide-react';

// Custom Node Types
const DecisionNode = ({ data }: { data: any }) => (
  <div className="decision-node bg-blue-50 border-2 border-blue-300 rounded-lg p-4 min-w-48">
    <div className="flex items-center gap-2 mb-2">
      <Brain className="h-4 w-4 text-blue-600" />
      <span className="font-semibold text-blue-800">Decision Point</span>
    </div>
    <p className="text-sm text-gray-700">{data.label}</p>
    <Badge variant="outline" className="mt-2 text-xs">
      {data.agentType}
    </Badge>
  </div>
);

const ThoughtNode = ({ data }: { data: any }) => (
  <div className="thought-node bg-green-50 border-2 border-green-300 rounded-lg p-4 min-w-48">
    <div className="flex items-center gap-2 mb-2">
      <Zap className="h-4 w-4 text-green-600" />
      <span className="font-semibold text-green-800">Chain of Thought</span>
    </div>
    <p className="text-sm text-gray-700">{data.label}</p>
    <div className="mt-2 text-xs text-green-600">
      Confidence: {data.confidence}%
    </div>
  </div>
);

const ActionNode = ({ data }: { data: any }) => (
  <div className="action-node bg-orange-50 border-2 border-orange-300 rounded-lg p-4 min-w-48">
    <div className="flex items-center gap-2 mb-2">
      <Zap className="h-4 w-4 text-orange-600" />
      <span className="font-semibold text-orange-800">Action</span>
    </div>
    <p className="text-sm text-gray-700">{data.label}</p>
    <Badge variant="secondary" className="mt-2 text-xs">
      {data.actionType}
    </Badge>
  </div>
);

const ConditionNode = ({ data }: { data: any }) => (
  <div className="condition-node bg-purple-50 border-2 border-purple-300 rounded-diamond p-4 min-w-48 transform rotate-45">
    <div className="transform -rotate-45">
      <div className="flex items-center justify-center mb-1">
        <span className="font-semibold text-purple-800 text-sm text-center">{data.label}</span>
      </div>
    </div>
  </div>
);

const nodeTypes = {
  decision: DecisionNode,
  thought: ThoughtNode,
  action: ActionNode,
  condition: ConditionNode,
};

// Initial decision tree for Email Agent
const emailAgentNodes: Node[] = [
  {
    id: 'start',
    type: 'decision',
    position: { x: 250, y: 0 },
    data: { 
      label: 'Incoming Email Request',
      agentType: 'Email Agent'
    },
  },
  {
    id: 'analyze',
    type: 'thought',
    position: { x: 250, y: 120 },
    data: { 
      label: 'Analyze email content, sender priority, and urgency indicators',
      confidence: 95
    },
  },
  {
    id: 'priority-check',
    type: 'condition',
    position: { x: 250, y: 240 },
    data: { 
      label: 'High Priority?'
    },
  },
  {
    id: 'urgent-response',
    type: 'action',
    position: { x: 100, y: 360 },
    data: { 
      label: 'Send immediate auto-response and escalate to human',
      actionType: 'Urgent'
    },
  },
  {
    id: 'template-match',
    type: 'thought',
    position: { x: 400, y: 360 },
    data: { 
      label: 'Search for matching response templates based on content analysis',
      confidence: 88
    },
  },
  {
    id: 'compose-response',
    type: 'action',
    position: { x: 400, y: 480 },
    data: { 
      label: 'Compose personalized response using best template match',
      actionType: 'Standard'
    },
  },
];

const emailAgentEdges: Edge[] = [
  {
    id: 'e1',
    source: 'start',
    target: 'analyze',
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: 'e2',
    source: 'analyze',
    target: 'priority-check',
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: 'e3',
    source: 'priority-check',
    target: 'urgent-response',
    label: 'Yes',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#ef4444' },
  },
  {
    id: 'e4',
    source: 'priority-check',
    target: 'template-match',
    label: 'No',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#22c55e' },
  },
  {
    id: 'e5',
    source: 'template-match',
    target: 'compose-response',
    markerEnd: { type: MarkerType.ArrowClosed },
  },
];

// Decision trees for other agents
const agentDecisionTrees = {
  email: {
    nodes: emailAgentNodes,
    edges: emailAgentEdges,
  },
  booking: {
    nodes: [
      {
        id: 'booking-start',
        type: 'decision',
        position: { x: 250, y: 0 },
        data: { 
          label: 'Booking Request Received',
          agentType: 'Booking Agent'
        },
      },
      {
        id: 'validate-request',
        type: 'thought',
        position: { x: 250, y: 120 },
        data: { 
          label: 'Validate booking details: dates, preferences, budget constraints',
          confidence: 92
        },
      },
      {
        id: 'availability-check',
        type: 'condition',
        position: { x: 250, y: 240 },
        data: { 
          label: 'Available?'
        },
      },
      {
        id: 'book-service',
        type: 'action',
        position: { x: 400, y: 360 },
        data: { 
          label: 'Process booking and send confirmation',
          actionType: 'Booking'
        },
      },
      {
        id: 'suggest-alternatives',
        type: 'action',
        position: { x: 100, y: 360 },
        data: { 
          label: 'Suggest alternative options and dates',
          actionType: 'Alternative'
        },
      },
    ],
    edges: [
      {
        id: 'be1',
        source: 'booking-start',
        target: 'validate-request',
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: 'be2',
        source: 'validate-request',
        target: 'availability-check',
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: 'be3',
        source: 'availability-check',
        target: 'book-service',
        label: 'Yes',
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { stroke: '#22c55e' },
      },
      {
        id: 'be4',
        source: 'availability-check',
        target: 'suggest-alternatives',
        label: 'No',
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { stroke: '#f59e0b' },
      },
    ],
  },
  intelligence: {
    nodes: [
      {
        id: 'data-start',
        type: 'decision',
        position: { x: 250, y: 0 },
        data: { 
          label: 'Data Request Received',
          agentType: 'Intelligence Agent'
        },
      },
      {
        id: 'identify-sources',
        type: 'thought',
        position: { x: 250, y: 120 },
        data: { 
          label: 'Identify relevant data sources and APIs for requested information',
          confidence: 97
        },
      },
      {
        id: 'real-time-check',
        type: 'condition',
        position: { x: 250, y: 240 },
        data: { 
          label: 'Real-time data?'
        },
      },
      {
        id: 'live-fetch',
        type: 'action',
        position: { x: 400, y: 360 },
        data: { 
          label: 'Fetch live data from APIs and format report',
          actionType: 'Live Data'
        },
      },
      {
        id: 'cached-data',
        type: 'action',
        position: { x: 100, y: 360 },
        data: { 
          label: 'Retrieve from cache and update if stale',
          actionType: 'Cached Data'
        },
      },
    ],
    edges: [
      {
        id: 'ie1',
        source: 'data-start',
        target: 'identify-sources',
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: 'ie2',
        source: 'identify-sources',
        target: 'real-time-check',
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: 'ie3',
        source: 'real-time-check',
        target: 'live-fetch',
        label: 'Yes',
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { stroke: '#3b82f6' },
      },
      {
        id: 'ie4',
        source: 'real-time-check',
        target: 'cached-data',
        label: 'No',
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { stroke: '#6b7280' },
      },
    ],
  },
};

const AgentDecisionTree = () => {
  const [selectedAgent, setSelectedAgent] = useState<string>('email');
  const [nodes, setNodes, onNodesChange] = useNodesState(agentDecisionTrees.email.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(agentDecisionTrees.email.edges);
  const [isSimulating, setIsSimulating] = useState(false);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const handleAgentChange = (agentType: string) => {
    setSelectedAgent(agentType);
    const treeData = agentDecisionTrees[agentType as keyof typeof agentDecisionTrees];
    if (treeData) {
      setNodes(treeData.nodes);
      setEdges(treeData.edges);
    }
  };

  const simulateDecisionFlow = async () => {
    setIsSimulating(true);
    
    // Simulate step-by-step decision making
    const nodeIds = nodes.map(n => n.id);
    
    for (let i = 0; i < nodeIds.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setNodes(prevNodes => 
        prevNodes.map(node => ({
          ...node,
          style: {
            ...node.style,
            ...(node.id === nodeIds[i] ? {
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.6)',
              border: '2px solid #3b82f6'
            } : {})
          }
        }))
      );
    }
    
    // Reset after simulation
    setTimeout(() => {
      setNodes(prevNodes => 
        prevNodes.map(node => ({
          ...node,
          style: {}
        }))
      );
      setIsSimulating(false);
    }, 2000);
  };

  const getAgentIcon = (agentType: string) => {
    switch (agentType) {
      case 'email': return <MessageCircle className="h-4 w-4" />;
      case 'booking': return <Calendar className="h-4 w-4" />;
      case 'intelligence': return <TrendingUp className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Agent Decision Tree & Chain of Thought
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Select Agent:</label>
              <Select value={selectedAgent} onValueChange={handleAgentChange}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4" />
                      Email Agent
                    </div>
                  </SelectItem>
                  <SelectItem value="booking">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Booking Agent
                    </div>
                  </SelectItem>
                  <SelectItem value="intelligence">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Intelligence Agent
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={simulateDecisionFlow}
              disabled={isSimulating}
              className="flex items-center gap-2"
            >
              <Zap className="h-4 w-4" />
              {isSimulating ? 'Simulating...' : 'Simulate Decision Flow'}
            </Button>
          </div>
          
          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
              <span>Decision Point</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
              <span>Chain of Thought</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-100 border border-orange-300 rounded"></div>
              <span>Action</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-100 border border-purple-300 rounded transform rotate-45"></div>
              <span>Condition</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Decision Tree Visualization */}
      <Card>
        <CardContent className="p-0">
          <div style={{ width: '100%', height: '600px' }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              fitView
              attributionPosition="top-right"
              className="bg-gray-50"
            >
              <MiniMap 
                zoomable 
                pannable 
                className="!bg-white !border !border-gray-200"
              />
              <Controls className="!border !border-gray-200 !bg-white" />
              <Background color="#e5e7eb" gap={16} />
            </ReactFlow>
          </div>
        </CardContent>
      </Card>

      {/* Agent Reasoning Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getAgentIcon(selectedAgent)}
            {selectedAgent.charAt(0).toUpperCase() + selectedAgent.slice(1)} Agent Reasoning Process
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Decision Factors</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  {selectedAgent === 'email' && (
                    <>
                      <li>• Sender priority level and relationship</li>
                      <li>• Content urgency indicators and keywords</li>
                      <li>• Historical response patterns</li>
                      <li>• Available response templates</li>
                    </>
                  )}
                  {selectedAgent === 'booking' && (
                    <>
                      <li>• Date and time availability</li>
                      <li>• Budget constraints and preferences</li>
                      <li>• Alternative options and flexibility</li>
                      <li>• Service provider reliability</li>
                    </>
                  )}
                  {selectedAgent === 'intelligence' && (
                    <>
                      <li>• Data source reliability and accuracy</li>
                      <li>• Real-time vs cached data requirements</li>
                      <li>• API rate limits and costs</li>
                      <li>• Report format preferences</li>
                    </>
                  )}
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Learning Mechanisms</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• User feedback incorporation</li>
                  <li>• Pattern recognition from past decisions</li>
                  <li>• Success rate optimization</li>
                  <li>• Continuous model refinement</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold mb-2">Chain of Thought Benefits</h4>
              <p className="text-sm text-muted-foreground">
                The chain of thought approach allows agents to break down complex decisions into logical steps, 
                improving transparency, reliability, and the ability to explain their reasoning. This leads to 
                better user trust and more consistent outcomes across different scenarios.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentDecisionTree;