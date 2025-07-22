import React, { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  MarkerType,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Knowledge Graph Node Types
const KnowledgeNode = ({ data }: { data: any }) => {
  return (
    <div className={`px-3 py-2 rounded-lg border-2 text-sm font-medium ${data.style}`}>
      <div className="text-center">
        <div className="text-xs opacity-75">{data.type}</div>
        <div>{data.label}</div>
        {data.confidence && (
          <div className="text-xs mt-1 opacity-75">{data.confidence}%</div>
        )}
      </div>
    </div>
  );
};

const nodeTypes = {
  knowledge: KnowledgeNode,
};

const KnowledgeGraphFlow = () => {
  // Sample knowledge graph data
  const initialNodes: Node[] = useMemo(() => [
    {
      id: 'concept-1',
      type: 'knowledge',
      position: { x: 250, y: 50 },
      data: {
        label: 'Machine Learning',
        type: 'Concept',
        confidence: 95,
        style: 'bg-blue-100 text-blue-800 border-blue-300'
      },
    },
    {
      id: 'concept-2',
      type: 'knowledge',
      position: { x: 100, y: 150 },
      data: {
        label: 'Neural Networks',
        type: 'Concept',
        confidence: 92,
        style: 'bg-green-100 text-green-800 border-green-300'
      },
    },
    {
      id: 'concept-3',
      type: 'knowledge',
      position: { x: 400, y: 150 },
      data: {
        label: 'Deep Learning',
        type: 'Concept',
        confidence: 88,
        style: 'bg-purple-100 text-purple-800 border-purple-300'
      },
    },
    {
      id: 'method-1',
      type: 'knowledge',
      position: { x: 50, y: 250 },
      data: {
        label: 'Backpropagation',
        type: 'Method',
        confidence: 85,
        style: 'bg-orange-100 text-orange-800 border-orange-300'
      },
    },
    {
      id: 'method-2',
      type: 'knowledge',
      position: { x: 200, y: 250 },
      data: {
        label: 'Gradient Descent',
        type: 'Method',
        confidence: 90,
        style: 'bg-orange-100 text-orange-800 border-orange-300'
      },
    },
    {
      id: 'application-1',
      type: 'knowledge',
      position: { x: 350, y: 250 },
      data: {
        label: 'Image Recognition',
        type: 'Application',
        confidence: 87,
        style: 'bg-pink-100 text-pink-800 border-pink-300'
      },
    },
    {
      id: 'application-2',
      type: 'knowledge',
      position: { x: 500, y: 250 },
      data: {
        label: 'Natural Language',
        type: 'Application',
        confidence: 83,
        style: 'bg-pink-100 text-pink-800 border-pink-300'
      },
    },
    {
      id: 'entity-1',
      type: 'knowledge',
      position: { x: 150, y: 350 },
      data: {
        label: 'TensorFlow',
        type: 'Tool',
        confidence: 94,
        style: 'bg-yellow-100 text-yellow-800 border-yellow-300'
      },
    },
    {
      id: 'entity-2',
      type: 'knowledge',
      position: { x: 350, y: 350 },
      data: {
        label: 'PyTorch',
        type: 'Tool',
        confidence: 91,
        style: 'bg-yellow-100 text-yellow-800 border-yellow-300'
      },
    },
  ], []);

  const initialEdges: Edge[] = useMemo(() => [
    {
      id: 'e1-2',
      source: 'concept-1',
      target: 'concept-2',
      type: 'smoothstep',
      label: 'includes',
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: '#3b82f6' },
    },
    {
      id: 'e1-3',
      source: 'concept-1',
      target: 'concept-3',
      type: 'smoothstep',
      label: 'subset of',
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: '#8b5cf6' },
    },
    {
      id: 'e2-4',
      source: 'concept-2',
      target: 'method-1',
      type: 'smoothstep',
      label: 'uses',
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: '#f97316' },
    },
    {
      id: 'e2-5',
      source: 'concept-2',
      target: 'method-2',
      type: 'smoothstep',
      label: 'requires',
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: '#f97316' },
    },
    {
      id: 'e3-6',
      source: 'concept-3',
      target: 'application-1',
      type: 'smoothstep',
      label: 'enables',
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: '#ec4899' },
    },
    {
      id: 'e3-7',
      source: 'concept-3',
      target: 'application-2',
      type: 'smoothstep',
      label: 'powers',
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: '#ec4899' },
    },
    {
      id: 'e2-8',
      source: 'concept-2',
      target: 'entity-1',
      type: 'smoothstep',
      label: 'implemented in',
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: '#eab308' },
    },
    {
      id: 'e3-9',
      source: 'concept-3',
      target: 'entity-2',
      type: 'smoothstep',
      label: 'framework',
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: '#eab308' },
    },
    {
      id: 'e8-9',
      source: 'entity-1',
      target: 'entity-2',
      type: 'smoothstep',
      label: 'alternative to',
      style: { stroke: '#6b7280', strokeDasharray: '5,5' },
    },
  ], []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="h-96 w-full border rounded-lg overflow-hidden bg-background">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        minZoom={0.2}
        maxZoom={2}
      >
        <Background color="#aaa" gap={16} />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default KnowledgeGraphFlow;