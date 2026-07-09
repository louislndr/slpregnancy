import { supabase } from '@/lib/supabase';
import Nav from '@/components/Nav';
import CheckinFlowEditor from '@/components/CheckinFlowEditor';

export const dynamic = 'force-dynamic';

export default async function CheckinFlowPage() {
  const [{ data: protocols }, { data: suggestions }] = await Promise.all([
    supabase.from('protocols').select('id, title').order('title'),
    supabase.from('checkin_suggestions').select('emotional_state, protocol_id, sort_order').order('sort_order'),
  ]);

  // Build initial map: { [emotional_state]: protocol_id[] }
  const initial: Record<string, string[]> = {};
  for (const row of suggestions ?? []) {
    if (!initial[row.emotional_state]) initial[row.emotional_state] = [];
    initial[row.emotional_state].push(row.protocol_id);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="max-w-3xl mx-auto w-full px-6 py-8">
        <h1 style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 700, fontSize: 26, color: '#4F4580', marginBottom: 8 }}>
          Check-in Flow
        </h1>
        <CheckinFlowEditor protocols={protocols ?? []} initial={initial} />
      </main>
    </div>
  );
}
