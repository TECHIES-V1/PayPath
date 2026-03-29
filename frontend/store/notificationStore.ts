import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning";
  amount?: number;
  read: boolean;
  createdAt: Date;
}

interface NotificationState {
  notifications: AppNotification[];
  addNotification: (n: Omit<AppNotification, "read" | "createdAt">) => void;
  markAllRead: () => void;
  clearAll: () => void;
  unreadCount: () => number;
  reset: () => void;
}

const PUSH_NOTIFICATIONS_KEY = "paypath_push_notifications";
const MAX_NOTIFICATIONS = 50;

function isPushNotificationsEnabled() {
  if (typeof window === "undefined") return true;

  const stored = localStorage.getItem(PUSH_NOTIFICATIONS_KEY);
  return stored === null ? true : stored === "true";
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],

      addNotification: (n) => {
        if (!isPushNotificationsEnabled()) return;

        set((state) => {
          if (state.notifications.some((notification) => notification.id === n.id)) {
            return state;
          }

          return {
            notifications: [
              { ...n, read: false, createdAt: new Date() },
              ...state.notifications,
            ].slice(0, MAX_NOTIFICATIONS),
          };
        });
      },

      markAllRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),

      clearAll: () => set({ notifications: [] }),

      unreadCount: () => get().notifications.filter((n) => !n.read).length,

      reset: () => set({ notifications: [] }),
    }),
    {
      name: "paypath_notifications",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ notifications: state.notifications }),
      merge: (persistedState, currentState) => {
        const persistedNotifications = (persistedState as Partial<NotificationState> | undefined)?.notifications ?? [];

        return {
          ...currentState,
          notifications: persistedNotifications.map((notification) => ({
            ...notification,
            createdAt: new Date(notification.createdAt),
          })),
        };
      },
    }
  )
);
