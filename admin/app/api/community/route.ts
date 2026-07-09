import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { error } = await supabase.from('community_posts').insert({
    title: body.title,
    content: body.content,
    type: body.type,
    is_published: body.is_published ?? false,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePath('/community');
  return NextResponse.json({ ok: true });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { error } = await supabase.from('community_posts').update({
    title: body.title,
    content: body.content,
    type: body.type,
    is_published: body.is_published,
    updated_at: new Date().toISOString(),
  }).eq('id', body.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePath('/community');
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const { error } = await supabase.from('community_posts').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePath('/community');
  return NextResponse.json({ ok: true });
}
