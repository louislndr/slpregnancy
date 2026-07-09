import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Nav from '@/components/Nav';

export const dynamic = 'force-dynamic';

const F = { family: 'Raleway, sans-serif' };
const M = { family: 'Montserrat, sans-serif' };

export default async function ProgramsPage() {
  const { data: programs } = await supabase
    .from('programs')
    .select('id, title, journey, is_premium, created_at')
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="max-w-5xl mx-auto w-full px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 style={{ fontFamily: F.family, fontWeight: 700, fontSize: 26, color: '#4F4580' }}>Programs</h1>
            <p style={{ fontFamily: M.family, fontSize: 13, color: '#A0A0B8', marginTop: 2 }}>{programs?.length ?? 0} programs</p>
          </div>
          <Link
            href="/programs/new"
            className="flex items-center gap-2 px-6 py-2.5 rounded-full text-white text-sm transition-opacity hover:opacity-90"
            style={{ background: '#FFC299', fontFamily: F.family, fontWeight: 700, boxShadow: '0 4px 16px rgba(255,194,153,0.35)' }}
          >
            + New Program
          </Link>
        </div>

        <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid #E8E0F0', boxShadow: '0 2px 16px rgba(79,69,128,0.06)' }}>
          {!programs || programs.length === 0 ? (
            <div className="text-center py-20" style={{ fontFamily: M.family, fontSize: 14, color: '#A0A0B8' }}>
              No programs yet.
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid #E8E0F0' }}>
                  {['Title', 'Journey', 'Access', ''].map((h) => (
                    <th key={h} className="text-left px-6 py-4" style={{ fontFamily: M.family, fontWeight: 600, fontSize: 11, color: '#A0A0B8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {programs.map((p, i) => (
                  <tr key={p.id} className="hover:bg-[#F9F7FF] transition-colors" style={{ borderBottom: i < programs.length - 1 ? '1px solid #E8E0F0' : 'none' }}>
                    <td className="px-6 py-4" style={{ fontFamily: F.family, fontWeight: 600, fontSize: 14, color: '#4F4580' }}>{p.title}</td>
                    <td className="px-6 py-4" style={{ fontFamily: M.family, fontSize: 13, color: '#7B7B9B' }}>{p.journey ?? '—'}</td>
                    <td className="px-6 py-4">
                      {p.is_premium
                        ? <span className="px-3 py-1 rounded-full text-xs" style={{ fontFamily: M.family, background: '#FFE6D5', color: '#FFC299', fontWeight: 600 }}>Premium</span>
                        : <span style={{ fontFamily: M.family, fontSize: 13, color: '#A0A0B8' }}>Free</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/programs/${p.id}`} style={{ fontFamily: M.family, fontWeight: 600, fontSize: 13, color: '#699BA9' }} className="hover:underline">Edit flow →</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
