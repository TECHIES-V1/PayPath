import { create } from "zustand";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";

interface ApiGoal {
  id: string;
  name: string;
  targetAmount: number | string;
  currentAmount: number | string;
  deadline: string;
  progress?: number;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  progress?: number;
}

interface GoalState {
  goals: Goal[];
  isLoading: boolean;
  error: string | null;
  fetchGoals: () => Promise<void>;
  addGoal: (data: Omit<Goal, "id" | "currentAmount">) => Promise<void>;
  updateGoal: (id: string, data: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  addFunds: (id: string, amount: number) => Promise<void>;
}

export const useGoalStore = create<GoalState>((set) => ({
  goals: [],
  isLoading: false,
  error: null,

  fetchGoals: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await apiGet<{ goals: ApiGoal[] }>("/goals");
      const goals: Goal[] = data.goals.map((g) => ({
        id: g.id,
        name: g.name,
        targetAmount: Number(g.targetAmount),
        currentAmount: Number(g.currentAmount),
        deadline: g.deadline?.split("T")[0] || g.deadline,
        progress: g.progress || 0,
      }));
      set({ goals, isLoading: false });
    } catch (e: any) {
      set({ isLoading: false, error: e?.message || "Failed to load goals" });
    }
  },

  addGoal: async (data) => {
    try {
      const res = await apiPost<{ goal: ApiGoal }>("/goals", {
        name: data.name,
        targetAmount: data.targetAmount,
        deadline: new Date(data.deadline).toISOString(),
      });
      const goal: Goal = {
        id: res.goal.id,
        name: res.goal.name,
        targetAmount: Number(res.goal.targetAmount),
        currentAmount: Number(res.goal.currentAmount),
        deadline: res.goal.deadline?.split("T")[0] || res.goal.deadline,
        progress: 0,
      };
      set((state) => ({ goals: [...state.goals, goal] }));
    } catch (error) {
      throw error;
    }
  },

  updateGoal: async (id, data) => {
    try {
      const payload = {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.targetAmount !== undefined && { targetAmount: data.targetAmount }),
        ...(data.deadline !== undefined && { deadline: new Date(data.deadline).toISOString() }),
      };

      const res = await apiPut<{ goal: ApiGoal }>(`/goals/${id}`, payload);
      const goal: Goal = {
        id: res.goal.id,
        name: res.goal.name,
        targetAmount: Number(res.goal.targetAmount),
        currentAmount: Number(res.goal.currentAmount),
        deadline: res.goal.deadline?.split("T")[0] || res.goal.deadline,
        progress: res.goal.progress || 0,
      };

      set((state) => ({
        goals: state.goals.map((g) => (g.id === id ? goal : g)),
      }));
    } catch (error) {
      throw error;
    }
  },

  deleteGoal: async (id) => {
    await apiDelete(`/goals/${id}`);
    set((state) => ({
      goals: state.goals.filter((g) => g.id !== id),
    }));
  },

  addFunds: async (id, amount) => {
  const res = await apiPost<{ goal: ApiGoal }>(`/goals/${id}/contribute`, { amount });
    set((state) => {
      const updated = state.goals.map((g) =>
        g.id === id
          ? { ...g, currentAmount: Number(res.goal.currentAmount), progress: res.goal.progress || 0 }
          : g
      );
      // Notify if goal completed
      const goal = updated.find((g) => g.id === id);
      if (goal && goal.currentAmount >= goal.targetAmount) {
        import("@/store/notificationStore").then((m) =>
          m.useNotificationStore.getState().addNotification({
            title: "Goal reached! 🎉",
            message: `You've completed your "${goal.name}" goal`,
            type: "success",
          })
        );
      }
      return { goals: updated };
    });
  },
}));
