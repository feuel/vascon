import 'server-only';

import { deleteSession, getSession } from './session';
import { redirect } from 'next/navigation';
import { request } from './request';
import { UserInterface } from '../types';

export async function getUser({ redirectToLogin = true } = {}) {
  const token = getSession();
  if (!token) {
    if (redirectToLogin) throw redirect('/login');
    else return null;
  }

  const { errors, data } = await request<UserInterface>(
    '/auth/me',
    'GET',
    null,
    { token }
  );

  if (errors || !data) {
    deleteSession();
    if (redirectToLogin) throw redirect('/login');
    else return null;
  }

  return data;
}
