'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CurriculumEditor, { type FlowNode, type FlowEdge } from './CurriculumEditor';

const JOURNEYS = ['trying-to-conceive','fertility-treatment','pregnancy','difficult-pregnancy','waiting','birth-preparation','birth','pregnancy-recovery','postpartum','perinatal-grief','feeling-well','partner-support'];

interface Protocol { id: string; title: string }
interface ProgramRow { id: string; title: string; subtitle: string; description: string; journey: string; lounge: string; is_premium: boolean }

interface Props {
  program?: ProgramRow;
  protocols?: Protocol[];
  nodes?: FlowNode[];
  edges?: FlowEdge[];
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function ProgramForm({ program, protocols = [], nodes: initNodes = [], edges: initEdges = [] }: Props) {
  const router = useRouter();
  const isEditing = !!program;

  const [title, setTitle] = useState(program?.title ?? '');
  const [subtitle, setSubtitle] = useState(program?.subtitle ?? '');
  const [description, setDescription] = useState(program?.description ?? '');
  const [journey, setJourney] = useState(program?.journey ?? '');
  const [lounge, setLounge] = useState(program?.lounge ?? '');
  const [isPremium, setIsPremium] = useState(program?.is_premium ?? false);
  const [nodes, setNodes] = useState<FlowNode[]>(initNodes);
  const [edges, setEdges] = useState<FlowEdge[]>(initEdges);
  const [saving, setSaving] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const id = isEditing ? program!.id : slugify(title);
    const payload = { id, title, subtitle, description, journey: journey || null, lounge: lounge || null, is_premium: isPremium, updated_at: new Date().toISOString() };

    const res = await fetch('/api/programs', {
      method: isEditing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ program: payload, nodes, edges }),
    });

    if (res.ok) {
      router.push('/programs');
      router.refresh();
    } else {
      const err = await res.json();
      alert('Error: ' + (err.error ?? 'Unknown'));
    }
    setSaving(false);
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-8">
      <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-5">
        <h2 className="font-semibold text-gray-800">Program Info</h2>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Title</label>
          <input required value={title} onChange={(e) => setTitle(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#699BA9]" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Subtitle</label>
          <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#699BA9]" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Description</label>
          <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#699BA9] resize-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Journey</label>
            <select value={journey} onChange={(e) => setJourney(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#699BA9] bg-white">
              <option value="">All journeys</option>
              {JOURNEYS.map((j) => <option key={j}>{j}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Lounge</label>
            <select value={lounge} onChange={(e) => setLounge(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#699BA9] bg-white">
              <option value="">All</option>
              <option value="womens">Women's</option>
              <option value="partner">Partner</option>
            </select>
          </div>
        </div>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input type="checkbox" checked={isPremium} onChange={(e) => setIsPremium(e.target.checked)} className="rounded" />
          <span className="text-sm text-gray-700">Premium program</span>
        </label>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-5">
        <h2 className="font-semibold text-gray-800">Curriculum Flow</h2>
        <CurriculumEditor
          nodes={nodes}
          edges={edges}
          protocols={protocols}
          onNodesChange={setNodes}
          onEdgesChange={setEdges}
        />
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={saving} className="bg-[#699BA9] text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-[#5a8a97] transition disabled:opacity-50">
          {saving ? 'Saving…' : isEditing ? 'Save Changes' : 'Create Program'}
        </button>
        <button type="button" onClick={() => router.push('/programs')} className="text-sm text-gray-500 px-4 py-3 hover:text-gray-700 transition">Cancel</button>
      </div>
    </form>
  );
}
