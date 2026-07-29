'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

const links = [
  { href: '/', label: 'Dashboard', exact: true },
  { href: '/protocols', label: 'Sessions' },
  { href: '/programs', label: 'Programs' },
  { href: '/checkin-flow', label: 'Pathways' },
  { href: '/community', label: 'Community' },
  { href: '/feedback', label: 'Feedback' },
];

export default function Nav() {
  const path = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  return (
    <nav
      className="bg-white border-b border-[#E8E0F0] px-8 flex items-center gap-6 h-16 sticky top-0 z-50"
      style={{ boxShadow: '0 1px 8px rgba(79,69,128,0.06)' }}
    >
      <Image src="/LogoBaseline.png" alt="SL Pregnancy" width={120} height={36} className="object-contain mr-2" />

      <div className="flex items-center gap-1 h-full">
        {links.map((l) => {
          const active = l.exact ? path === l.href : path.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className="h-full flex items-center px-4 text-sm font-semibold transition-colors duration-200"
              style={{
                fontFamily: 'Montserrat, sans-serif',
                color: active ? '#699BA9' : '#A0A0B8',
                borderBottom: `2px solid ${active ? '#699BA9' : 'transparent'}`,
              }}
            >
              {l.label}
            </Link>
          );
        })}
      </div>

      <button
        onClick={handleLogout}
        className="ml-auto text-sm font-medium hover:text-primary"
        style={{ fontFamily: 'Montserrat, sans-serif', color: '#A0A0B8' }}
      >
        Sign out
      </button>
    </nav>
  );
}
