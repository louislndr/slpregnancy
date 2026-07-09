'use client';
import { useState } from 'react';

const FEELINGS = [
  { id: 'struggling',         label: "I'm Struggling",              emoji: '🌧' },
  { id: 'doing-okay',         label: 'Doing Okay',                  emoji: '🌤' },
  { id: 'feeling-good',       label: 'Feeling Good',                emoji: '☀️' },
  { id: 'preparing-tomorrow', label: 'Preparing For Tomorrow',      emoji: '🌙' },
  { id: 'moment-for-myself',  label: 'A Moment For Myself',         emoji: '🌸' },
];

const NEEDS = [
  { id: 'all',               label: 'Any Need' },
  { id: 'calm',              label: 'Calm' },
  { id: 'reassurance',       label: 'Reassurance' },
  { id: 'confidence',        label: 'Confidence' },
  { id: 'rest',              label: 'Rest' },
  { id: 'connection',        label: 'Connection' },
  { id: 'welcome-emotions',  label: 'Welcome My Emotions' },
  { id: 'prepare',           label: 'Prepare for Something' },
  { id: 'face-challenge',    label: 'Face a Challenge' },
  { id: 'reconnect-self',    label: 'Reconnect With Myself' },
  { id: 'develop-resources', label: 'Develop My Resources' },
];

interface Protocol { id: string; title: string }
// key = "feeling::need"
type RulesMap = Record<string, string[]>;

const F = 'Raleway, sans-serif';
const M = 'Montserrat, sans-serif';

const cardStyle = {
  background: 'white', borderRadius: 20, padding: 20,
  border: '1px solid #E8E0F0', boxShadow: '0 2px 12px rgba(79,69,128,0.05)',
};

interface Props { protocols: Protocol[]; initial: RulesMap }

function key(feeling: string, need: string) { return `${feeling}::${need}`; }

