import { create } from "zustand";
import { apiPost, apiGet } from "@/lib/api";

export interface ChatMessage {
  id: string;
  role: "user" | "ai";
  content: string;
}

interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  insights: string[];
  sendMessage: (text: string) => Promise<void>;
  fetchInsights: () => Promise<void>;
  reset: () => void;
}

let chatAbortController: AbortController | null = null;

export const useChatStore = create<ChatState>((set) => ({
  messages: [
    {
      id: "welcome",
      role: "ai",
      content:
        "Hi! I'm your personal financial coach. Ask me anything about budgeting, saving, or investing. I'll analyze your spending patterns and help you make smarter money decisions.",
    },
  ],
  isLoading: false,
  insights: [],

  sendMessage: async (text) => {
    chatAbortController?.abort();
    chatAbortController = new AbortController();
    const signal = chatAbortController.signal;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
    };
    set((state) => ({
      messages: [...state.messages, userMsg],
      isLoading: true,
    }));

    try {
      const data = await apiPost<{ response: string }>("/ai/chat", { message: text }, { signal });
      if (signal.aborted) return;
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "ai",
        content: data.response,
      };
      set((state) => ({
        messages: [...state.messages, aiMsg],
        isLoading: false,
      }));
    } catch {
      if (signal.aborted) return;
      const errorMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        role: "ai",
        content: "Sorry, I couldn't process that. Please try again.",
      };
      set((state) => ({
        messages: [...state.messages, errorMsg],
        isLoading: false,
      }));
    }
  },

  fetchInsights: async () => {
    const data = await apiGet<{ insights: string[] }>("/ai/insights");
    set({ insights: data.insights });
  },

  reset: () =>
    set({
      messages: [
        {
          id: "welcome",
          role: "ai",
          content:
            "Hi! I'm your personal financial coach. Ask me anything about budgeting, saving, or investing. I'll analyze your spending patterns and help you make smarter money decisions.",
        },
      ],
      isLoading: false,
      insights: [],
    }),
}));
