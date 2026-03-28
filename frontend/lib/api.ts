const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
const CONNECTION_ERROR_MESSAGE = "Connection error. Please check your internet connection.";
const GENERIC_ERROR_MESSAGE = "Something went wrong. Please try again.";

function isConnectionErrorMessage(message: string) {
  return /https?:\/\/|localhost|127\.0\.0\.1|ECONN|fetch failed|network|failed to fetch/i.test(message);
}

let authToken: string | null = null;

export function setToken(token: string | null) {
  authToken = token;
  if (typeof window !== "undefined") {
    if (token) {
      localStorage.setItem("paypath_token", token);
    } else {
      localStorage.removeItem("paypath_token");
    }
  }
}

export function getToken(): string | null {
  if (authToken) return authToken;
  if (typeof window !== "undefined") {
    authToken = localStorage.getItem("paypath_token");
  }
  return authToken;
}

interface ApiOptions {
  headers?: Record<string, string>;
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

export async function apiGet<T>(path: string, options?: ApiOptions): Promise<T> {
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: "GET",
      headers: getHeaders(options),
    });
    return handleResponse<T>(response);
  } catch (error) {
    if (error instanceof Error) {
      if (isConnectionErrorMessage(error.message)) {
        throw new Error(CONNECTION_ERROR_MESSAGE);
      }
      throw error;
    }
    throw new Error(CONNECTION_ERROR_MESSAGE);
  }
}

export async function apiPost<T>(path: string, body?: unknown, options?: ApiOptions): Promise<T> {
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: getHeaders(options),
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(response);
  } catch (error) {
    if (error instanceof Error) {
      if (isConnectionErrorMessage(error.message)) {
        throw new Error(CONNECTION_ERROR_MESSAGE);
      }
      throw error;
    }
    throw new Error(CONNECTION_ERROR_MESSAGE);
  }
}

export async function apiPut<T>(path: string, body?: unknown, options?: ApiOptions): Promise<T> {
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: "PUT",
      headers: getHeaders(options),
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(response);
  } catch (error) {
    if (error instanceof Error) {
      if (isConnectionErrorMessage(error.message)) {
        throw new Error(CONNECTION_ERROR_MESSAGE);
      }
      throw error;
    }
    throw new Error(CONNECTION_ERROR_MESSAGE);
  }
}

export async function apiDelete<T>(path: string, options?: ApiOptions): Promise<T> {
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: "DELETE",
      headers: getHeaders(options),
    });
    return handleResponse<T>(response);
  } catch (error) {
    if (error instanceof Error) {
      if (isConnectionErrorMessage(error.message)) {
        throw new Error(CONNECTION_ERROR_MESSAGE);
      }
      throw error;
    }
    throw new Error(CONNECTION_ERROR_MESSAGE);
  }
}
