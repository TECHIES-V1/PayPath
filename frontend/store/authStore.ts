import { create } from "zustand";
import { apiPost, apiGet, setToken, getToken } from "@/lib/api";

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
  updateUser: (data: Partial<Pick<User, "name" | "email">>) => void;
  clearError: () => void;
}

const PROFILE_KEY = "paypath_profile_overrides";

function saveOverrides(data: Partial<Pick<User, "name" | "email">>) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(data));
}

function loadOverrides(): Partial<Pick<User, "name" | "email">> {
  try {
    return JSON.parse(localStorage.getItem(PROFILE_KEY) || "{}");
  } catch {
    return {};
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const data = await apiPost<{ user: User; token: string }>("/auth/login", {
        email,
        password,
      });
      setToken(data.token);
      set({ user: { ...data.user, ...loadOverrides() }, isAuthenticated: true, isLoading: false });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Login failed";
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const data = await apiPost<{ user: User; token: string }>("/auth/register", {
        name,
        email,
        password,
      });
      setToken(data.token);
      set({ user: data.user, isAuthenticated: true, isLoading: false });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Registration failed";
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  logout: () => {
    setToken(null);
    set({ user: null, isAuthenticated: false, error: null });
  },

  fetchUser: async () => {
    const token = getToken();
    if (!token) {
      set({ user: null, isAuthenticated: false, isLoading: false });
      return;
    }
    set({ isLoading: true });
    try {
      const data = await apiGet<{ user: User }>("/auth/me");
      set({ user: { ...data.user, ...loadOverrides() }, isAuthenticated: true, isLoading: false });
    } catch {
      setToken(null);
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  updateUser: (data) => {
    saveOverrides(data);
    set((state) => ({
      user: state.user ? { ...state.user, ...data } : null,
    }));
  },

  clearError: () => set({ error: null }),
}));
