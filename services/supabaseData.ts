import { supabase } from '@/lib/supabase';
import type { Protocol } from '@/data/protocols';
import type { Program, ProgramSession } from '@/data/programs';

export async function fetchProtocolsFromSupabase(): Promise<Protocol[]> {
  const { data: rows, error } = await supabase
    .from('protocols')
    .select('id, title, description, duration, content_type, journeys, emotional_states, needs, positions, has_visual, intention, self_care_tip, is_support_now, support_now_key, for_lounge, audio_url, visual_url')
    .order('title');

  if (error) throw new Error(error.message);
  if (!rows || rows.length === 0) return [];

  // Separate query for parts — avoids join RLS issues
  const { data: allParts } = await supabase
    .from('protocol_parts')
    .select('protocol_id, label, duration, position')
    .in('protocol_id', rows.map((r) => r.id))
    .order('position');

  const partsMap = new Map<string, { label: string; duration: string }[]>();
  for (const part of (allParts ?? [])) {
    const arr = partsMap.get(part.protocol_id) ?? [];
    arr.push({ label: part.label, duration: part.duration });
    partsMap.set(part.protocol_id, arr);
  }

  return rows.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description ?? '',
    duration: p.duration,
    contentType: p.content_type as Protocol['contentType'],
    journeys: p.journeys ?? [],
    emotionalStates: p.emotional_states ?? [],
    needs: p.needs ?? [],
    positions: p.positions ?? [],
    hasVisual: p.has_visual ?? false,
    intention: p.intention ?? '',
    parts: partsMap.get(p.id) ?? [],
    selfCareTip: p.self_care_tip ?? '',
    isSupportNow: p.is_support_now ?? false,
    supportNowKey: p.support_now_key ?? undefined,
    forLounge: p.for_lounge ?? undefined,
  }));
}

export async function fetchProgramsFromSupabase(allProtocols: Protocol[]): Promise<Program[]> {
  const { data: programs, error } = await supabase
    .from('programs')
    .select('*')
    .order('created_at');

  if (error || !programs || programs.length === 0) return [];

  const { data: nodes } = await supabase
    .from('flow_nodes')
    .select('*')
    .in('program_id', programs.map((p) => p.id))
    .eq('type', 'session');

  return programs.map((p) => {
    const programNodes = (nodes ?? [])
      .filter((n) => n.program_id === p.id && n.protocol_id)
      .sort((a, b) => a.position_x - b.position_x);

    const sessions: ProgramSession[] = programNodes.map((n, i) => {
      const protocol = allProtocols.find((pr) => pr.id === n.protocol_id);
      return {
        id: n.id,
        sessionNumber: i + 1,
        title: n.label || protocol?.title || '',
        duration: protocol?.duration ?? 10,
        protocolId: n.protocol_id,
      };
    });

    return {
      id: p.id,
      title: p.title,
      description: p.description ?? '',
      journey: p.journey ?? '',
      totalSessions: sessions.length,
      sessions,
      color: '#699BA9',
      forLounge: p.lounge as Program['forLounge'],
    };
  });
}
