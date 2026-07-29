import { supabase } from '@/lib/supabase';
import Nav from '@/components/Nav';
import WorldMap from '@/components/WorldMap';
import type { CountryPath } from '@/components/WorldMap';
import { geoNaturalEarth1, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import type { Topology } from 'topojson-specification';

export const dynamic = 'force-dynamic';

const F = 'Raleway, sans-serif';
const M = 'Montserrat, sans-serif';

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

const JOURNEY_LABELS: Record<string, string> = {
  'trying-to-conceive':  'Trying to Conceive',
  'fertility-treatment': 'Fertility Treatment',
  'pregnancy':           'Pregnancy',
  'difficult-pregnancy': 'Difficult Pregnancy',
  'waiting':             'Waiting',
  'birth-preparation':   'Preparing for Birth',
  'birth':               'During Birth',
  'pregnancy-recovery':  'Pregnancy After Loss',
  'postpartum':          'Postpartum',
  'perinatal-grief':     'Perinatal Grief',
  'feeling-well':        'Feeling Well',
  'partner-support':     'Partner Support',
};

function flag(code: string): string {
  return code.toUpperCase().replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
}

function StatCard({ label, value, alert }: { label: string; value: string | number; alert?: boolean }) {
  return (
    <div style={{
      background: 'white', borderRadius: 16, padding: '14px 18px',
      border: `1px solid ${alert ? '#FFD4B8' : '#E8E0F0'}`,
      boxShadow: '0 2px 8px rgba(79,69,128,0.05)', flex: 1, minWidth: 110,
    }}>
      <p style={{ fontFamily: M, fontSize: 11, color: '#A0A0B8', marginBottom: 4 }}>{label}</p>
      <p style={{ fontFamily: F, fontWeight: 700, fontSize: 26, color: alert ? '#FFC299' : '#4F4580' }}>{value}</p>
    </div>
  );
}

export default async function DashboardPage() {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [
    { count: totalUsers },
    { count: activeUsers },
    { count: totalSessions },
    { count: totalPrograms },
    { count: pendingFeedback },
    { data: profiles },
    { data: recent },
    { data: countryRows },
    topoRes,
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('updated_at', sevenDaysAgo),
    supabase.from('protocols').select('*', { count: 'exact', head: true }),
    supabase.from('programs').select('*', { count: 'exact', head: true }),
    supabase.from('user_feedback').select('*', { count: 'exact', head: true }).eq('is_read', false),
    supabase.from('profiles').select('journey, lounge'),
    supabase.from('profiles').select('first_name, journey, lounge, created_at').order('created_at', { ascending: false }).limit(6),
    supabase.from('profiles').select('country, country_code').not('country_code', 'is', null),
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json', { cache: 'force-cache' }),
  ]);

  // Compute SVG country paths server-side (no client fetch needed)
  let countryPaths: CountryPath[] = [];
  try {
    const topo = await topoRes.json() as Topology;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const countries = feature(topo, (topo.objects as any).countries) as unknown as GeoJSON.FeatureCollection;
    const projection = geoNaturalEarth1().scale(120).translate([380, 190]);
    const pathGen = geoPath(projection);
    countryPaths = countries.features.map((geo) => ({
      d: pathGen(geo as GeoJSON.Feature) ?? '',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      alpha2: NUMERIC_TO_ALPHA2[String((geo as any).id ?? '')] ?? '',
      name: (geo.properties as Record<string, string>)?.name ?? '',
    }));
  } catch { /* render map-less if CDN fails */ }

  // Journey breakdown
  const journeyCounts: Record<string, number> = {};
  for (const p of profiles ?? []) {
    if (p.journey) journeyCounts[p.journey] = (journeyCounts[p.journey] ?? 0) + 1;
  }
  const journeyList = Object.entries(journeyCounts).sort((a, b) => b[1] - a[1]);
  const maxJourney = journeyList[0]?.[1] ?? 1;

  // Country breakdown
  const countryCounts: Record<string, number> = {};
  const countryNames: Record<string, string> = {};
  for (const row of countryRows ?? []) {
    if (!row.country_code) continue;
    countryCounts[row.country_code] = (countryCounts[row.country_code] ?? 0) + 1;
    if (row.country) countryNames[row.country_code] = row.country;
  }
  const topCountries = Object.entries(countryCounts).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const maxCountry = topCountries[0]?.[1] ?? 1;

  const card = {
    background: 'white', borderRadius: 16,
    border: '1px solid #E8E0F0', boxShadow: '0 2px 8px rgba(79,69,128,0.05)',
  };

  return (
    <div className="flex flex-col" style={{ minHeight: '100vh' }}>
      <Nav />
      <main className="max-w-6xl mx-auto w-full px-6 py-5 flex flex-col gap-4" style={{ flex: 1 }}>

        {/* Header */}
        <div className="flex items-baseline gap-3">
          <h1 style={{ fontFamily: F, fontWeight: 700, fontSize: 22, color: '#4F4580' }}>Dashboard</h1>
          <span style={{ fontFamily: M, fontSize: 12, color: '#C0B8D8' }}>
            {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>
        </div>

        {/* Stats row */}
        <div className="flex gap-3">
          <StatCard label="Total Users" value={totalUsers ?? 0} />
          <StatCard label="Active (7d)" value={activeUsers ?? 0} />
          <StatCard label="Sessions" value={totalSessions ?? 0} />
          <StatCard label="Programs" value={totalPrograms ?? 0} />
          {(pendingFeedback ?? 0) > 0 && (
            <StatCard label="Unread Feedback" value={pendingFeedback ?? 0} alert />
          )}
        </div>

        {/* Main grid */}
        <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 340px', flex: 1 }}>

          {/* Left: Map card */}
          <div style={{ ...card, padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ fontFamily: F, fontWeight: 700, fontSize: 14, color: '#4F4580' }}>Users by Region</p>

            {/* Map */}
            <div style={{ borderRadius: 10, overflow: 'hidden', background: '#F5F2FF' }}>
              <WorldMap countryPaths={countryPaths} counts={countryCounts} />
            </div>

            {/* Countries list — Shopify style */}
            {topCountries.length === 0 ? (
              <p style={{ fontFamily: M, fontSize: 12, color: '#C0B8D8' }}>
                Location data will appear as users sign up.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {topCountries.map(([code, count], i) => (
                  <div key={code} className="flex items-center gap-3">
                    <span style={{ fontFamily: M, fontSize: 11, color: '#C0B8D8', width: 14, textAlign: 'right' }}>{i + 1}</span>
                    <span style={{ fontSize: 16, lineHeight: 1 }}>{flag(code)}</span>
                    <span style={{ fontFamily: M, fontSize: 12, color: '#4F4580', flex: 1 }}>
                      {countryNames[code] ?? code}
                    </span>
                    <div style={{ width: 80, background: '#F0EBF8', borderRadius: 9999, height: 5 }}>
                      <div style={{
                        background: '#699BA9', borderRadius: 9999, height: 5,
                        width: `${Math.round((count / maxCountry) * 100)}%`,
                      }} />
                    </div>
                    <span style={{ fontFamily: M, fontSize: 12, color: '#A0A0B8', fontWeight: 600, width: 24, textAlign: 'right' }}>{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Journey + Recent signups */}
          <div className="flex flex-col gap-4">

            {/* Journey breakdown */}
            <div style={{ ...card, padding: 20, flex: 1 }}>
              <p style={{ fontFamily: F, fontWeight: 700, fontSize: 14, color: '#4F4580', marginBottom: 12 }}>By Journey</p>
              {journeyList.length === 0 ? (
                <p style={{ fontFamily: M, fontSize: 12, color: '#C0B8D8' }}>No data yet.</p>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {journeyList.slice(0, 7).map(([journey, count]) => (
                    <div key={journey}>
                      <div className="flex items-center justify-between" style={{ marginBottom: 3 }}>
                        <span style={{ fontFamily: M, fontSize: 11, color: '#4F4580' }}>{JOURNEY_LABELS[journey] ?? journey}</span>
                        <span style={{ fontFamily: M, fontSize: 11, color: '#A0A0B8', fontWeight: 600 }}>{count}</span>
                      </div>
                      <div style={{ background: '#F0EBF8', borderRadius: 9999, height: 5 }}>
                        <div style={{
                          background: '#699BA9', borderRadius: 9999, height: 5,
                          width: `${Math.round((count / maxJourney) * 100)}%`,
                          transition: 'width 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent signups */}
            <div style={{ ...card, padding: 20, flex: 1 }}>
              <p style={{ fontFamily: F, fontWeight: 700, fontSize: 14, color: '#4F4580', marginBottom: 12 }}>Recent Signups</p>
              {(recent ?? []).length === 0 ? (
                <p style={{ fontFamily: M, fontSize: 12, color: '#C0B8D8' }}>No signups yet.</p>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {recent!.map((u, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%', background: '#F0EBF8', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: F, fontWeight: 700, fontSize: 11, color: '#9B8FBF',
                      }}>
                        {(u.first_name || '?').charAt(0).toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontFamily: M, fontSize: 12, color: '#4F4580', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {u.first_name || 'Anonymous'}
                        </p>
                        <p style={{ fontFamily: M, fontSize: 10, color: '#A0A0B8' }}>
                          {JOURNEY_LABELS[u.journey] ?? u.journey ?? '—'}
                        </p>
                      </div>
                      <span style={{ fontFamily: M, fontSize: 10, color: '#C0B8D8', flexShrink: 0 }}>
                        {new Date(u.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}
