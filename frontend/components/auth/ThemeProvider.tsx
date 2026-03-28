"use client";

import { useEffect } from "react";
import { Toaster } from "sonner";
import { useThemeStore } from "@/store/themeStore";
import { useNotificationStore } from "@/store/notificationStore";

export function ThemeProvider() {
  const initTheme = useThemeStore((s) => s.initTheme);
  const hydrateNotifications = useNotificationStore((s) => s.hydrate);

  useEffect(() => {
    initTheme();
    hydrateNotifications();
  }, [hydrateNotifications, initTheme]);

  return (
    <Toaster
      position="top-right"
      theme="dark"
      richColors
      toastOptions={{
        className: "font-body",
        style: { borderRadius: "1rem" },
      }}
    />
  );
}
