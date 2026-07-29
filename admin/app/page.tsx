import { supabase } from '@/lib/supabase';
import Nav from '@/components/Nav';
import WorldMap from '@/components/WorldMap';

export const dynamic = 'force-dynamic';

const F = 'Raleway, sans-serif';
const M = 'Montserrat, sans-serif';

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

// ISO 3166-1 alpha-2 to flag emoji
function flag(code: string): string {
  return code.toUpperCase().replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div style={{
      background: 'white', borderRadius: 16, padding: 24,
      border: '1px solid #E8E0F0', boxShadow: '0 2px 12px rgba(79,69,128,0.05)',
      flex: 1, minWidth: 140,
    }}>
      <p style={{ fontFamily: M, fontSize: 12, color: '#A0A0B8', marginBottom: 6, letterSpacing: '0.3px' }}>{label}</p>
      <p style={{ fontFamily: F, fontWeight: 700, fontSize: 32, color: '#4F4580', marginBottom: 2 }}>{value}</p>
      {sub && <p style={{ fontFamily: M, fontSize: 12, color: '#A0A0B8' }}>{sub}</p>}
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
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('updated_at', sevenDaysAgo),
    supabase.from('protocols').select('*', { count: 'exact', head: true }),
    supabase.from('programs').select('*', { count: 'exact', head: true }),
    supabase.from('user_feedback').select('*', { count: 'exact', head: true }).eq('is_read', false),
    supabase.from('profiles').select('journey, lounge'),
    supabase.from('profiles').select('first_name, journey, lounge, created_at').order('created_at', { ascending: false }).limit(8),
    supabase.from('profiles').select('country, country_code').not('country_code', 'is', null),
  ]);

  // Journey breakdown
  const journeyCounts: Record<string, number> = {};
  for (const p of profiles ?? []) {
    if (p.journey) journeyCounts[p.journey] = (journeyCounts[p.journey] ?? 0) + 1;
  }
  const journeyList = Object.entries(journeyCounts).sort((a, b) => b[1] - a[1]);
  const maxJourney = journeyList[0]?.[1] ?? 1;

  // Lounge breakdown
  const loungeCounts: Record<string, number> = {};
  for (const p of profiles ?? []) {
    const l = p.lounge ?? 'womens';
    loungeCounts[l] = (loungeCounts[l] ?? 0) + 1;
  }

  // Country breakdown
  const countryCounts: Record<string, number> = {};
  const countryNames: Record<string, string> = {};
  for (const row of countryRows ?? []) {
    if (!row.country_code) continue;
    countryCounts[row.country_code] = (countryCounts[row.country_code] ?? 0) + 1;
    if (row.country) countryNames[row.country_code] = row.country;
  }
  const topCountries = Object.entries(countryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
  const hasCountryData = topCountries.length > 0;

  const cardStyle = {
    background: 'white', borderRadius: 16, padding: 24,
    border: '1px solid #E8E0F0', boxShadow: '0 2px 12px rgba(79,69,128,0.05)',
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="max-w-5xl mx-auto w-full px-6 py-8 flex flex-col gap-8">

        <div>
          <h1 style={{ fontFamily: F, fontWeight: 700, fontSize: 26, color: '#4F4580', marginBottom: 4 }}>Dashboard</h1>
          <p style={{ fontFamily: M, fontSize: 13, color: '#A0A0B8' }}>Overview of app usage and community activity.</p>
        </div>

        {/* Stats row */}
        <div className="flex gap-4 flex-wrap">
          <StatCard label="Total Users" value={totalUsers ?? 0} />
          <StatCard label="Active (7 days)" value={activeUsers ?? 0} />
          <StatCard label="Sessions" value={totalSessions ?? 0} sub="in library" />
          <StatCard label="Programs" value={totalPrograms ?? 0} sub="in library" />
          {(pendingFeedback ?? 0) > 0 && (
            <StatCard label="Unread Feedback" value={pendingFeedback ?? 0} sub="needs attention" />
          )}
        </div>

        {/* World map */}
        <div style={cardStyle}>
          <div className="flex items-center justify-between mb-4">
            <p style={{ fontFamily: F, fontWeight: 700, fontSize: 15, color: '#4F4580' }}>Users by Region</p>
            {!hasCountryData && (
              <span style={{ fontFamily: M, fontSize: 12, color: '#C0B8D8' }}>
                Location data will appear as new users sign up
              </span>
            )}
          </div>
          <WorldMap counts={countryCounts} />
          {hasCountryData && (
            <div className="flex flex-wrap gap-3 mt-4 pt-4" style={{ borderTop: '1px solid #E8E0F0' }}>
              {topCountries.map(([code, count]) => (
                <div key={code} className="flex items-center gap-2">
                  <span style={{ fontSize: 18 }}>{flag(code)}</span>
                  <span style={{ fontFamily: M, fontSize: 13, color: '#4F4580', fontWeight: 600 }}>{count}</span>
                  <span style={{ fontFamily: M, fontSize: 12, color: '#A0A0B8' }}>{countryNames[code] ?? code}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Journey breakdown */}
          <div style={cardStyle}>
            <p style={{ fontFamily: F, fontWeight: 700, fontSize: 15, color: '#4F4580', marginBottom: 16 }}>Users by Journey</p>
            {journeyList.length === 0 ? (
              <p style={{ fontFamily: M, fontSize: 13, color: '#C0B8D8' }}>No data yet.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {journeyList.map(([journey, count]) => (
                  <div key={journey}>
                    <div className="flex items-center justify-between mb-1">
                      <span style={{ fontFamily: M, fontSize: 12, color: '#4F4580' }}>{JOURNEY_LABELS[journey] ?? journey}</span>
                      <span style={{ fontFamily: M, fontSize: 12, color: '#A0A0B8', fontWeight: 600 }}>{count}</span>
                    </div>
                    <div style={{ background: '#F0EBF8', borderRadius: 9999, height: 6 }}>
                      <div style={{
                        background: '#699BA9', borderRadius: 9999, height: 6,
                        width: `${Math.round((count / maxJourney) * 100)}%`,
                        transition: 'width 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Lounge breakdown + Recent signups */}
          <div className="flex flex-col gap-6">
            <div style={cardStyle}>
              <p style={{ fontFamily: F, fontWeight: 700, fontSize: 15, color: '#4F4580', marginBottom: 16 }}>Users by Lounge</p>
              {Object.entries(loungeCounts).length === 0 ? (
                <p style={{ fontFamily: M, fontSize: 13, color: '#C0B8D8' }}>No data yet.</p>
              ) : (
                <div className="flex gap-4 flex-wrap">
                  {Object.entries(loungeCounts).map(([lounge, count]) => (
                    <div key={lounge} style={{ textAlign: 'center' }}>
                      <p style={{ fontFamily: F, fontWeight: 700, fontSize: 24, color: '#4F4580' }}>{count}</p>
                      <p style={{ fontFamily: M, fontSize: 12, color: '#A0A0B8', textTransform: 'capitalize' }}>{lounge}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={cardStyle}>
              <p style={{ fontFamily: F, fontWeight: 700, fontSize: 15, color: '#4F4580', marginBottom: 16 }}>Recent Signups</p>
              {(recent ?? []).length === 0 ? (
                <p style={{ fontFamily: M, fontSize: 13, color: '#C0B8D8' }}>No signups yet.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {recent!.map((u, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%', background: '#F0EBF8',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: F, fontWeight: 700, fontSize: 13, color: '#9B8FBF', flexShrink: 0,
                      }}>
                        {(u.first_name || '?').charAt(0).toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontFamily: M, fontSize: 13, color: '#4F4580', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {u.first_name || 'Anonymous'}
                        </p>
                        <p style={{ fontFamily: M, fontSize: 11, color: '#A0A0B8' }}>
                          {JOURNEY_LABELS[u.journey] ?? u.journey ?? '—'} · {u.lounge ?? 'womens'}
                        </p>
                      </div>
                      <span style={{ fontFamily: M, fontSize: 11, color: '#C0B8D8', flexShrink: 0 }}>
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
