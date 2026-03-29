import { create } from "zustand";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning";
  read: boolean;
  createdAt: Date;
}

interface NotificationState {
  notifications: AppNotification[];
  hydrate: () => void;
  addNotification: (n: Omit<AppNotification, "id" | "read" | "createdAt">) => void;
  markAllRead: () => void;
  clearAll: () => void;
  unreadCount: () => number;
  reset: () => void;
}

const NOTIFICATIONS_KEY = "paypath_notifications";
const PUSH_NOTIFICATIONS_KEY = "paypath_push_notifications";
const MAX_NOTIFICATIONS = 50;

function saveNotifications(notifications: AppNotification[]) {
  if (typeof window === "undefined") return;

  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
}

function loadNotifications(): AppNotification[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(NOTIFICATIONS_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored) as Array<Omit<AppNotification, "createdAt"> & { createdAt: string }>;
    return parsed.map((notification) => ({
      ...notification,
      createdAt: new Date(notification.createdAt),
    }));
  } catch {
    return [];
  }
}

function isPushNotificationsEnabled() {
  if (typeof window === "undefined") return true;

  const stored = localStorage.getItem(PUSH_NOTIFICATIONS_KEY);
  return stored === null ? true : stored === "true";
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],

  hydrate: () => {
    set({ notifications: loadNotifications() });
  },

  addNotification: (n) => {
    if (!isPushNotificationsEnabled()) return;

    set((state) => {
      const notifications = [
        { ...n, id: crypto.randomUUID(), read: false, createdAt: new Date() },
        ...state.notifications,
      ].slice(0, MAX_NOTIFICATIONS);
      saveNotifications(notifications);
      return { notifications };
    });
  },

  markAllRead: () =>
    set((state) => {
      const notifications = state.notifications.map((n) => ({ ...n, read: true }));
      saveNotifications(notifications);
      return { notifications };
    }),

  clearAll: () => {
    saveNotifications([]);
    set({ notifications: [] });
  },

  unreadCount: () => get().notifications.filter((n) => !n.read).length,

  reset: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(NOTIFICATIONS_KEY);
    }
    set({ notifications: [] });
  },
}));
