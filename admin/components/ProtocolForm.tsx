'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FileUpload from './FileUpload';
import PartsFlowEditor, { type Part } from './PartsFlowEditor';

const JOURNEYS = ['trying-to-conceive','fertility-treatment','pregnancy','difficult-pregnancy','waiting','birth-preparation','birth','pregnancy-recovery','postpartum','perinatal-grief','feeling-well','partner-support'];
const EMOTIONAL_STATES = ['struggling','doing-okay','feeling-good','preparing-tomorrow','moment-for-myself'];
const NEEDS = ['calm','confidence','reassurance','rest','connection','welcome-emotions','prepare','face-challenge','reconnect-self','develop-resources'];
const CONTENT_TYPES = ['FULL SESSION','REFLECT','MOVE','PREPARE'];
const POSITIONS = ['sitting','standing','lying'];

interface ProtocolRow {
  id: string; title: string; description: string; duration: number;
  content_type: string; journeys: string[]; emotional_states: string[];
  needs: string[]; positions: string[]; has_visual: boolean; intention: string;
  self_care_tip: string; is_support_now: boolean; support_now_key: string;
  for_lounge: string; audio_url: string; visual_url: string;
}

interface PartRow { id: string; label: string; duration: string; position: number }

interface Props {
  protocol?: ProtocolRow;
  parts?: PartRow[];
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <div
        onClick={() => onChange(!checked)}
        className={`w-10 h-5 rounded-full transition-colors ${checked ? 'bg-[#699BA9]' : 'bg-gray-200'} relative`}
      >
        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </div>
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
}

