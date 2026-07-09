import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Nav from '@/components/Nav';

export const dynamic = 'force-dynamic';

export default async function ProtocolsPage() {
  const { data: protocols } = await supabase
    .from('protocols')
    .select('id, title, duration, content_type, created_at')
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="max-w-5xl mx-auto w-full px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#4F4580]">Sessions</h1>
            <p className="text-sm text-gray-400 mt-0.5">{protocols?.length ?? 0} sessions</p>
          </div>
          <Link
            href="/protocols/new"
            className="bg-[#699BA9] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#5a8a97] transition"
          >
            + New Session
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {!protocols || protocols.length === 0 ? (
            <div className="text-center py-16 text-gray-400 text-sm">No sessions yet. Create your first one.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wide">
                  <th className="text-left px-6 py-4">Title</th>
                  <th className="text-left px-6 py-4">Type</th>
                  <th className="text-left px-6 py-4">Duration</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {protocols.map((p, i) => (
                  <tr key={p.id} className={`border-b border-gray-50 hover:bg-gray-50 transition ${i === protocols.length - 1 ? 'border-0' : ''}`}>
                    <td className="px-6 py-4 font-medium text-[#4F4580]">{p.title}</td>
                    <td className="px-6 py-4 text-gray-500">{p.content_type}</td>
                    <td className="px-6 py-4 text-gray-500">{p.duration} min</td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/protocols/${p.id}`} className="text-[#699BA9] hover:underline font-medium">Edit</Link>
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