export default function CheckinRulesEditor({ protocols, initial }: Props) {
  const [rules, setRules] = useState<RulesMap>(initial);
  const [selectedFeeling, setSelectedFeeling] = useState(FEELINGS[0].id);
  const [selectedNeed, setSelectedNeed] = useState('all');
  const [addPid, setAddPid] = useState(protocols[0]?.id ?? '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const currentKey = key(selectedFeeling, selectedNeed);
  const currentList = rules[currentKey] ?? [];
  const available = protocols.filter((p) => !currentList.includes(p.id));

  function add() {
    if (!addPid || currentList.includes(addPid)) return;
    setRules({ ...rules, [currentKey]: [...currentList, addPid] });
    const next = available.find((p) => p.id !== addPid);
    if (next) setAddPid(next.id);
  }

  function remove(pid: string) {
    setRules({ ...rules, [currentKey]: currentList.filter((x) => x !== pid) });
  }

  function move(index: number, dir: -1 | 1) {
    const list = [...currentList];
    const target = index + dir;
    if (target < 0 || target >= list.length) return;
    [list[index], list[target]] = [list[target], list[index]];
    setRules({ ...rules, [currentKey]: list });
  }

  async function save() {
    setSaving(true);
    setSaved(false);
    // Serialize all rules into rows
    const rows: { feeling: string; need: string; protocol_id: string; sort_order: number }[] = [];
    for (const [k, pids] of Object.entries(rules)) {
      const [feeling, need] = k.split('::');
      pids.forEach((pid, i) => rows.push({ feeling, need, protocol_id: pid, sort_order: i }));
    }
    const res = await fetch('/api/checkin-flow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rows),
    });
    setSaving(false);
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2500); }
    else { const err = await res.json(); alert('Error: ' + (err.error ?? 'Unknown')); }
  }

  const inputStyle = {
    border: '1.5px solid #E8E0F0', borderRadius: 12, padding: '6px 12px',
    fontFamily: M, fontSize: 13, color: '#4F4580', background: '#FAFAFA', outline: 'none', flex: 1,
  };

  const feelingObj = FEELINGS.find((f) => f.id === selectedFeeling)!;
  const needObj = NEEDS.find((n) => n.id === selectedNeed)!;

  // Count configured combos for selected feeling
  const configuredNeeds = NEEDS.filter((n) => (rules[key(selectedFeeling, n.id)] ?? []).length > 0);

  return (
    <div className="flex flex-col gap-6">
      <p style={{ fontFamily: M, fontSize: 13, color: '#A0A0B8' }}>
        For each combination of feeling + need, define the sessions the app should recommend in priority order.
        "Any Need" applies when no specific rule matches.
      </p>

      {/* Step 1: Pick feeling */}
      <div style={cardStyle}>
        <p style={{ fontFamily: F, fontWeight: 700, fontSize: 14, color: '#4F4580', marginBottom: 12 }}>
          Step 1 — How are you feeling today?
        </p>
        <div className="flex flex-wrap gap-2">
          {FEELINGS.map((f) => {
            const count = NEEDS.filter((n) => (rules[key(f.id, n.id)] ?? []).length > 0).length;
            const active = selectedFeeling === f.id;
            return (
              <button
                key={f.id} type="button"
                onClick={() => { setSelectedFeeling(f.id); setSelectedNeed('all'); }}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all"
                style={{
                  fontFamily: M, fontWeight: active ? 700 : 500,
                  background: active ? '#699BA9' : '#F9F7FF',
                  color: active ? 'white' : '#7B7B9B',
                  border: `1.5px solid ${active ? '#699BA9' : '#E8E0F0'}`,
                }}
              >
                {f.emoji} {f.label}
                {count > 0 && (
                  <span style={{
                    background: active ? 'rgba(255,255,255,0.3)' : '#DBE8F0',
                    color: active ? 'white' : '#699BA9',
                    fontSize: 11, fontWeight: 700,
                    borderRadius: 9999, padding: '1px 7px',
                  }}>{count}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Pick need */}
      <div style={cardStyle}>
        <p style={{ fontFamily: F, fontWeight: 700, fontSize: 14, color: '#4F4580', marginBottom: 12 }}>
          Step 2 — What do you need most today?
        </p>
        <div className="flex flex-wrap gap-2">
          {NEEDS.map((n) => {
            const count = (rules[key(selectedFeeling, n.id)] ?? []).length;
            const active = selectedNeed === n.id;
            return (
              <button
                key={n.id} type="button"
                onClick={() => setSelectedNeed(n.id)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs transition-all"
                style={{
                  fontFamily: M, fontWeight: active ? 700 : 500,
                  background: active ? '#4F4580' : '#F9F7FF',
                  color: active ? 'white' : '#7B7B9B',
                  border: `1.5px solid ${active ? '#4F4580' : '#E8E0F0'}`,
                }}
              >
                {n.label}
                {count > 0 && (
                  <span style={{
                    background: active ? 'rgba(255,255,255,0.25)' : '#F0EBF8',
                    color: active ? 'white' : '#9B8FBF',
                    fontSize: 10, fontWeight: 700,
                    borderRadius: 9999, padding: '1px 6px',
                  }}>{count}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 3: Edit sessions for this combination */}
      <div style={cardStyle}>
        <p style={{ fontFamily: F, fontWeight: 700, fontSize: 14, color: '#4F4580', marginBottom: 4 }}>
          Step 3 — Recommended sessions
        </p>
        <p style={{ fontFamily: M, fontSize: 12, color: '#A0A0B8', marginBottom: 16 }}>
          {feelingObj.emoji} {feelingObj.label} &nbsp;+&nbsp; {needObj.label}
        </p>

        <div className="flex flex-col gap-2 mb-4">
          {currentList.length === 0 && (
            <p style={{ fontFamily: M, fontSize: 13, color: '#C0B8D8' }}>
              No sessions configured. Add some below — the first one will be the primary recommendation.
            </p>
          )}
          {currentList.map((pid, i) => {
            const proto = protocols.find((p) => p.id === pid);
            return (
              <div key={pid} className="flex items-center gap-2">
                <span className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-xs"
                  style={{
                    background: i === 0 ? '#FFC299' : '#F0EBF8',
                    color: i === 0 ? 'white' : '#A0A0B8',
                    fontFamily: M, fontWeight: 700,
                  }}>
                  {i === 0 ? '★' : i + 1}
                </span>
                <span style={{ fontFamily: M, fontSize: 13, color: '#4F4580', flex: 1 }}>
                  {proto?.title ?? pid}
                  {i === 0 && <span style={{ fontFamily: M, fontSize: 11, color: '#FFC299', marginLeft: 8 }}>Primary recommendation</span>}
                </span>
                <div className="flex gap-1 shrink-0">
                  <button type="button" onClick={() => move(i, -1)} disabled={i === 0}
                    className="w-7 h-7 flex items-center justify-center rounded-lg disabled:opacity-30"
                    style={{ background: '#F0EBF8', color: '#A0A0B8' }}>↑</button>
                  <button type="button" onClick={() => move(i, 1)} disabled={i === currentList.length - 1}
                    className="w-7 h-7 flex items-center justify-center rounded-lg disabled:opacity-30"
                    style={{ background: '#F0EBF8', color: '#A0A0B8' }}>↓</button>
                  <button type="button" onClick={() => remove(pid)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:opacity-70"
                    style={{ background: '#FDE8E8', color: '#E07070', fontSize: 16 }}>×</button>
                </div>
              </div>
            );
          })}
        </div>

        {available.length > 0 && (
          <div className="flex items-center gap-2">
            <select
              value={addPid}
              onChange={(e) => setAddPid(e.target.value)}
              style={inputStyle}
            >
              {available.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
            <button type="button" onClick={add}
              className="px-4 py-1.5 rounded-full text-xs whitespace-nowrap transition-opacity hover:opacity-80"
              style={{ background: '#DBE8F0', color: '#699BA9', fontFamily: M, fontWeight: 600 }}>
              + Add
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 pb-8">
        <button
          onClick={save} disabled={saving}
          className="px-8 py-3 rounded-full text-white text-sm disabled:opacity-50 transition-opacity"
          style={{ background: '#FFC299', fontFamily: F, fontWeight: 700, boxShadow: '0 4px 16px rgba(255,194,153,0.35)' }}
        >
          {saving ? 'Saving…' : 'Save All Pathways'}
        </button>
        {saved && <span style={{ fontFamily: M, fontSize: 13, color: '#699BA9' }}>Saved ✓</span>}
        {configuredNeeds.length > 0 && (
          <span style={{ fontFamily: M, fontSize: 12, color: '#A0A0B8', marginLeft: 'auto' }}>
            {configuredNeeds.length} need{configuredNeeds.length > 1 ? 's' : ''} configured for {feelingObj.label}
          </span>
        )}
      </div>
    </div>
  );
}
