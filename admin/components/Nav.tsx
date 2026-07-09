'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const links = [
  { href: '/protocols', label: 'Sessions' },
  { href: '/programs', label: 'Programs' },
  { href: '/assets', label: 'Assets' },
];

export default function Nav() {
  const path = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  return (
    <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-8">
      <span className="font-bold text-[#4F4580] text-lg mr-4">SL Admin</span>
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={`text-sm font-medium transition ${
            path.startsWith(l.href)
              ? 'text-[#699BA9] border-b-2 border-[#699BA9] pb-0.5'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          {l.label}
        </Link>
      ))}
      <button
        onClick={handleLogout}
        className="ml-auto text-sm text-gray-400 hover:text-gray-600 transition"
      >
        Sign out
      </button>
    </nav>
  );
}
