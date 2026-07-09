import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Nav from '@/components/Nav';
import ProgramForm from '@/components/ProgramForm';

export const dynamic = 'force-dynamic';

export default async function EditProgramPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [{ data: program }, { data: protocols }, { data: nodes }, { data: edges }] = await Promise.all([
    supabase.from('programs').select('*').eq('id', id).single(),
    supabase.from('protocols').select('id, title').order('title'),
    supabase.from('flow_nodes').select('*').eq('program_id', id),
    supabase.from('flow_edges').select('*').eq('program_id', id),
  ]);

  if (!program) notFound();

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="max-w-5xl mx-auto w-full px-6 py-8">
        <h1 className="text-2xl font-bold text-[#4F4580] mb-6">Edit Program</h1>
        <ProgramForm program={program} protocols={protocols ?? []} nodes={nodes ?? []} edges={edges ?? []} />
      </main>
    </div>
  );
}
