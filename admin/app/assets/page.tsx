import { supabase } from '@/lib/supabase';
import Nav from '@/components/Nav';
import AssetUploader from '@/components/AssetUploader';

export const dynamic = 'force-dynamic';

export default async function AssetsPage() {
  const [{ data: audio }, { data: visuals }] = await Promise.all([
    supabase.storage.from('audio').list('', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } }),
    supabase.storage.from('visuals').list('', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } }),
  ]);

  const audioUrls = (audio ?? []).map((f) => ({
    name: f.name,
    url: supabase.storage.from('audio').getPublicUrl(f.name).data.publicUrl,
  }));
  const visualUrls = (visuals ?? []).map((f) => ({
    name: f.name,
    url: supabase.storage.from('visuals').getPublicUrl(f.name).data.publicUrl,
  }));

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="max-w-5xl mx-auto w-full px-6 py-8 flex flex-col gap-8">
        <h1 style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 700, fontSize: 26, color: '#4F4580' }}>Assets</h1>
        <AssetUploader audioFiles={audioUrls} visualFiles={visualUrls} />
      </main>
    </div>
  );
}
