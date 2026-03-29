import { create } from "zustand";
import { apiPost, apiGet, apiPut, setToken, getToken } from "@/lib/api";
import { useTransactionStore } from "@/store/transactionStore";
import { useGoalStore } from "@/store/goalStore";
import { useChatStore } from "@/store/chatStore";
import { useNotificationStore } from "@/store/notificationStore";

interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
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
  updateUser: (data: Pick<User, "name">) => Promise<void>;
  clearError: () => void;
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
      set({ user: data.user, isAuthenticated: true, isLoading: false });
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
    useTransactionStore.getState().reset();
    useGoalStore.getState().reset();
    useChatStore.getState().reset();
    useNotificationStore.getState().reset();
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
      set({ user: data.user, isAuthenticated: true, isLoading: false });
    } catch {
      // 401 is already handled by api.ts (clears token + redirects).
      // For other errors (network), keep the token but stop loading.
      set({ isLoading: false });
    }
  },

  updateUser: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await apiPut<{ user: User }>("/auth/profile", data);
      set({ user: res.user, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update profile";
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
