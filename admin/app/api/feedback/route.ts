import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { supabase } from '@/lib/supabase';

export async function PUT(req: NextRequest) {
  const { id, is_read } = await req.json();
  const { error } = await supabase.from('user_feedback').update({ is_read }).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePath('/feedback');
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const { error } = await supabase.from('user_feedback').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePath('/feedback');
  return NextResponse.json({ ok: true });
}
