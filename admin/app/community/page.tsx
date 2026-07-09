import { supabase } from '@/lib/supabase';
import Nav from '@/components/Nav';
import CommunityManager from '@/components/CommunityManager';

export const dynamic = 'force-dynamic';

export default async function CommunityPage() {
  const { data: posts } = await supabase
    .from('community_posts')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="max-w-4xl mx-auto w-full px-6 py-8">
        <h1 style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 700, fontSize: 26, color: '#4F4580', marginBottom: 8 }}>
          Community
        </h1>
        <CommunityManager posts={posts ?? []} />
      </main>
    </div>
  );
}
