'use client';
import { useCallback, useEffect } from 'react';
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

export interface Part {
  id: string;
  label: string;
  duration: string;
  position: number;
}

interface Props {
  parts: Part[];
  onChange: (parts: Part[]) => void;
}

function partsToNodes(parts: Part[]): Node[] {
  return parts.map((p, i) => ({
    id: p.id,
    type: 'default',
    position: { x: 250 * i, y: 100 },
    data: { label: `${p.label}\n${p.duration}` },
    style: {
      background: '#EEF6F9',
      border: '1.5px solid #699BA9',
      borderRadius: 12,
      padding: '10px 16px',
      fontSize: 13,
      fontFamily: 'sans-serif',
      whiteSpace: 'pre-line',
      textAlign: 'center',
    },
  }));
}

function partsToEdges(parts: Part[]): Edge[] {
  return parts.slice(0, -1).map((p, i) => ({
    id: `e-${p.id}-${parts[i + 1].id}`,
    source: p.id,
    target: parts[i + 1].id,
    type: 'smoothstep',
    style: { stroke: '#699BA9' },
  }));
}

export default function PartsFlowEditor({ parts, onChange }: Props) {
  const [nodes, setNodes, onNodesChange] = useNodesState(partsToNodes(parts));
  const [edges, setEdges, onEdgesChange] = useEdgesState(partsToEdges(parts));

  useEffect(() => {
    setNodes(partsToNodes(parts));
    setEdges(partsToEdges(parts));
  }, [parts]);

  const onConnect = useCallback(
    (conn: Connection) => setEdges((eds) => addEdge({ ...conn, type: 'smoothstep', style: { stroke: '#699BA9' } }, eds)),
    [setEdges],
  );

  function addPart() {
    const id = `part-${Date.now()}`;
    const newPart: Part = { id, label: 'New Step', duration: '2 min', position: parts.length };
    onChange([...parts, newPart]);
  }

  function removeLast() {
    if (parts.length === 0) return;
    onChange(parts.slice(0, -1));
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-gray-700">Session Flow</span>
        <button onClick={addPart} className="text-xs bg-[#EEF6F9] text-[#699BA9] px-3 py-1 rounded-lg hover:bg-[#DBE8F0] transition">+ Add Step</button>
        <button onClick={removeLast} className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-lg hover:bg-gray-200 transition">Remove Last</button>
      </div>

      {/* Editable parts table */}
      <div className="flex flex-col gap-2 mb-2">
        {parts.map((p, i) => (
          <div key={p.id} className="flex gap-2 items-center">
            <span className="text-xs text-gray-400 w-4">{i + 1}</span>
            <input
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-[#699BA9]"
              value={p.label}
              onChange={(e) => {
                const updated = parts.map((pt) => pt.id === p.id ? { ...pt, label: e.target.value } : pt);
                onChange(updated);
              }}
            />
            <input
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-24 focus:outline-none focus:ring-2 focus:ring-[#699BA9]"
              value={p.duration}
              onChange={(e) => {
                const updated = parts.map((pt) => pt.id === p.id ? { ...pt, duration: e.target.value } : pt);
                onChange(updated);
              }}
              placeholder="2 min"
            />
          </div>
        ))}
      </div>

      {/* Visual flow */}
      <div style={{ height: 220 }} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          zoomOnScroll={false}
          panOnDrag={false}
        >
          <Background color="#e5e7eb" gap={20} />
        </ReactFlow>
      </div>
    </div>
  );
}
