'use client';
import { useState, useEffect, useRef } from 'react';
import { geoNaturalEarth1, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import type { Topology } from 'topojson-specification';

// ISO 3166-1 numeric (world-atlas feature id) → alpha-2
const NUMERIC_TO_ALPHA2: Record<string, string> = {
  '004':'AF','008':'AL','012':'DZ','024':'AO','032':'AR','036':'AU','040':'AT',
  '050':'BD','056':'BE','068':'BO','076':'BR','100':'BG','116':'KH','124':'CA',
  '144':'LK','152':'CL','156':'CN','170':'CO','188':'CR','191':'HR','192':'CU',
  '196':'CY','203':'CZ','208':'DK','214':'DO','218':'EC','818':'EG','231':'ET',
  '246':'FI','250':'FR','276':'DE','288':'GH','300':'GR','320':'GT','332':'HT',
  '340':'HN','348':'HU','356':'IN','360':'ID','364':'IR','368':'IQ','372':'IE',
  '376':'IL','380':'IT','388':'JM','392':'JP','400':'JO','404':'KE','410':'KR',
  '414':'KW','458':'MY','484':'MX','504':'MA','528':'NL','554':'NZ','566':'NG',
  '578':'NO','586':'PK','604':'PE','608':'PH','616':'PL','620':'PT','634':'QA',
  '642':'RO','643':'RU','682':'SA','710':'ZA','724':'ES','752':'SE','756':'CH',
  '764':'TH','788':'TN','792':'TR','804':'UA','784':'AE','826':'GB','840':'US',
  '858':'UY','862':'VE','704':'VN','158':'TW','729':'SD','760':'SY','800':'UG',
};

interface Props {
  counts: Record<string, number>;
}

type GeoFeature = GeoJSON.Feature<GeoJSON.Geometry, { name?: string }> & { id?: string | number };

export default function WorldMap({ counts }: Props) {
  const [paths, setPaths] = useState<{ d: string; alpha2: string; name: string; id: string }[]>([]);
  const [tooltip, setTooltip] = useState<{ name: string; count: number; x: number; y: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const W = 800;
  const H = 420;

  useEffect(() => {
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then((r) => r.json())
      .then((topo: Topology) => {
        const projection = geoNaturalEarth1().scale(130).translate([W / 2, H / 2]);
        const pathGen = geoPath(projection);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const countries = feature(topo, (topo.objects as any).countries);
        const built = (countries.features as GeoFeature[]).map((geo) => {
          const id = String(geo.id ?? '');
          const alpha2 = NUMERIC_TO_ALPHA2[id] ?? '';
          const name = geo.properties?.name ?? alpha2;
          const d = pathGen(geo as GeoJSON.Feature) ?? '';
          return { d, alpha2, name, id };
        });
        setPaths(built);
      });
  }, []);

  const max = Math.max(1, ...Object.values(counts));

  function getColor(alpha2: string): string {
    const count = counts[alpha2] ?? 0;
    if (count === 0) return '#EDE8F6';
    const t = count / max;
    if (t < 0.25) return '#BEB5DA';
    if (t < 0.5)  return '#9B8FBF';
    if (t < 0.75) return '#699BA9';
    return '#4F4580';
  }

  return (
    <div className="relative w-full">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        {paths.map(({ d, alpha2, name, id }) => {
          const count = counts[alpha2] ?? 0;
          return (
            <path
              key={id}
              d={d}
              fill={getColor(alpha2)}
              stroke="#fff"
              strokeWidth={0.4}
              style={{ transition: 'fill 200ms ease', cursor: count > 0 ? 'pointer' : 'default' }}
              onMouseEnter={(e) => setTooltip({ name, count, x: e.clientX, y: e.clientY })}
              onMouseMove={(e) => setTooltip((t) => t && { ...t, x: e.clientX, y: e.clientY })}
              onMouseLeave={() => setTooltip(null)}
              onMouseOver={(e) => {
                (e.currentTarget as SVGPathElement).setAttribute('fill', count > 0 ? '#FFC299' : '#DDD8F0');
              }}
              onMouseOut={(e) => {
                (e.currentTarget as SVGPathElement).setAttribute('fill', getColor(alpha2));
              }}
            />
          );
        })}
      </svg>

      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none px-3 py-2 rounded-xl"
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
            <span style={{ color: '#FFC299', marginLeft: 8 }}>
              {tooltip.count} user{tooltip.count !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
