const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_STORAGE_KEY = 'auth-storage';

export function getStoredAuthToken() {
  if (typeof window === 'undefined') {
    return null;
  }

  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function persistAuthToken(token: string) {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearStoredAuthState() {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_STORAGE_KEY);
}
