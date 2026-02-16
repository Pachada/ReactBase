import type { User } from '@/app/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

if (import.meta.env.PROD && API_BASE_URL.startsWith('http://')) {
  throw new Error('HTTPS is required for API_BASE_URL in production');
}

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed (${response.status})`);
  }

  return (await response.json()) as T;
}

export const api = {
  getCurrentUser: () => fetchAPI<User>('/v1/users/me'),
};
