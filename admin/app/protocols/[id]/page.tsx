import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Nav from '@/components/Nav';
import ProtocolForm from '@/components/ProtocolForm';

export const dynamic = 'force-dynamic';

export default async function EditProtocolPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: protocol } = await supabase
    .from('protocols')
    .select('*')
    .eq('id', id)
    .single();

  if (!protocol) notFound();

  const { data: parts } = await supabase
    .from('protocol_parts')
    .select('*')
    .eq('protocol_id', id)
    .order('position');

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="max-w-3xl mx-auto w-full px-6 py-8">
        <h1 style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 700, fontSize: 26, color: '#4F4580', marginBottom: 24 }}>Edit Session</h1>
        <ProtocolForm protocol={protocol} parts={parts ?? []} />
      </main>
    </div>
  );
}
