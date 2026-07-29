'use client';
import { useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// ISO 3166-1 numeric (world-atlas id) → alpha-2 (what ipapi.co stores)
const NUMERIC_TO_ALPHA2: Record<string, string> = {
  '004':'AF','008':'AL','012':'DZ','024':'AO','032':'AR','036':'AU','040':'AT',
  '050':'BD','056':'BE','068':'BO','076':'BR','100':'BG','116':'KH','124':'CA',
  '144':'LK','152':'CL','156':'CN','170':'CO','188':'CR','191':'HR','192':'CU',
  '196':'CY','203':'CZ','204':'BJ','208':'DK','214':'DO','218':'EC','818':'EG',
  '222':'SV','231':'ET','246':'FI','250':'FR','276':'DE','288':'GH','300':'GR',
  '320':'GT','332':'HT','340':'HN','348':'HU','356':'IN','360':'ID','364':'IR',
  '368':'IQ','372':'IE','376':'IL','380':'IT','388':'JM','392':'JP','400':'JO',
  '404':'KE','408':'KP','410':'KR','414':'KW','418':'LA','422':'LB','434':'LY',
  '458':'MY','484':'MX','504':'MA','508':'MZ','516':'NA','524':'NP','528':'NL',
  '554':'NZ','566':'NG','578':'NO','586':'PK','591':'PA','604':'PE','608':'PH',
  '616':'PL','620':'PT','630':'PR','634':'QA','642':'RO','643':'RU','646':'RW',
  '682':'SA','686':'SN','694':'SL','703':'SK','706':'SO','710':'ZA','724':'ES',
  '752':'SE','756':'CH','762':'TJ','764':'TH','788':'TN','792':'TR','800':'UG',
  '804':'UA','784':'AE','826':'GB','840':'US','858':'UY','860':'UZ','862':'VE',
  '704':'VN','887':'YE','894':'ZM','716':'ZW','158':'TW','729':'SD','760':'SY',
};

interface Props {
  counts: Record<string, number>;
}

export default function WorldMap({ counts }: Props) {
  const [tooltip, setTooltip] = useState<{ name: string; count: number; x: number; y: number } | null>(null);

  const max = Math.max(1, ...Object.values(counts));

  function getColor(alpha2: string): string {
    const count = counts[alpha2] ?? 0;
    if (count === 0) return '#EDE8F6';
    const intensity = count / max;
    if (intensity < 0.25) return '#BEB5DA';
    if (intensity < 0.5)  return '#9B8FBF';
    if (intensity < 0.75) return '#699BA9';
    return '#4F4580';
  }

  return (
    <div className="relative w-full" style={{ userSelect: 'none' }}>
      <ComposableMap
        projectionConfig={{ scale: 140, center: [10, 10] }}
        style={{ width: '100%', height: 'auto' }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const alpha2 = NUMERIC_TO_ALPHA2[String(geo.id)] ?? '';
              const count = counts[alpha2] ?? 0;
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={getColor(alpha2)}
                  stroke="#fff"
                  strokeWidth={0.4}
                  style={{
                    default: { outline: 'none', transition: 'fill 200ms ease' },
                    hover:   { outline: 'none', fill: count > 0 ? '#FFC299' : '#DDD8F0' },
                    pressed: { outline: 'none' },
                  }}
                  onMouseEnter={(e) => {
                    if (count > 0 || alpha2) {
                      setTooltip({
                        name: geo.properties?.name ?? alpha2,
                        count,
                        x: e.clientX,
                        y: e.clientY,
                      });
                    }
                  }}
                  onMouseMove={(e) => {
                    if (tooltip) setTooltip((t) => t && { ...t, x: e.clientX, y: e.clientY });
                  }}
                  onMouseLeave={() => setTooltip(null)}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none px-3 py-2 rounded-xl text-sm"
          style={{
            left: tooltip.x + 12,
            top: tooltip.y - 36,
            background: '#4F4580',
            color: 'white',
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 600,
            fontSize: 12,
            boxShadow: '0 4px 16px rgba(79,69,128,0.25)',
            whiteSpace: 'nowrap',
          }}
        >
          {tooltip.name}
          {tooltip.count > 0 && (
            <span style={{ color: '#FFC299', marginLeft: 8 }}>{tooltip.count} user{tooltip.count !== 1 ? 's' : ''}</span>
          )}
        </div>
      )}
    </div>
  );
}
