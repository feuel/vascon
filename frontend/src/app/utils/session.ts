import 'server-only';
import { cookies } from 'next/headers';

const SessionKey = 'session';
export async function createSession(token: string) {
  const expiresAt = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000); // 1 DAY;
  cookies().set(SessionKey, token, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}

export function getSession() {
  return cookies().get(SessionKey)?.value || null;
}

export function deleteSession() {
  cookies().delete(SessionKey);
}
