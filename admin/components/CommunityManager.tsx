'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const POST_TYPES = ['announcement', 'tip', 'story', 'event'];

interface Post {
  id: string;
  title: string;
  content: string;
  type: string;
  is_published: boolean;
  created_at: string;
}

const F = 'Raleway, sans-serif';
const M = 'Montserrat, sans-serif';

const cardStyle = {
  background: 'white', borderRadius: 20, padding: 24,
  border: '1px solid #E8E0F0', boxShadow: '0 2px 12px rgba(79,69,128,0.05)',
};

const inputStyle = {
  border: '1.5px solid #E8E0F0', borderRadius: 14, padding: '10px 16px',
  fontFamily: M, fontSize: 14, color: '#4F4580', background: '#FAFAFA',
  outline: 'none', width: '100%',
};

const TYPE_COLORS: Record<string, string> = {
  announcement: '#699BA9',
  tip: '#9B8FBF',
  story: '#FFC299',
  event: '#7BC89B',
};

function TypeBadge({ type }: { type: string }) {
  return (
    <span style={{
      background: TYPE_COLORS[type] ?? '#E8E0F0',
      color: 'white', borderRadius: 9999,
      padding: '2px 10px', fontSize: 11,
      fontFamily: M, fontWeight: 600, textTransform: 'capitalize',
    }}>{type}</span>
  );
}

export default function CommunityManager({ posts }: { posts: Post[] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('announcement');
  const [isPublished, setIsPublished] = useState(false);
  const [saving, setSaving] = useState(false);

  function openNew() {
    setEditing(null);
    setTitle(''); setContent(''); setType('announcement'); setIsPublished(false);
    setShowForm(true);
  }

  function openEdit(post: Post) {
    setEditing(post);
    setTitle(post.title); setContent(post.content); setType(post.type); setIsPublished(post.is_published);
    setShowForm(true);
  }

  async function handleSave() {
    setSaving(true);
    const body = { title, content, type, is_published: isPublished, ...(editing ? { id: editing.id } : {}) };
    await fetch('/api/community', {
      method: editing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    setSaving(false);
    setShowForm(false);
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this post?')) return;
    await fetch(`/api/community?id=${id}`, { method: 'DELETE' });
    router.refresh();
  }

  async function togglePublish(post: Post) {
    await fetch('/api/community', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...post, is_published: !post.is_published }),
    });
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      <p style={{ fontFamily: M, fontSize: 13, color: '#A0A0B8' }}>
        Manage posts, announcements, tips and stories that appear in the app's community section.
      </p>

      <button onClick={openNew} type="button"
        className="self-start px-6 py-2.5 rounded-full text-white text-sm transition-opacity hover:opacity-90"
        style={{ background: '#FFC299', fontFamily: F, fontWeight: 700, boxShadow: '0 4px 16px rgba(255,194,153,0.35)' }}>
        + New Post
      </button>

      {showForm && (
        <div style={cardStyle}>
          <p style={{ fontFamily: F, fontWeight: 700, fontSize: 16, color: '#4F4580', marginBottom: 16 }}>
            {editing ? 'Edit Post' : 'New Post'}
          </p>
          <div className="flex flex-col gap-4">
            <div>
              <label style={{ fontFamily: M, fontWeight: 600, fontSize: 13, color: '#4F4580', display: 'block', marginBottom: 6 }}>Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontFamily: M, fontWeight: 600, fontSize: 13, color: '#4F4580', display: 'block', marginBottom: 6 }}>Content</label>
              <textarea rows={5} value={content} onChange={(e) => setContent(e.target.value)} style={{ ...inputStyle, resize: 'none' }} />
            </div>
            <div className="flex gap-4 items-end">
              <div style={{ flex: 1 }}>
                <label style={{ fontFamily: M, fontWeight: 600, fontSize: 13, color: '#4F4580', display: 'block', marginBottom: 6 }}>Type</label>
                <select value={type} onChange={(e) => setType(e.target.value)} style={{ ...inputStyle, appearance: 'auto' }}>
                  {POST_TYPES.map((t) => <option key={t} value={t} style={{ textTransform: 'capitalize' }}>{t}</option>)}
                </select>
              </div>
              <label className="flex items-center gap-2 cursor-pointer pb-3">
                <div onClick={() => setIsPublished(!isPublished)} className="relative w-10 h-5 rounded-full cursor-pointer" style={{ background: isPublished ? '#699BA9' : '#E8E0F0' }}>
                  <div className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform" style={{ transform: isPublished ? 'translateX(20px)' : 'translateX(2px)' }} />
                </div>
                <span style={{ fontFamily: M, fontSize: 13, color: '#4F4580' }}>Published</span>
              </label>
            </div>
            <div className="flex gap-3">
              <button onClick={handleSave} disabled={saving || !title.trim()}
                className="px-6 py-2.5 rounded-full text-white text-sm disabled:opacity-50"
                style={{ background: '#FFC299', fontFamily: F, fontWeight: 700 }}>
                {saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Post'}
              </button>
              <button onClick={() => setShowForm(false)} style={{ fontFamily: M, fontSize: 14, color: '#A0A0B8' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {posts.length === 0 && !showForm && (
        <p style={{ fontFamily: M, fontSize: 13, color: '#C0B8D8' }}>No posts yet. Create one above.</p>
      )}

      {posts.map((post) => (
        <div key={post.id} style={{ ...cardStyle, opacity: post.is_published ? 1 : 0.7 }}>
          <div className="flex items-start gap-3">
            <div style={{ flex: 1 }}>
              <div className="flex items-center gap-2 mb-2">
                <TypeBadge type={post.type} />
                {!post.is_published && (
                  <span style={{ fontFamily: M, fontSize: 11, color: '#A0A0B8', background: '#F0EBF8', borderRadius: 9999, padding: '2px 8px' }}>
                    Draft
                  </span>
                )}
                <span style={{ fontFamily: M, fontSize: 11, color: '#C0B8D8', marginLeft: 'auto' }}>
                  {new Date(post.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <p style={{ fontFamily: F, fontWeight: 700, fontSize: 16, color: '#4F4580', marginBottom: 6 }}>{post.title}</p>
              <p style={{ fontFamily: M, fontSize: 13, color: '#7B7B9B', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{post.content}</p>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={() => togglePublish(post)}
              className="px-4 py-1.5 rounded-full text-xs transition-opacity hover:opacity-80"
              style={{ background: post.is_published ? '#F0EBF8' : '#DBE8F0', color: post.is_published ? '#A0A0B8' : '#699BA9', fontFamily: M, fontWeight: 600 }}>
              {post.is_published ? 'Unpublish' : 'Publish'}
            </button>
            <button onClick={() => openEdit(post)}
              className="px-4 py-1.5 rounded-full text-xs transition-opacity hover:opacity-80"
              style={{ background: '#F0EBF8', color: '#9B8FBF', fontFamily: M, fontWeight: 600 }}>
              Edit
            </button>
            <button onClick={() => handleDelete(post.id)}
              className="px-4 py-1.5 rounded-full text-xs transition-opacity hover:opacity-80 ml-auto"
              style={{ background: '#FDE8E8', color: '#E07070', fontFamily: M, fontWeight: 600 }}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
