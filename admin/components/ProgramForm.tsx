'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CurriculumEditor, { type FlowNode, type FlowEdge } from './CurriculumEditor';

const JOURNEYS = ['trying-to-conceive','fertility-treatment','pregnancy','difficult-pregnancy','waiting','birth-preparation','birth','pregnancy-recovery','postpartum','perinatal-grief','feeling-well','partner-support'];

const F = 'Raleway, sans-serif';
const M = 'Montserrat, sans-serif';

const inputStyle = {
  border: '1.5px solid #E8E0F0', borderRadius: 16, padding: '10px 16px',
  fontFamily: M, fontSize: 14, color: '#4F4580', background: '#FAFAFA',
  outline: 'none', width: '100%',
};

const cardStyle = {
  background: 'white', borderRadius: 24, padding: 24,
  border: '1px solid #E8E0F0', boxShadow: '0 2px 16px rgba(79,69,128,0.05)',
};

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
    if (res.ok) { router.refresh(); router.push('/programs'); }
    else { const err = await res.json(); alert('Error: ' + (err.error ?? 'Unknown')); }
    setSaving(false);
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-6">
      <div style={cardStyle}>
        <p style={{ fontFamily: F, fontWeight: 700, fontSize: 16, color: '#4F4580', marginBottom: 16 }}>Program Info</p>
        <div className="flex flex-col gap-5">
          {[
            { label: 'Title', value: title, set: setTitle, required: true },
            { label: 'Subtitle', value: subtitle, set: setSubtitle },
          ].map(({ label, value, set, required }) => (
            <div key={label}>
              <label style={{ fontFamily: M, fontWeight: 600, fontSize: 13, color: '#4F4580', display: 'block', marginBottom: 6 }}>{label}</label>
              <input required={required} value={value} onChange={(e) => set(e.target.value)} style={inputStyle} />
            </div>
          ))}
          <div>
            <label style={{ fontFamily: M, fontWeight: 600, fontSize: 13, color: '#4F4580', display: 'block', marginBottom: 6 }}>Description</label>
            <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} style={{ ...inputStyle, resize: 'none' }} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Journey', value: journey, set: setJourney, options: ['', ...JOURNEYS], optionLabels: ['All journeys', ...JOURNEYS] },
              { label: 'Lounge', value: lounge, set: setLounge, options: ['', 'womens', 'partner'], optionLabels: ['All', "Women's", 'Partner'] },
            ].map(({ label, value, set, options, optionLabels }) => (
              <div key={label}>
                <label style={{ fontFamily: M, fontWeight: 600, fontSize: 13, color: '#4F4580', display: 'block', marginBottom: 6 }}>{label}</label>
                <select value={value} onChange={(e) => set(e.target.value)} style={{ ...inputStyle, appearance: 'auto' }}>
                  {options.map((o, i) => <option key={o} value={o}>{optionLabels[i]}</option>)}
                </select>
              </div>
            ))}
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <div onClick={() => setIsPremium(!isPremium)} className="relative w-10 h-5 rounded-full cursor-pointer" style={{ background: isPremium ? '#FFC299' : '#E8E0F0' }}>
              <div className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform" style={{ transform: isPremium ? 'translateX(20px)' : 'translateX(2px)' }} />
            </div>
            <span style={{ fontFamily: M, fontSize: 14, color: '#4F4580' }}>Premium program</span>
          </label>
        </div>
      </div>

      <div style={cardStyle}>
        <p style={{ fontFamily: F, fontWeight: 700, fontSize: 16, color: '#4F4580', marginBottom: 16 }}>Curriculum Flow</p>
        <CurriculumEditor nodes={nodes} edges={edges} protocols={protocols} onNodesChange={setNodes} onEdgesChange={setEdges} />
      </div>

      <div className="flex items-center gap-3 pb-8">
        <button type="submit" disabled={saving} className="px-8 py-3 rounded-full text-white text-sm disabled:opacity-50"
          style={{ background: '#FFC299', fontFamily: F, fontWeight: 700, boxShadow: '0 4px 16px rgba(255,194,153,0.35)' }}>
          {saving ? 'Saving…' : isEditing ? 'Save Changes' : 'Create Program'}
        </button>
        <button type="button" onClick={() => router.push('/programs')} style={{ fontFamily: M, fontSize: 14, color: '#A0A0B8' }}>Cancel</button>
      </div>
    </form>
  );
}
