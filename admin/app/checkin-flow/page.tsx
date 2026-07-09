import { supabase } from '@/lib/supabase';
import Nav from '@/components/Nav';
import CheckinRulesEditor from '@/components/CheckinRulesEditor';

export const dynamic = 'force-dynamic';

export default async function CheckinFlowPage() {
  const [{ data: protocols }, { data: rules }] = await Promise.all([
    supabase.from('protocols').select('id, title').order('title'),
    supabase.from('checkin_rules').select('feeling, need, protocol_id, sort_order').order('sort_order'),
  ]);

  // Build initial map: { "feeling::need": protocol_id[] }
  const initial: Record<string, string[]> = {};
  for (const row of rules ?? []) {
    const k = `${row.feeling}::${row.need}`;
    if (!initial[k]) initial[k] = [];
    initial[k].push(row.protocol_id);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="max-w-3xl mx-auto w-full px-6 py-8">
        <h1 style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 700, fontSize: 26, color: '#4F4580', marginBottom: 8 }}>
          Check-in Pathways
        </h1>
        <CheckinRulesEditor protocols={protocols ?? []} initial={initial} />
      </main>
    </div>
  );
}
