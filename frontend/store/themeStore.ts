import { create } from "zustand";

type Theme = "dark" | "light" | "system";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  initTheme: () => void;
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "system") {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.classList.toggle("dark", prefersDark);
  } else {
    root.classList.toggle("dark", theme === "dark");
  }
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: "dark",
  setTheme: (theme) => {
    localStorage.setItem("paypath_theme", theme);
    applyTheme(theme);
    set({ theme });
  },
  initTheme: () => {
    const stored = localStorage.getItem("paypath_theme") as Theme | null;
    const theme = stored || "dark";
    applyTheme(theme);
    set({ theme });
  },
}));
