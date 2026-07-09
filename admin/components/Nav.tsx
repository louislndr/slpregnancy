'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const links = [
  { href: '/protocols', label: 'Sessions' },
  { href: '/programs', label: 'Programs' },
  { href: '/checkin-flow', label: 'Check-in Flow' },
];

export default function Nav() {
  const path = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  return (
    <nav className="bg-white border-b border-[#E8E0F0] px-8 flex items-center gap-6 h-16" style={{ boxShadow: '0 1px 8px rgba(79,69,128,0.06)' }}>
      <span style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 700, color: '#4F4580', fontSize: 18, letterSpacing: '-0.3px', marginRight: 8 }}>SL Pregnancy</span>
      <div className="flex items-center gap-1 h-full">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="h-full flex items-center px-4 text-sm transition-colors"
            style={{
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 600,
              color: path.startsWith(l.href) ? '#699BA9' : '#A0A0B8',
              borderBottom: path.startsWith(l.href) ? '2px solid #699BA9' : '2px solid transparent',
            }}
          >
            {l.label}
          </Link>
        ))}
      </div>
      <button
        onClick={handleLogout}
        className="ml-auto text-sm transition-colors"
        style={{ fontFamily: 'Montserrat, sans-serif', color: '#A0A0B8' }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#699BA9')}
        onMouseLeave={(e) => (e.currentTarget.style.color = '#A0A0B8')}
      >
        Sign out
      </button>
    </nav>
  );
}
