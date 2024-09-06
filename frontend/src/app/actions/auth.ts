'use server';

import { z } from 'zod';
import { createSession, deleteSession } from '../utils/session';
import { request } from '../utils/request';
import { redirect } from 'next/navigation';
import { FormState } from '../types';

const SignupFormSchema = z
  .object({
    first_name: z
      .string()
      .min(1, { message: 'Enter a valid first name' })
      .trim(),
    last_name: z.string().min(1, { message: 'Enter a last name.' }).trim(),
    username: z
      .string()
      .min(3, { message: 'Username must be three characters or more' })
      .trim(),
    password: z
      .string()
      .min(8, { message: 'be at least 8 characters long' })
      .regex(/[a-zA-Z]/, { message: 'contains a letter' })
      .regex(/[0-9]/, { message: 'contain one or number' })
      .regex(/[^a-zA-Z0-9]/, {
        message: 'contain at least one special character',
      })
      .trim(),
    retry_password: z.string(),
  })
  .refine((data) => data.password === data.retry_password, {
    path: ['retry_password'],
    message: 'Passwords must be the same',
  });

const LoginFormSchema = z.object({
  password: z.string().trim(),
  username: z.string(),
});

interface SignupRequestInterface {
  first_name?: string;
  last_name?: string;
  username?: string;
  password?: string;
  retry_password?: string;
}

interface LoginRequestInterface {
  username?: string;
  password?: string;
}

interface LoginResponseInterface {
  access_token: string;
}

function formDataToObject<T>(formData: FormData) {
  return Object.fromEntries((formData as any).entries()) as T;
}

export async function signup(
  state: FormState<SignupRequestInterface, undefined>,
  formData: FormData
) {
  const data = formDataToObject<SignupRequestInterface>(formData);

  const validatedFields = SignupFormSchema.safeParse(data);

  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    return { errors };
  }

  const { retry_password, ...userData } = data;

  const { errors } = await request('/users', 'POST', userData);

  if (errors) return { errors };

  redirect('/login');
}

export async function login(
  state: FormState<LoginRequestInterface, LoginResponseInterface>,
  formData: FormData
) {
  const data = formDataToObject<LoginRequestInterface>(formData);

  const validatedFields = LoginFormSchema.safeParse(data);
  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    return { errors };
  }

  const { errors, data: response } = await request<LoginResponseInterface>(
    '/auth/login',
    'POST',
    data
  );

  if (errors) return { errors };
  if (!response) return;

  await createSession(response.access_token);

  redirect('/dashboard');
}

export async function logout(username: string) {
  const { errors } = await request('/auth/logout/all', 'POST', { username });
  if (errors) throw new Error('Logout failed');
  deleteSession();
  redirect('/login');
}
