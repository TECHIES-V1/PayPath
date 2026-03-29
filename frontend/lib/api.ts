const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
const CONNECTION_ERROR_MESSAGE = "Connection error. Please check your internet connection.";
const GENERIC_ERROR_MESSAGE = "Something went wrong. Please try again.";

function isConnectionErrorMessage(message: string) {
  return /https?:\/\/|localhost|127\.0\.0\.1|ECONN|fetch failed|network|failed to fetch/i.test(message);
}

// NOTE: Ideally the JWT should be in an httpOnly cookie set by the backend.
// This module-scoped closure minimizes reads from localStorage to reduce XSS surface.
let authToken: string | null = null;
let hydrated = false;

function setSessionCookie(hasSession: boolean) {
  if (typeof document !== "undefined") {
    if (hasSession) {
      document.cookie = "paypath_has_session=1; path=/; SameSite=Lax; max-age=604800";
    } else {
      document.cookie = "paypath_has_session=; path=/; max-age=0";
    }
  }
}

export function setToken(token: string | null) {
  authToken = token;
  hydrated = true;
  setSessionCookie(!!token);
  if (typeof window !== "undefined") {
    if (token) {
      localStorage.setItem("paypath_token", token);
    } else {
      localStorage.removeItem("paypath_token");
    }
  }
}

export function getToken(): string | null {
  if (!hydrated && typeof window !== "undefined") {
    authToken = localStorage.getItem("paypath_token");
    hydrated = true;
  }
  return authToken;
}

const TIMEOUT_ERROR_MESSAGE = "Request timed out. Please try again.";
const DEFAULT_TIMEOUT = 15000;

interface ApiOptions {
  headers?: Record<string, string>;
  signal?: AbortSignal;
  timeout?: number;
}

function getHeaders(options?: ApiOptions): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options?.headers,
  };
  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    if (response.status === 401) {
      setToken(null);
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      throw new Error("Session expired. Please sign in again.");
    }

    const error = await response.json().catch(() => ({ message: GENERIC_ERROR_MESSAGE }));
    const message = typeof error.message === "string" ? error.message : GENERIC_ERROR_MESSAGE;

    if (response.status >= 500) {
      throw new Error(GENERIC_ERROR_MESSAGE);
    }

    if (isConnectionErrorMessage(message)) {
      throw new Error(CONNECTION_ERROR_MESSAGE);
    }

    throw new Error(message || GENERIC_ERROR_MESSAGE);
  }
  return response.json();
}

function getSignal(options?: ApiOptions): AbortSignal {
  return options?.signal ?? AbortSignal.timeout(options?.timeout ?? DEFAULT_TIMEOUT);
}

function handleFetchError(error: unknown): never {
  if (error instanceof DOMException && error.name === "AbortError") {
    throw new Error(TIMEOUT_ERROR_MESSAGE);
  }
  if (error instanceof Error) {
    if (isConnectionErrorMessage(error.message)) {
      throw new Error(CONNECTION_ERROR_MESSAGE);
    }
    throw error;
  }
  throw new Error(CONNECTION_ERROR_MESSAGE);
}

export async function apiGet<T>(path: string, options?: ApiOptions): Promise<T> {
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: "GET",
      headers: getHeaders(options),
      signal: getSignal(options),
    });
    return handleResponse<T>(response);
  } catch (error) {
    handleFetchError(error);
  }
}

export async function apiPost<T>(path: string, body?: unknown, options?: ApiOptions): Promise<T> {
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: getHeaders(options),
      body: body ? JSON.stringify(body) : undefined,
      signal: getSignal(options),
    });
    return handleResponse<T>(response);
  } catch (error) {
    handleFetchError(error);
  }
}

export async function apiPut<T>(path: string, body?: unknown, options?: ApiOptions): Promise<T> {
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: "PUT",
      headers: getHeaders(options),
      body: body ? JSON.stringify(body) : undefined,
      signal: getSignal(options),
    });
    return handleResponse<T>(response);
  } catch (error) {
    handleFetchError(error);
  }
}

export async function apiDelete<T>(path: string, options?: ApiOptions): Promise<T> {
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: "DELETE",
      headers: getHeaders(options),
      signal: getSignal(options),
    });
    return handleResponse<T>(response);
  } catch (error) {
    handleFetchError(error);
  }
}
