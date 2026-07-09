'use client';
import { useCallback, useState } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useEdgesState,
  useNodesState,
  type Connection,
  type Edge,
  type Node,
} from 'reactflow';
import 'reactflow/dist/style.css';

export interface FlowNode {
  id: string;
  protocol_id: string | null;
  label: string;
  type: string;
  position_x: number;
  position_y: number;
}

export interface FlowEdge {
  id: string;
  source_node: string;
  target_node: string;
  label: string;
}

interface Protocol { id: string; title: string }

interface Props {
  nodes: FlowNode[];
  edges: FlowEdge[];
  protocols: Protocol[];
  onNodesChange: (nodes: FlowNode[]) => void;
  onEdgesChange: (edges: FlowEdge[]) => void;
}

function toRFNodes(nodes: FlowNode[]): Node[] {
  return nodes.map((n) => ({
    id: n.id,
    type: 'default',
    position: { x: n.position_x, y: n.position_y },
    data: { label: n.label },
    style: {
      background: n.type === 'start' ? '#699BA9' : n.type === 'end' ? '#FFC299' : '#F5F0FF',
      border: '1.5px solid #BEB5DA',
      borderRadius: 12,
      padding: '10px 18px',
      fontSize: 13,
      color: n.type === 'start' || n.type === 'end' ? '#fff' : '#4F4580',
      fontFamily: 'sans-serif',
      minWidth: 120,
      textAlign: 'center',
    },
  }));
}

function toRFEdges(edges: FlowEdge[]): Edge[] {
  return edges.map((e) => ({
    id: e.id,
    source: e.source_node,
    target: e.target_node,
    label: e.label || undefined,
    type: 'smoothstep',
    style: { stroke: '#BEB5DA' },
    labelStyle: { fontSize: 11, fill: '#7B7B9B' },
  }));
}

export default function CurriculumEditor({ nodes, edges, protocols, onNodesChange, onEdgesChange }: Props) {
  const [rfNodes, setRFNodes, onRFNodesChange] = useNodesState(toRFNodes(nodes));
  const [rfEdges, setRFEdges, onRFEdgesChange] = useEdgesState(toRFEdges(edges));
  const [edgeLabel, setEdgeLabel] = useState('');

  const onConnect = useCallback(
    (conn: Connection) => {
      const id = `edge-${Date.now()}`;
      const newEdge: FlowEdge = {
        id,
        source_node: conn.source!,
        target_node: conn.target!,
        label: edgeLabel,
      };
      setRFEdges((eds) => addEdge({ ...conn, id, label: edgeLabel || undefined, type: 'smoothstep', style: { stroke: '#BEB5DA' } }, eds));
      onEdgesChange([...edges, newEdge]);
    },
    [setRFEdges, edges, onEdgesChange, edgeLabel],
  );

  function addNode(type: 'session' | 'start' | 'end') {
    const id = `node-${Date.now()}`;
    const label = type === 'start' ? 'Start' : type === 'end' ? 'End' : 'New Session';
    const newNode: FlowNode = { id, protocol_id: null, label, type, position_x: 200 + Math.random() * 200, position_y: 100 + Math.random() * 200 };
    setRFNodes((ns) => [...ns, {
      id,
      type: 'default',
      position: { x: newNode.position_x, y: newNode.position_y },
      data: { label },
      style: {
        background: type === 'start' ? '#699BA9' : type === 'end' ? '#FFC299' : '#F5F0FF',
        border: '1.5px solid #BEB5DA',
        borderRadius: 12,
        padding: '10px 18px',
        fontSize: 13,
        color: type === 'start' || type === 'end' ? '#fff' : '#4F4580',
        fontFamily: 'sans-serif',
        minWidth: 120,
        textAlign: 'center',
      },
    }]);
    onNodesChange([...nodes, newNode]);
  }

  function syncPositions(rfNs: Node[]) {
    const updated = nodes.map((n) => {
      const rf = rfNs.find((r) => r.id === n.id);
      if (!rf) return n;
      return { ...n, position_x: rf.position.x, position_y: rf.position.y };
    });
    onNodesChange(updated);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-semibold text-gray-700">Curriculum Map</span>
        <button onClick={() => addNode('start')} className="text-xs bg-[#699BA9] text-white px-3 py-1 rounded-lg hover:opacity-90 transition">+ Start</button>
        <button onClick={() => addNode('session')} className="text-xs bg-[#F5F0FF] text-[#4F4580] px-3 py-1 rounded-lg hover:bg-[#EEF6F9] transition">+ Session</button>
        <button onClick={() => addNode('end')} className="text-xs bg-[#FFC299] text-white px-3 py-1 rounded-lg hover:opacity-90 transition">+ End</button>
        <div className="flex items-center gap-1 ml-auto">
          <span className="text-xs text-gray-400">Edge label:</span>
          <input
            value={edgeLabel}
            onChange={(e) => setEdgeLabel(e.target.value)}
            placeholder="e.g. if calm"
            className="border border-gray-200 rounded-lg px-2 py-1 text-xs w-28 focus:outline-none focus:ring-1 focus:ring-[#699BA9]"
          />
        </div>
      </div>
      <p className="text-xs text-gray-400">Drag nodes to rearrange. Connect by dragging from a node handle to another.</p>

      <div style={{ height: 480 }} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
        <ReactFlow
          nodes={rfNodes}
          edges={rfEdges}
          onNodesChange={(changes) => {
            onRFNodesChange(changes);
          }}
          onEdgesChange={onRFEdgesChange}
          onConnect={onConnect}
          onNodeDragStop={(_, __, nds) => syncPositions(nds)}
          fitView
        >
          <Background color="#e5e7eb" gap={20} />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
    </div>
  );
}
