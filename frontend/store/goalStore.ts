import { create } from "zustand";

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
}

interface GoalState {
  goals: Goal[];
  addGoal: (data: Omit<Goal, "id" | "currentAmount">) => void;
  updateGoal: (id: string, data: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  addFunds: (id: string, amount: number) => void;
}

const mockGoals: Goal[] = [
  { id: "1", name: "Emergency Fund", targetAmount: 500000, currentAmount: 245000, deadline: "2026-12-31" },
  { id: "2", name: "New Laptop", targetAmount: 350000, currentAmount: 120000, deadline: "2026-06-30" },
];

export const useGoalStore = create<GoalState>((set) => ({
  goals: mockGoals,

  addGoal: (data) => {
    const id = Date.now().toString();
    set((state) => ({
      goals: [...state.goals, { ...data, id, currentAmount: 0 }],
    }));
  },

  updateGoal: (id, data) => {
    set((state) => ({
      goals: state.goals.map((g) => (g.id === id ? { ...g, ...data } : g)),
    }));
  },

  deleteGoal: (id) => {
    set((state) => ({
      goals: state.goals.filter((g) => g.id !== id),
    }));
  },

  addFunds: (id, amount) => {
    set((state) => ({
      goals: state.goals.map((g) =>
        g.id === id
          ? { ...g, currentAmount: Math.min(g.currentAmount + amount, g.targetAmount) }
          : g
      ),
    }));
  },
}));
