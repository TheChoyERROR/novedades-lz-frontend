import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { clearStoredAuthState, getStoredAuthToken } from '@/lib/auth/storage';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (process.env.NODE_ENV === 'development' ? 'http://localhost:8080/api' : '');

if (!API_BASE_URL && process.env.NODE_ENV !== 'development') {
  console.error('Missing NEXT_PUBLIC_API_BASE_URL for production frontend build');
}

const API_TIMEOUT_MS = 30000;
const MAX_RETRY_ATTEMPTS = 2;
export const BACKEND_RETRY_DELAY_MS = 5000;
const RETRYABLE_METHODS = new Set(['get', 'head', 'options']);
const RETRYABLE_STATUS_CODES = new Set([408, 425, 429, 502, 503, 504]);
const RETRYABLE_ERROR_CODES = new Set(['ECONNABORTED', 'ETIMEDOUT', 'ERR_NETWORK']);

export type ApiAvailabilityState = 'loading' | 'warming_up' | 'ready' | 'error';

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retryCount?: number;
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getRetryDelay(attempt: number) {
  return 2000 * attempt;
}

export function isBackendUnavailableError(error: unknown) {
  if (!axios.isAxiosError(error) || error.response?.status === 401) {
    return false;
  }

  if (!error.response) {
    return !error.code || RETRYABLE_ERROR_CODES.has(error.code);
  }

  return RETRYABLE_STATUS_CODES.has(error.response.status);
}

function isRetryableError(error: AxiosError, config?: RetryableRequestConfig) {
  if (!config?.method || !RETRYABLE_METHODS.has(config.method.toLowerCase())) {
    return false;
  }

  if ((config._retryCount ?? 0) >= MAX_RETRY_ATTEMPTS) {
    return false;
  }

  if (error.response?.status === 401) {
    return false;
  }

  if (!error.response) {
    return !error.code || RETRYABLE_ERROR_CODES.has(error.code);
  }

  return RETRYABLE_STATUS_CODES.has(error.response.status);
}

function shouldResetSessionOnAuthError(error: AxiosError) {
  if (!error.response) {
    return false;
  }

  if (error.response.status === 401) {
    return true;
  }

  if (error.response.status !== 403 || typeof window === 'undefined') {
    return false;
  }

  const requestUrl = error.config?.url ?? '';
  const isAdminArea = window.location.pathname.startsWith('/admin');
  const isSessionValidationRequest = requestUrl.startsWith('/auth/me');

  return isAdminArea || isSessionValidationRequest;
}

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT_MS,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getStoredAuthToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (shouldResetSessionOnAuthError(error)) {
      if (typeof window !== 'undefined') {
        clearStoredAuthState();
        window.location.href = '/login';
      }
    }

    const config = error.config as RetryableRequestConfig | undefined;

    if (config && isRetryableError(error, config)) {
      const nextAttempt = (config?._retryCount ?? 0) + 1;

      config._retryCount = nextAttempt;

      console.warn(
        `[apiClient] Reintentando ${config?.method?.toUpperCase()} ${config?.url} (${nextAttempt}/${MAX_RETRY_ATTEMPTS})`
      );

      await sleep(getRetryDelay(nextAttempt));

      return apiClient.request(config);
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
