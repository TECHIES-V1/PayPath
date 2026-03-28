import { create } from "zustand";

interface ThemeState {
  theme: "dark";
  initTheme: () => void;
}

function applyTheme() {
  const root = document.documentElement;
  root.classList.add("dark");
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: "dark",
  initTheme: () => {
    applyTheme();
    set({ theme: "dark" });
  },
}));
