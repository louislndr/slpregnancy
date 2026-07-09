'use client';
import { useState } from 'react';

const EMOTIONAL_STATES: { id: string; label: string; emoji: string }[] = [
  { id: 'struggling',          label: "I'm struggling",           emoji: '🌧' },
  { id: 'doing-okay',          label: "I'm doing okay",           emoji: '🌤' },
  { id: 'feeling-good',        label: "I'm feeling good",         emoji: '☀️' },
  { id: 'preparing-tomorrow',  label: 'Preparing for tomorrow',   emoji: '🌙' },
  { id: 'moment-for-myself',   label: 'A moment for myself',      emoji: '🌸' },
];

interface Protocol { id: string; title: string }
type FlowMap = Record<string, string[]>;

const F = 'Raleway, sans-serif';
const M = 'Montserrat, sans-serif';

const cardStyle = {
  background: 'white', borderRadius: 20, padding: 20,
  border: '1px solid #E8E0F0', boxShadow: '0 2px 12px rgba(79,69,128,0.05)',
};

interface Props {
  protocols: Protocol[];
  initial: FlowMap;
}

export default function CheckinFlowEditor({ protocols, initial }: Props) {
  const [flow, setFlow] = useState<FlowMap>(initial);
  const [selected, setSelected] = useState<Record<string, string>>(
    Object.fromEntries(EMOTIONAL_STATES.map((s) => [s.id, protocols[0]?.id ?? '']))
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function add(state: string) {
    const pid = selected[state];
    if (!pid) return;
    const current = flow[state] ?? [];
    if (current.includes(pid)) return;
    setFlow({ ...flow, [state]: [...current, pid] });
  }

  function remove(state: string, pid: string) {
    setFlow({ ...flow, [state]: (flow[state] ?? []).filter((x) => x !== pid) });
  }

  function move(state: string, index: number, dir: -1 | 1) {
    const list = [...(flow[state] ?? [])];
    const target = index + dir;
    if (target < 0 || target >= list.length) return;
    [list[index], list[target]] = [list[target], list[index]];
    setFlow({ ...flow, [state]: list });
  }

  async function save() {
    setSaving(true);
    setSaved(false);
    const payload = EMOTIONAL_STATES.map((s) => ({ state: s.id, protocol_ids: flow[s.id] ?? [] }));
    const res = await fetch('/api/checkin-flow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2500); }
    else { const err = await res.json(); alert('Error: ' + (err.error ?? 'Unknown')); }
  }

  const inputStyle = {
    border: '1.5px solid #E8E0F0', borderRadius: 12, padding: '6px 12px',
    fontFamily: M, fontSize: 13, color: '#4F4580', background: '#FAFAFA', outline: 'none', flex: 1,
  };

  return (
    <div className="flex flex-col gap-6">
      <p style={{ fontFamily: M, fontSize: 13, color: '#A0A0B8' }}>
        Configure which sessions are suggested for each check-in mood, in priority order.
      </p>

      {EMOTIONAL_STATES.map((s) => {
        const list = flow[s.id] ?? [];
        const availableToAdd = protocols.filter((p) => !list.includes(p.id));
        return (
          <div key={s.id} style={cardStyle}>
            <p style={{ fontFamily: F, fontWeight: 700, fontSize: 15, color: '#4F4580', marginBottom: 14 }}>
              {s.emoji} {s.label}
            </p>

            {/* Current list */}
            <div className="flex flex-col gap-2 mb-4">
              {list.length === 0 && (
                <p style={{ fontFamily: M, fontSize: 13, color: '#C0B8D8' }}>No sessions configured yet.</p>
              )}
              {list.map((pid, i) => {
                const proto = protocols.find((p) => p.id === pid);
                return (
                  <div key={pid} className="flex items-center gap-2">
                    <span className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-xs"
                      style={{ background: '#F0EBF8', color: '#A0A0B8', fontFamily: M, fontWeight: 600 }}>{i + 1}</span>
                    <span style={{ fontFamily: M, fontSize: 13, color: '#4F4580', flex: 1 }}>{proto?.title ?? pid}</span>
                    <div className="flex gap-1 shrink-0">
                      <button type="button" onClick={() => move(s.id, i, -1)} disabled={i === 0}
                        className="w-7 h-7 flex items-center justify-center rounded-lg transition-opacity disabled:opacity-30"
                        style={{ background: '#F0EBF8', color: '#A0A0B8', fontSize: 14 }}>↑</button>
                      <button type="button" onClick={() => move(s.id, i, 1)} disabled={i === list.length - 1}
                        className="w-7 h-7 flex items-center justify-center rounded-lg transition-opacity disabled:opacity-30"
                        style={{ background: '#F0EBF8', color: '#A0A0B8', fontSize: 14 }}>↓</button>
                      <button type="button" onClick={() => remove(s.id, pid)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg transition-opacity hover:opacity-70"
                        style={{ background: '#FDE8E8', color: '#E07070', fontSize: 16 }}>×</button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add session */}
            {availableToAdd.length > 0 && (
              <div className="flex items-center gap-2">
                <select
                  value={selected[s.id]}
                  onChange={(e) => setSelected({ ...selected, [s.id]: e.target.value })}
                  style={inputStyle}
                >
                  {availableToAdd.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
                </select>
                <button type="button" onClick={() => add(s.id)}
                  className="px-4 py-1.5 rounded-full text-xs whitespace-nowrap transition-opacity hover:opacity-80"
                  style={{ background: '#DBE8F0', color: '#699BA9', fontFamily: M, fontWeight: 600 }}>
                  + Add
                </button>
              </div>
            )}
          </div>
        );
      })}

      <div className="flex items-center gap-3 pb-8">
        <button
          onClick={save}
          disabled={saving}
          className="px-8 py-3 rounded-full text-white text-sm disabled:opacity-50 transition-opacity"
          style={{ background: '#FFC299', fontFamily: F, fontWeight: 700, boxShadow: '0 4px 16px rgba(255,194,153,0.35)' }}
        >
          {saving ? 'Saving…' : 'Save Check-in Flow'}
        </button>
        {saved && <span style={{ fontFamily: M, fontSize: 13, color: '#699BA9' }}>Saved ✓</span>}
      </div>
    </div>
  );
}
