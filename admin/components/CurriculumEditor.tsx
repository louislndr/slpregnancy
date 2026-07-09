'use client';
import { useCallback, useState } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
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

function nodeStyle(type: string) {
  return {
    background: type === 'start' ? '#699BA9' : type === 'end' ? '#FFC299' : '#F5F0FF',
    border: '1.5px solid #BEB5DA',
    borderRadius: 12,
    padding: '10px 18px',
    fontSize: 13,
    color: type === 'start' || type === 'end' ? '#fff' : '#4F4580',
    fontFamily: 'sans-serif',
    minWidth: 140,
    textAlign: 'center' as const,
  };
}

function toRFNodes(nodes: FlowNode[]): Node[] {
  return nodes.map((n) => ({
    id: n.id,
    type: 'default',
    position: { x: n.position_x, y: n.position_y },
    data: { label: n.label },
    style: nodeStyle(n.type),
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

const M = 'Montserrat, sans-serif';

export default function CurriculumEditor({ nodes, edges, protocols, onNodesChange, onEdgesChange }: Props) {
  const [rfNodes, setRFNodes, onRFNodesChange] = useNodesState(toRFNodes(nodes));
  const [rfEdges, setRFEdges, onRFEdgesChange] = useEdgesState(toRFEdges(edges));
  const [selectedProtocol, setSelectedProtocol] = useState(protocols[0]?.id ?? '');
  const [edgeLabel, setEdgeLabel] = useState('');

  const onConnect = useCallback(
    (conn: Connection) => {
      const id = `edge-${Date.now()}`;
      const newEdge: FlowEdge = { id, source_node: conn.source!, target_node: conn.target!, label: edgeLabel };
      setRFEdges((eds) => addEdge({ ...conn, id, label: edgeLabel || undefined, type: 'smoothstep', style: { stroke: '#BEB5DA' } }, eds));
      onEdgesChange([...edges, newEdge]);
    },
    [setRFEdges, edges, onEdgesChange, edgeLabel],
  );

  function addSpecialNode(type: 'start' | 'end') {
    const id = `node-${Date.now()}`;
    const label = type === 'start' ? 'Start' : 'End';
    const newNode: FlowNode = { id, protocol_id: null, label, type, position_x: 200 + Math.random() * 200, position_y: 50 + Math.random() * 100 };
    setRFNodes((ns) => [...ns, { id, type: 'default', position: { x: newNode.position_x, y: newNode.position_y }, data: { label }, style: nodeStyle(type) }]);
    onNodesChange([...nodes, newNode]);
  }

  function addSessionNode() {
    const proto = protocols.find((p) => p.id === selectedProtocol);
    if (!proto) return;
    const id = `node-${Date.now()}`;
    const newNode: FlowNode = { id, protocol_id: proto.id, label: proto.title, type: 'session', position_x: 200 + Math.random() * 300, position_y: 150 + Math.random() * 150 };
    setRFNodes((ns) => [...ns, { id, type: 'default', position: { x: newNode.position_x, y: newNode.position_y }, data: { label: proto.title }, style: nodeStyle('session') }]);
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

  const inputStyle = {
    border: '1.5px solid #E8E0F0', borderRadius: 12, padding: '6px 12px',
    fontFamily: M, fontSize: 13, color: '#4F4580', background: '#FAFAFA', outline: 'none',
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 flex-wrap">
        <button onClick={() => addSpecialNode('start')} type="button"
          className="px-4 py-1.5 rounded-full text-xs transition-opacity hover:opacity-80"
          style={{ background: '#699BA9', color: 'white', fontFamily: M, fontWeight: 600 }}>+ Start</button>

        <div className="flex items-center gap-2">
          <select
            value={selectedProtocol}
            onChange={(e) => setSelectedProtocol(e.target.value)}
            style={{ ...inputStyle, maxWidth: 260 }}
          >
            {protocols.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
          </select>
          <button onClick={addSessionNode} type="button"
            className="px-4 py-1.5 rounded-full text-xs transition-opacity hover:opacity-80 whitespace-nowrap"
            style={{ background: '#F0EBF8', color: '#4F4580', fontFamily: M, fontWeight: 600 }}>+ Add Session</button>
        </div>

        <button onClick={() => addSpecialNode('end')} type="button"
          className="px-4 py-1.5 rounded-full text-xs transition-opacity hover:opacity-80"
          style={{ background: '#FFC299', color: 'white', fontFamily: M, fontWeight: 600 }}>+ End</button>

        <div className="flex items-center gap-2 ml-auto">
          <span style={{ fontFamily: M, fontSize: 12, color: '#A0A0B8' }}>Edge label:</span>
          <input value={edgeLabel} onChange={(e) => setEdgeLabel(e.target.value)} placeholder="e.g. if calm"
            style={{ ...inputStyle, width: 110 }} />
        </div>
      </div>

      <p style={{ fontFamily: M, fontSize: 12, color: '#A0A0B8' }}>
        Drag nodes to rearrange. Connect by dragging from a handle to another node.
      </p>

      <div style={{ height: 480, borderRadius: 20, overflow: 'hidden', border: '1px solid #E8E0F0' }}>
        <ReactFlow
          nodes={rfNodes}
          edges={rfEdges}
          onNodesChange={(changes) => { onRFNodesChange(changes); }}
          onEdgesChange={onRFEdgesChange}
          onConnect={onConnect}
          onNodeDragStop={(_, __, nds) => syncPositions(nds)}
          fitView
        >
          <Background color="#E8E0F0" gap={20} />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}
