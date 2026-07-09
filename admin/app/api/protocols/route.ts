import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const { protocol, parts } = await req.json();

  const { error } = await supabase.from('protocols').insert(protocol);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (parts?.length) {
    const rows = parts.map((p: { id: string; label: string; duration: string }, i: number) => ({
      id: p.id,
      protocol_id: protocol.id,
      label: p.label,
      duration: p.duration,
      position: i,
    }));
    const { error: pe } = await supabase.from('protocol_parts').insert(rows);
    if (pe) return NextResponse.json({ error: pe.message }, { status: 500 });
  }

  revalidatePath('/protocols');
  return NextResponse.json({ ok: true });
}

export async function PUT(req: NextRequest) {
  const { protocol, parts } = await req.json();

  const { error } = await supabase.from('protocols').update(protocol).eq('id', protocol.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Replace parts
  await supabase.from('protocol_parts').delete().eq('protocol_id', protocol.id);
  if (parts?.length) {
    const rows = parts.map((p: { id: string; label: string; duration: string }, i: number) => ({
      id: p.id.startsWith('part-') ? undefined : p.id,
      protocol_id: protocol.id,
      label: p.label,
      duration: p.duration,
      position: i,
    }));
    await supabase.from('protocol_parts').insert(rows);
  }

  revalidatePath('/protocols');
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const { error } = await supabase.from('protocols').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePath('/protocols');
  return NextResponse.json({ ok: true });
}