function MultiSelect({ label, options, selected, onChange }: {
  label: string; options: string[]; selected: string[]; onChange: (v: string[]) => void;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 block mb-2">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => {
              const next = selected.includes(o) ? selected.filter((x) => x !== o) : [...selected, o];
              onChange(next);
            }}
            className={`text-xs px-3 py-1.5 rounded-full border transition ${selected.includes(o) ? 'bg-[#699BA9] text-white border-[#699BA9]' : 'bg-white text-gray-500 border-gray-200 hover:border-[#699BA9]'}`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ProtocolForm({ protocol, parts: initialParts = [] }: Props) {
  const router = useRouter();
  const isEditing = !!protocol;

  const [title, setTitle] = useState(protocol?.title ?? '');
  const [description, setDescription] = useState(protocol?.description ?? '');
  const [duration, setDuration] = useState(protocol?.duration ?? 10);
  const [contentType, setContentType] = useState(protocol?.content_type ?? 'FULL SESSION');
  const [journeys, setJourneys] = useState<string[]>(protocol?.journeys ?? []);
  const [emotionalStates, setEmotionalStates] = useState<string[]>(protocol?.emotional_states ?? []);
  const [needs, setNeeds] = useState<string[]>(protocol?.needs ?? []);
  const [positions, setPositions] = useState<string[]>(protocol?.positions ?? ['sitting']);
  const [hasVisual, setHasVisual] = useState(protocol?.has_visual ?? false);
  const [intention, setIntention] = useState(protocol?.intention ?? '');
  const [selfCareTip, setSelfCareTip] = useState(protocol?.self_care_tip ?? '');
  const [isSupportNow, setIsSupportNow] = useState(protocol?.is_support_now ?? false);
  const [forLounge, setForLounge] = useState(protocol?.for_lounge ?? '');
  const [audioUrl, setAudioUrl] = useState(protocol?.audio_url ?? '');
  const [visualUrl, setVisualUrl] = useState(protocol?.visual_url ?? '');
  const [parts, setParts] = useState<Part[]>(
    initialParts.map((p) => ({ id: p.id, label: p.label, duration: p.duration, position: p.position }))
  );
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const id = isEditing ? protocol!.id : slugify(title);
    const payload = {
      id, title, description, duration, content_type: contentType,
      journeys, emotional_states: emotionalStates, needs, positions,
      has_visual: hasVisual, intention, self_care_tip: selfCareTip,
      is_support_now: isSupportNow, for_lounge: forLounge || null,
      audio_url: audioUrl || null, visual_url: visualUrl || null,
      updated_at: new Date().toISOString(),
    };

    const res = await fetch('/api/protocols', {
      method: isEditing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ protocol: payload, parts }),
    });

    if (res.ok) {
      router.push('/protocols');
      router.refresh();
    } else {
      const err = await res.json();
      alert('Error: ' + (err.error ?? 'Unknown'));
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (!confirm('Delete this session?')) return;
    setDeleting(true);
    await fetch(`/api/protocols?id=${protocol!.id}`, { method: 'DELETE' });
    router.push('/protocols');
    router.refresh();
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-8">
      {/* Basic info */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-5">
        <h2 className="font-semibold text-gray-800">Basic Info</h2>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Title</label>
          <input required value={title} onChange={(e) => setTitle(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#699BA9]" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Description</label>
          <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#699BA9] resize-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Duration (min)</label>
            <input type="number" min={1} value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#699BA9]" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Content Type</label>
            <select value={contentType} onChange={(e) => setContentType(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#699BA9] bg-white">
              {CONTENT_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Intention</label>
          <input value={intention} onChange={(e) => setIntention(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#699BA9]" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Self-Care Tip</label>
          <textarea rows={2} value={selfCareTip} onChange={(e) => setSelfCareTip(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#699BA9] resize-none" />
        </div>
        <div className="flex gap-6 flex-wrap">
          <Toggle label="Has Visual" checked={hasVisual} onChange={setHasVisual} />
          <Toggle label="Support Now session" checked={isSupportNow} onChange={setIsSupportNow} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">For Lounge (optional)</label>
          <select value={forLounge} onChange={(e) => setForLounge(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#699BA9] bg-white">
            <option value="">All lounges</option>
            <option value="womens">Women's</option>
            <option value="partner">Partner</option>
          </select>
        </div>
      </div>

      {/* Targeting */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-5">
        <h2 className="font-semibold text-gray-800">Targeting</h2>
        <MultiSelect label="Journeys" options={JOURNEYS} selected={journeys} onChange={setJourneys} />
        <MultiSelect label="Emotional States" options={EMOTIONAL_STATES} selected={emotionalStates} onChange={setEmotionalStates} />
        <MultiSelect label="Needs" options={NEEDS} selected={needs} onChange={setNeeds} />
        <MultiSelect label="Positions" options={POSITIONS} selected={positions} onChange={setPositions} />
      </div>

      {/* Media */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-5">
        <h2 className="font-semibold text-gray-800">Media</h2>
        <FileUpload bucket="audio" accept="audio/*" label="Audio file (MP3)" currentUrl={audioUrl} onUploaded={setAudioUrl} />
        <FileUpload bucket="visuals" accept="image/*,video/*" label="Visual (image or video)" currentUrl={visualUrl} onUploaded={setVisualUrl} />
        {audioUrl && (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Audio URL (manual override)</label>
            <input value={audioUrl} onChange={(e) => setAudioUrl(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#699BA9]" />
          </div>
        )}
      </div>

      {/* Session Flow */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-5">
        <h2 className="font-semibold text-gray-800">Session Steps</h2>
        <PartsFlowEditor parts={parts} onChange={setParts} />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button type="submit" disabled={saving} className="bg-[#699BA9] text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-[#5a8a97] transition disabled:opacity-50">
          {saving ? 'Saving…' : isEditing ? 'Save Changes' : 'Create Session'}
        </button>
        <button type="button" onClick={() => router.push('/protocols')} className="text-sm text-gray-500 px-4 py-3 hover:text-gray-700 transition">Cancel</button>
        {isEditing && (
          <button type="button" onClick={handleDelete} disabled={deleting} className="ml-auto text-sm text-red-400 hover:text-red-600 transition disabled:opacity-50">
            {deleting ? 'Deleting…' : 'Delete session'}
          </button>
        )}
      </div>
    </form>
  );
}
