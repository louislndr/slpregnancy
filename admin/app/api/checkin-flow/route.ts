import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase
    .from('checkin_rules')
    .select('feeling, need, protocol_id, sort_order')
    .order('sort_order');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const rows: { feeling: string; need: string; protocol_id: string; sort_order: number }[] = await req.json();

  // Replace all rules
  const { error: delErr } = await supabase.from('checkin_rules').delete().neq('feeling', '');
  if (delErr) return NextResponse.json({ error: delErr.message }, { status: 500 });

  if (rows.length > 0) {
    const { error: insErr } = await supabase.from('checkin_rules').insert(rows);
    if (insErr) return NextResponse.json({ error: insErr.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
