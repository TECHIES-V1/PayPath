"use client";

import { useEffect } from "react";
import { Toaster } from "sonner";
import { useThemeStore } from "@/store/themeStore";

export function ThemeProvider() {
  const initTheme = useThemeStore((s) => s.initTheme);

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  const theme = useThemeStore((s) => s.theme);

  return (
    <Toaster
      position="top-right"
      theme={theme}
      richColors
      toastOptions={{
        className: "font-body",
        style: { borderRadius: "1rem" },
      }}
    />
  );
}
