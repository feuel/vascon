import { FormState, FormStateErrors } from '../types';

const BASE_URL = 'http://localhost:3001';

type RequestMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';
export async function request<T extends object>(
  url: string,
  method: RequestMethod = 'GET',
  data?: any,
  options: { token?: string } = {},
  requestHeaders: Record<string, any> = {}
): Promise<{ errors: FormStateErrors<typeof data> | null; data: T | null }> {
  const headers = {
    ...requestHeaders,
  };
  headers['Content-Type'] = 'application/json';
  if (options.token) {
    headers['Authorization'] = `Bearer ${options.token}`;
  }

  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      method,
      body: data ? JSON.stringify(data) : undefined,
      headers,
    });
    const parsed = await response.json();
    if (!response.ok) throw parsed;
    return { data: parsed.data as T, errors: null };
  } catch (error: unknown) {
    return {
      errors: error as FormStateErrors<typeof data>,
      data: null,
    };
  }
}
