'use client';

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

const M = 'Montserrat, sans-serif';

const inputStyle = {
  border: '1.5px solid #E8E0F0', borderRadius: 12, padding: '8px 14px',
  fontFamily: M, fontSize: 13, color: '#4F4580', background: '#FAFAFA',
  outline: 'none', width: '100%',
};

export default function PartsFlowEditor({ parts, onChange }: Props) {
  function addPart() {
    const id = `part-${Date.now()}`;
    onChange([...parts, { id, label: 'New Step', duration: '2 min', position: parts.length }]);
  }

  function removePart(id: string) {
    onChange(parts.filter((p) => p.id !== id));
  }

  function update(id: string, field: 'label' | 'duration', value: string) {
    onChange(parts.map((p) => p.id === id ? { ...p, [field]: value } : p));
  }

  function move(index: number, dir: -1 | 1) {
    const next = [...parts];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        {parts.length === 0 && (
          <p style={{ fontFamily: M, fontSize: 13, color: '#C0B8D8' }}>No steps yet. Add one below.</p>
        )}
        {parts.map((p, i) => (
          <div key={p.id} className="flex gap-2 items-center">
            <span className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-xs"
              style={{ background: '#F0EBF8', color: '#A0A0B8', fontFamily: M, fontWeight: 600 }}>{i + 1}</span>
            <input
              style={inputStyle}
              value={p.label}
              placeholder="Step name"
              onChange={(e) => update(p.id, 'label', e.target.value)}
            />
            <input
              style={{ ...inputStyle, width: 96, flexShrink: 0 }}
              value={p.duration}
              placeholder="2 min"
              onChange={(e) => update(p.id, 'duration', e.target.value)}
            />
            <div className="flex gap-1 shrink-0">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0}
                className="w-7 h-7 flex items-center justify-center rounded-lg transition-opacity disabled:opacity-30"
                style={{ background: '#F0EBF8', color: '#A0A0B8' }}>↑</button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === parts.length - 1}
                className="w-7 h-7 flex items-center justify-center rounded-lg transition-opacity disabled:opacity-30"
                style={{ background: '#F0EBF8', color: '#A0A0B8' }}>↓</button>
              <button type="button" onClick={() => removePart(p.id)}
                className="w-7 h-7 flex items-center justify-center rounded-lg transition-opacity hover:opacity-70"
                style={{ background: '#FDE8E8', color: '#E07070' }}>×</button>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={addPart} type="button"
        className="self-start px-4 py-1.5 rounded-full text-xs transition-opacity hover:opacity-80"
        style={{ background: '#DBE8F0', color: '#699BA9', fontFamily: M, fontWeight: 600 }}
      >+ Add Step</button>
    </div>
  );
}
