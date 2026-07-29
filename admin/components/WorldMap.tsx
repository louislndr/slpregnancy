'use client';
import { useState } from 'react';

export interface CountryPath {
  d: string;
  alpha2: string;
  name: string;
}

interface Props {
  countryPaths: CountryPath[];
  counts: Record<string, number>;
}

export default function WorldMap({ countryPaths, counts }: Props) {
  const [tooltip, setTooltip] = useState<{ name: string; count: number; x: number; y: number } | null>(null);
  const max = Math.max(1, ...Object.values(counts));

  function getColor(alpha2: string): string {
    const n = counts[alpha2] ?? 0;
    if (n === 0) return '#EDE8F6';
    const t = n / max;
    if (t < 0.25) return '#BEB5DA';
    if (t < 0.5)  return '#9B8FBF';
    if (t < 0.75) return '#699BA9';
    return '#4F4580';
  }

  return (
    <div className="relative w-full">
      <svg viewBox="0 0 760 380" style={{ width: '100%', height: 'auto', display: 'block' }}>
        {countryPaths.map(({ d, alpha2, name }) => {
          const count = counts[alpha2] ?? 0;
          const base = getColor(alpha2);
          return (
            <path
              key={alpha2 || name}
              d={d}
              fill={base}
              stroke="#fff"
              strokeWidth={0.4}
              style={{ transition: 'fill 160ms ease' }}
              onMouseEnter={(e) => {
                (e.currentTarget as SVGPathElement).setAttribute('fill', '#FFC299');
                setTooltip({ name, count, x: e.clientX, y: e.clientY });
              }}
              onMouseMove={(e) => setTooltip((t) => t && { ...t, x: e.clientX, y: e.clientY })}
              onMouseLeave={(e) => {
                (e.currentTarget as SVGPathElement).setAttribute('fill', base);
                setTooltip(null);
              }}
            />
          );
        })}
      </svg>

      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none px-3 py-1.5 rounded-lg"
          style={{
            left: tooltip.x + 10,
            top: tooltip.y - 32,
            background: '#4F4580',
            color: '#fff',
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 600,
            fontSize: 11,
            boxShadow: '0 4px 12px rgba(79,69,128,0.3)',
            whiteSpace: 'nowrap',
          }}
        >
          {tooltip.name}
          {tooltip.count > 0 && (
            <span style={{ color: '#FFC299', marginLeft: 6 }}>
              {tooltip.count}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
