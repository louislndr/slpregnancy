'use server';
import { cookies } from 'next/headers';

const SESSION_COOKIE = 'admin_session';
const SECRET = process.env.ADMIN_PASSWORD ?? 'changeme';

export async function login(password: string): Promise<boolean> {
  if (password !== SECRET) return false;
  const store = await cookies();
  store.set(SESSION_COOKIE, 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
  return true;
}

export async function logout() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value === 'authenticated';
}
