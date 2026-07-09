import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase
    .from('checkin_suggestions')
    .select('emotional_state, protocol_id, sort_order')
    .order('sort_order');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  // payload: { state: string, protocol_ids: string[] }[]
  const rows: { emotional_state: string; protocol_id: string; sort_order: number }[] = [];
  const payload: { state: string; protocol_ids: string[] }[] = await req.json();

  for (const { state, protocol_ids } of payload) {
    protocol_ids.forEach((pid, i) => {
      rows.push({ emotional_state: state, protocol_id: pid, sort_order: i });
    });
  }

  // Replace all rows
  const states = payload.map((p) => p.state);
  const { error: delErr } = await supabase
    .from('checkin_suggestions')
    .delete()
    .in('emotional_state', states);

  if (delErr) return NextResponse.json({ error: delErr.message }, { status: 500 });

  if (rows.length > 0) {
    const { error: insErr } = await supabase.from('checkin_suggestions').insert(rows);
    if (insErr) return NextResponse.json({ error: insErr.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
