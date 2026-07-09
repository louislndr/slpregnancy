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

const sectionTitle = {
  fontFamily: F, fontWeight: 700, fontSize: 16, color: '#4F4580', marginBottom: 16,
};

const labelStyle = {
  fontFamily: M, fontWeight: 600, fontSize: 13, color: '#4F4580', display: 'block', marginBottom: 6,
};

interface ProtocolRow {
  id: string; title: string; description: string; duration: number;
  content_type: string; journeys: string[]; emotional_states: string[];
  needs: string[]; positions: string[]; has_visual: boolean; intention: string;
  self_care_tip: string; is_support_now: boolean; support_now_key: string;
  for_lounge: string; audio_url: string; visual_url: string;
}

interface PartRow { id: string; label: string; duration: string; position: number }

interface Props { protocol?: ProtocolRow; parts?: PartRow[] }

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <div onClick={() => onChange(!checked)} className="relative w-10 h-5 rounded-full transition-colors cursor-pointer" style={{ background: checked ? '#699BA9' : '#E8E0F0' }}>
        <div className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform" style={{ transform: checked ? 'translateX(20px)' : 'translateX(2px)' }} />
      </div>
      <span style={{ fontFamily: M, fontSize: 14, color: '#4F4580' }}>{label}</span>
    </label>
  );
}

function MultiSelect({ label, options, selected, onChange }: { label: string; options: string[]; selected: string[]; onChange: (v: string[]) => void }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o} type="button"
            onClick={() => onChange(selected.includes(o) ? selected.filter((x) => x !== o) : [...selected, o])}
            className="px-3 py-1.5 rounded-full text-xs transition-all"
            style={{
              fontFamily: M, fontWeight: 500,
              background: selected.includes(o) ? '#699BA9' : '#F9F7FF',
              color: selected.includes(o) ? 'white' : '#7B7B9B',
              border: `1.5px solid ${selected.includes(o) ? '#699BA9' : '#E8E0F0'}`,
            }}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
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
    if (res.ok) { router.refresh(); router.push('/protocols'); }
    else { const err = await res.json(); alert('Error: ' + (err.error ?? 'Unknown')); }
    setSaving(false);
  }

  async function handleDelete() {
    if (!confirm('Delete this session?')) return;
    setDeleting(true);
    await fetch(`/api/protocols?id=${protocol!.id}`, { method: 'DELETE' });
    router.refresh();
    router.push('/protocols');
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-6">

      {/* Basic info */}
      <div style={cardStyle}>
        <p style={sectionTitle}>Basic Info</p>
        <div className="flex flex-col gap-5">
          <Field label="Title">
            <input required value={title} onChange={(e) => setTitle(e.target.value)} style={inputStyle} />
          </Field>
          <Field label="Description">
            <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} style={{ ...inputStyle, resize: 'none' }} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Duration (min)">
              <input type="number" min={1} value={duration} onChange={(e) => setDuration(Number(e.target.value))} style={inputStyle} />
            </Field>
            <Field label="Content Type">
              <select value={contentType} onChange={(e) => setContentType(e.target.value)} style={{ ...inputStyle, appearance: 'auto' }}>
                {CONTENT_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Intention">
            <input value={intention} onChange={(e) => setIntention(e.target.value)} style={inputStyle} />
          </Field>
          <Field label="Self-Care Tip">
            <textarea rows={2} value={selfCareTip} onChange={(e) => setSelfCareTip(e.target.value)} style={{ ...inputStyle, resize: 'none' }} />
          </Field>
          <div className="flex gap-6 flex-wrap">
            <Toggle label="Has Visual" checked={hasVisual} onChange={setHasVisual} />
            <Toggle label="Support Now session" checked={isSupportNow} onChange={setIsSupportNow} />
          </div>
          <Field label="For Lounge (optional)">
            <select value={forLounge} onChange={(e) => setForLounge(e.target.value)} style={{ ...inputStyle, appearance: 'auto' }}>
              <option value="">All lounges</option>
              <option value="womens">Women's</option>
              <option value="partner">Partner</option>
            </select>
          </Field>
        </div>
      </div>

      {/* Targeting */}
      <div style={cardStyle}>
        <p style={sectionTitle}>Targeting</p>
        <div className="flex flex-col gap-5">
          <MultiSelect label="Journeys" options={JOURNEYS} selected={journeys} onChange={setJourneys} />
          <MultiSelect label="Emotional States" options={EMOTIONAL_STATES} selected={emotionalStates} onChange={setEmotionalStates} />
          <MultiSelect label="Needs" options={NEEDS} selected={needs} onChange={setNeeds} />
          <MultiSelect label="Positions" options={POSITIONS} selected={positions} onChange={setPositions} />
        </div>
      </div>

      {/* Media */}
      <div style={cardStyle}>
        <p style={sectionTitle}>Media</p>
        <div className="flex flex-col gap-5">
          <FileUpload bucket="audio" accept="audio/*" label="Audio file (MP3)" currentUrl={audioUrl} onUploaded={setAudioUrl} />
          <FileUpload bucket="visuals" accept="image/*,video/*" label="Visual (image or video)" currentUrl={visualUrl} onUploaded={setVisualUrl} />
          {audioUrl && (
            <Field label="Audio URL (manual override)">
              <input value={audioUrl} onChange={(e) => setAudioUrl(e.target.value)} style={inputStyle} />
            </Field>
          )}
        </div>
      </div>

      {/* Session Steps */}
      <div style={cardStyle}>
        <p style={sectionTitle}>Session Steps</p>
        <PartsFlowEditor parts={parts} onChange={setParts} />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pb-8">
        <button type="submit" disabled={saving} className="px-8 py-3 rounded-full text-white text-sm transition-opacity disabled:opacity-50"
          style={{ background: '#FFC299', fontFamily: F, fontWeight: 700, boxShadow: '0 4px 16px rgba(255,194,153,0.35)' }}>
          {saving ? 'Saving…' : isEditing ? 'Save Changes' : 'Create Session'}
        </button>
        <button type="button" onClick={() => router.push('/protocols')} className="px-4 py-3 text-sm transition-colors"
          style={{ fontFamily: M, color: '#A0A0B8' }}>
          Cancel
        </button>
        {isEditing && (
          <button type="button" onClick={handleDelete} disabled={deleting} className="ml-auto text-sm transition-colors disabled:opacity-50"
            style={{ fontFamily: M, color: '#E07070' }}>
            {deleting ? 'Deleting…' : 'Delete session'}
          </button>
        )}
      </div>
    </form>
  );
}
