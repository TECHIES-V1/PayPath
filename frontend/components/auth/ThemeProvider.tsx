"use client";

import { useEffect } from "react";
import { Toaster } from "sonner";
import { useThemeStore } from "@/store/themeStore";

export function ThemeProvider() {
  const initTheme = useThemeStore((s) => s.initTheme);
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  const toasterTheme = theme === "system" ? "system" : theme;

  return (
    <Toaster
      position="top-right"
      theme={toasterTheme}
      richColors
      toastOptions={{
        className: "font-body",
        style: { borderRadius: "1rem" },
      }}
    />
  );
}
