'use server';

import { revalidatePath } from 'next/cache';
import { UserCoinInterface } from '../types';
import { request } from '../utils/request';
import { getSession } from '../utils/session';
import { redirect } from 'next/navigation';

export async function depositCoins(coins: UserCoinInterface[]) {
  const requestData = { coins: coins.filter((c) => c.quantity > 0) };
  const token = getSession();
  if (!token) throw new Error();

  const { errors } = await request('/deposit', 'POST', requestData, {
    token,
  });

  if (errors) return errors;

  revalidatePath('/dashboard');
  redirect('/dashboard');
}
