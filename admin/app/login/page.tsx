'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.push('/protocols');
    } else {
      setError('Wrong password.');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FFF8F4 0%, #F5F0FF 50%, #FFE6D5 100%)' }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <img src="/LogoBaseline.png" alt="SophroLounge" style={{ height: 160, width: 'auto', objectFit: 'contain', marginBottom: 8 }} />
          <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 13, color: '#7B7B9B', marginTop: 4, letterSpacing: '0.5px' }}>Admin</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-8" style={{ boxShadow: '0 4px 32px rgba(79,69,128,0.10)' }}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
              className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
              style={{
                border: '1.5px solid #E8E0F0',
                fontFamily: 'Montserrat, sans-serif',
                color: '#4F4580',
                backgroundColor: '#FAFAFA',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#699BA9')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#E8E0F0')}
            />
            {error && (
              <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 13, color: '#E07070', textAlign: 'center' }}>{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full text-white text-sm transition-opacity disabled:opacity-50"
              style={{
                background: loading ? '#A0A0B8' : '#FFC299',
                fontFamily: 'Raleway, sans-serif',
                fontWeight: 700,
                fontSize: 15,
                boxShadow: '0 4px 16px rgba(255,194,153,0.35)',
              }}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
