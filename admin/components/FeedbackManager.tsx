'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface FeedbackItem {
  id: string;
  message: string;
  type: string;
  rating: number | null;
  is_read: boolean;
  created_at: string;
}

const F = 'Raleway, sans-serif';
const M = 'Montserrat, sans-serif';

const TYPE_COLORS: Record<string, string> = {
  bug: '#E07070',
  suggestion: '#699BA9',
  general: '#9B8FBF',
  praise: '#7BC89B',
};

export default function FeedbackManager({ items }: { items: FeedbackItem[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'unread'>('unread');

  const displayed = filter === 'unread' ? items.filter((i) => !i.is_read) : items;
  const unreadCount = items.filter((i) => !i.is_read).length;

  async function markRead(id: string, is_read: boolean) {
    await fetch('/api/feedback', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, is_read }),
    });
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this feedback?')) return;
    await fetch(`/api/feedback?id=${id}`, { method: 'DELETE' });
    router.refresh();
  }

  const cardStyle = {
    background: 'white', borderRadius: 20, padding: 20,
    border: '1px solid #E8E0F0', boxShadow: '0 2px 12px rgba(79,69,128,0.05)',
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <p style={{ fontFamily: M, fontSize: 13, color: '#A0A0B8' }}>
          User-submitted feedback from the app.
        </p>
        <div className="flex gap-2 ml-auto">
          {(['unread', 'all'] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} type="button"
              className="px-4 py-1.5 rounded-full text-xs transition-all"
              style={{
                fontFamily: M, fontWeight: 600,
                background: filter === f ? '#4F4580' : '#F9F7FF',
                color: filter === f ? 'white' : '#A0A0B8',
                border: `1.5px solid ${filter === f ? '#4F4580' : '#E8E0F0'}`,
              }}>
              {f === 'unread' ? `Unread (${unreadCount})` : 'All'}
            </button>
          ))}
        </div>
      </div>

      {displayed.length === 0 && (
        <p style={{ fontFamily: M, fontSize: 13, color: '#C0B8D8' }}>
          {filter === 'unread' ? 'No unread feedback. All caught up!' : 'No feedback yet.'}
        </p>
      )}

      {displayed.map((item) => (
        <div key={item.id} style={{ ...cardStyle, opacity: item.is_read ? 0.65 : 1 }}>
          <div className="flex items-start gap-3 mb-3">
            <div style={{ flex: 1 }}>
              <div className="flex items-center gap-2 mb-2">
                {item.type && (
                  <span style={{
                    background: TYPE_COLORS[item.type] ?? '#E8E0F0',
                    color: 'white', borderRadius: 9999,
                    padding: '2px 10px', fontSize: 11,
                    fontFamily: M, fontWeight: 600, textTransform: 'capitalize',
                  }}>{item.type}</span>
                )}
                {item.rating != null && (
                  <span style={{ fontFamily: M, fontSize: 12, color: '#FFC299' }}>
                    {'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}
                  </span>
                )}
                {!item.is_read && (
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#699BA9', display: 'inline-block' }} />
                )}
                <span style={{ fontFamily: M, fontSize: 11, color: '#C0B8D8', marginLeft: 'auto' }}>
                  {new Date(item.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <p style={{ fontFamily: M, fontSize: 14, color: '#4F4580', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{item.message}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => markRead(item.id, !item.is_read)}
              className="px-4 py-1.5 rounded-full text-xs transition-opacity hover:opacity-80"
              style={{ background: '#DBE8F0', color: '#699BA9', fontFamily: M, fontWeight: 600 }}>
              {item.is_read ? 'Mark Unread' : 'Mark Read'}
            </button>
            <button onClick={() => handleDelete(item.id)}
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
