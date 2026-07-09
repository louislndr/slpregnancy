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

  const M = 'Montserrat, sans-serif';
  const inputStyle = {
    border: '1.5px solid #E8E0F0', borderRadius: 12, padding: '8px 14px',
    fontFamily: M, fontSize: 13, color: '#4F4580', background: '#FAFAFA',
    outline: 'none', width: '100%',
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={addPart} type="button"
          className="px-4 py-1.5 rounded-full text-xs transition-opacity hover:opacity-80"
          style={{ background: '#DBE8F0', color: '#699BA9', fontFamily: M, fontWeight: 600 }}
        >+ Add Step</button>
        <button
          onClick={removeLast} type="button"
          className="px-4 py-1.5 rounded-full text-xs transition-opacity hover:opacity-80"
          style={{ background: '#F0EBF8', color: '#A0A0B8', fontFamily: M, fontWeight: 600 }}
        >Remove Last</button>
      </div>

      <div className="flex flex-col gap-2">
        {parts.map((p, i) => (
          <div key={p.id} className="flex gap-2 items-center">
            <span className="shrink-0 w-5 h-5 flex items-center justify-center rounded-full text-xs"
              style={{ background: '#F0EBF8', color: '#A0A0B8', fontFamily: M, fontWeight: 600 }}>{i + 1}</span>
            <input
              style={inputStyle}
              value={p.label}
              onChange={(e) => onChange(parts.map((pt) => pt.id === p.id ? { ...pt, label: e.target.value } : pt))}
            />
            <input
              style={{ ...inputStyle, width: 96 }}
              value={p.duration}
              onChange={(e) => onChange(parts.map((pt) => pt.id === p.id ? { ...pt, duration: e.target.value } : pt))}
              placeholder="2 min"
            />
          </div>
        ))}
      </div>

      <div style={{ height: 200, borderRadius: 16, overflow: 'hidden', border: '1px solid #E8E0F0' }}>
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
          <Background color="#E8E0F0" gap={20} />
        </ReactFlow>
      </div>
    </div>
  );
}
