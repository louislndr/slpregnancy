'use client';
import { useState, useRef, useEffect } from 'react';
import Nav from '@/components/Nav';

const F = 'Raleway, sans-serif';
const M = 'Montserrat, sans-serif';

type Role = 'user' | 'assistant';

interface ToolEvent {
  name: string;
  args: Record<string, string>;
}

interface Message {
  role: Role;
  text: string;
  tools?: ToolEvent[];
}

function ToolBadge({ tool }: { tool: ToolEvent }) {
  const isWrite = tool.name === 'write_file';
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: isWrite ? '#FFF3EB' : '#F0EBF8',
      border: `1px solid ${isWrite ? '#FFD4B8' : '#E8E0F0'}`,
      borderRadius: 8, padding: '3px 10px', marginBottom: 4,
      fontFamily: M, fontSize: 10, color: isWrite ? '#E08055' : '#9B8FBF',
    }}>
      <span>{isWrite ? '✎' : '↓'}</span>
      <span>{tool.name === 'read_file' ? 'read' : 'write'} {tool.args.path ?? ''}</span>
    </div>
  );
}

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user';
  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', marginBottom: 12 }}>
      <div style={{ maxWidth: '75%' }}>
        {!isUser && msg.tools && msg.tools.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: 4 }}>
            {msg.tools.map((t, i) => <ToolBadge key={i} tool={t} />)}
          </div>
        )}
        <div style={{
          background: isUser ? '#699BA9' : 'white',
          color: isUser ? 'white' : '#4F4580',
          borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
          padding: '10px 14px',
          fontFamily: M, fontSize: 13, lineHeight: 1.55,
          border: isUser ? 'none' : '1px solid #E8E0F0',
          boxShadow: '0 2px 6px rgba(79,69,128,0.06)',
          whiteSpace: 'pre-wrap',
        }}>
          {msg.text || <span style={{ color: '#C0B8D8', fontStyle: 'italic' }}>Thinking…</span>}
        </div>
      </div>
    </div>
  );
}

export default function StudioPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');

    const userMsg: Message = { role: 'user', text };
    const assistantMsg: Message = { role: 'assistant', text: '', tools: [] };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setLoading(true);

    try {
      const history = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.text,
      }));

      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });

      if (!res.ok || !res.body) throw new Error('Network error');

      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });

        const lines = buf.split('\n');
        buf = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const raw = line.slice(6).trim();
          if (!raw) continue;

          let evt: Record<string, unknown>;
          try { evt = JSON.parse(raw); } catch { continue; }

          if (evt.t === 'text') {
            setMessages((prev) => {
              const copy = [...prev];
              const last = { ...copy[copy.length - 1] };
              last.text += evt.v as string;
              copy[copy.length - 1] = last;
              return copy;
            });
          } else if (evt.t === 'tool') {
            setMessages((prev) => {
              const copy = [...prev];
              const last = { ...copy[copy.length - 1] };
              last.tools = [...(last.tools ?? []), { name: evt.n as string, args: evt.a as Record<string, string> }];
              copy[copy.length - 1] = last;
              return copy;
            });
          }
        }
      }
    } catch (err) {
      setMessages((prev) => {
        const copy = [...prev];
        const last = { ...copy[copy.length - 1] };
        last.text = `Error: ${err instanceof Error ? err.message : 'Something went wrong.'}`;
        copy[copy.length - 1] = last;
        return copy;
      });
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#F9F7FF' }}>
      <Nav />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', maxWidth: 720, margin: '0 auto', width: '100%', padding: '24px 24px 0' }}>

        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontFamily: F, fontWeight: 700, fontSize: 20, color: '#4F4580' }}>Studio</h1>
          <p style={{ fontFamily: M, fontSize: 12, color: '#A0A0B8', marginTop: 2 }}>
            Describe a design change — colors, fonts, spacing — and AI will apply it to your app.
          </p>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 20 }}>
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', marginTop: 60 }}>
              <p style={{ fontFamily: F, fontSize: 15, color: '#C0B8D8', fontWeight: 600 }}>
                What would you like to change?
              </p>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' }}>
                {[
                  'Make the primary color softer, more sage green',
                  'Increase the heading font size slightly',
                  'Use warmer accent colors throughout',
                ].map((s) => (
                  <button
                    key={s}
                    onClick={() => setInput(s)}
                    style={{
                      fontFamily: M, fontSize: 11, color: '#9B8FBF',
                      background: 'white', border: '1px solid #E8E0F0',
                      borderRadius: 9999, padding: '6px 14px', cursor: 'pointer',
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{
          position: 'sticky', bottom: 0,
          background: '#F9F7FF', paddingBottom: 24, paddingTop: 8,
        }}>
          <div style={{
            display: 'flex', gap: 8, alignItems: 'flex-end',
            background: 'white', border: '1px solid #E8E0F0',
            borderRadius: 16, padding: '10px 12px',
            boxShadow: '0 2px 12px rgba(79,69,128,0.06)',
          }}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Describe a design change…"
              rows={1}
              disabled={loading}
              style={{
                flex: 1, resize: 'none', border: 'none', outline: 'none',
                fontFamily: M, fontSize: 13, color: '#4F4580',
                background: 'transparent', lineHeight: 1.5,
              }}
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              style={{
                background: loading || !input.trim() ? '#E8E0F0' : '#699BA9',
                color: 'white', border: 'none', borderRadius: 10,
                width: 34, height: 34, flexShrink: 0, cursor: loading || !input.trim() ? 'default' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, fontWeight: 700,
                transition: 'background 180ms ease',
              }}
            >
              ↑
            </button>
          </div>
          <p style={{ fontFamily: M, fontSize: 10, color: '#C0B8D8', textAlign: 'center', marginTop: 6 }}>
            Changes are applied to the app theme on the client branch · Enter to send
          </p>
        </div>

      </main>
    </div>
  );
}
