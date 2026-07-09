import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const { program, nodes, edges } = await req.json();

  const { error } = await supabase.from('programs').insert(program);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (nodes?.length) {
    const rows = nodes.map((n: { id: string; label: string; type: string; protocol_id: string | null; position_x: number; position_y: number }) => ({
      ...n, program_id: program.id,
    }));
    await supabase.from('flow_nodes').insert(rows);
  }

  if (edges?.length) {
    const rows = edges.map((e: { id: string; source_node: string; target_node: string; label: string }) => ({
      ...e, program_id: program.id,
    }));
    await supabase.from('flow_edges').insert(rows);
  }

  revalidatePath('/programs');
  return NextResponse.json({ ok: true });
}

export async function PUT(req: NextRequest) {
  const { program, nodes, edges } = await req.json();

  const { error } = await supabase.from('programs').update(program).eq('id', program.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await Promise.all([
    supabase.from('flow_nodes').delete().eq('program_id', program.id),
    supabase.from('flow_edges').delete().eq('program_id', program.id),
  ]);

  if (nodes?.length) {
    await supabase.from('flow_nodes').insert(nodes.map((n: FlowNode) => ({ ...n, program_id: program.id })));
  }
  if (edges?.length) {
    await supabase.from('flow_edges').insert(edges.map((e: FlowEdge) => ({ ...e, program_id: program.id })));
  }

  revalidatePath('/programs');
  return NextResponse.json({ ok: true });
}

interface FlowNode { id: string; label: string; type: string; protocol_id: string | null; position_x: number; position_y: number }
interface FlowEdge { id: string; source_node: string; target_node: string; label: string }
