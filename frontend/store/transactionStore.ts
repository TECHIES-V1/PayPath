import { create } from "zustand";
import { apiGet, apiPost, apiDelete } from "@/lib/api";

interface ApiTransaction {
  id: string;
  category: string;
  amount: number | string;
  type: "income" | "expense";
  date: string;
  notes?: string | null;
}

export interface Transaction {
  id: string;
  category: string;
  amount: number;
  type: "income" | "expense";
  date: string;
  notes?: string;
}

interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  filter: "all" | "income" | "expense";
  setFilter: (filter: "all" | "income" | "expense") => void;
  fetchTransactions: () => Promise<void>;
  addTransaction: (data: Omit<Transaction, "id">) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  getFiltered: () => Transaction[];
  getTotals: () => { balance: number; income: number; expense: number };
  reset: () => void;
}

const notifiedTransactionIds = new Set<string>();

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  isLoading: false,
  error: null,
  filter: "all",

  setFilter: (filter) => set({ filter }),

  fetchTransactions: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await apiGet<{ transactions: ApiTransaction[]; total: number }>("/transactions?limit=100");
      const transactions: Transaction[] = data.transactions.map((t) => ({
        id: t.id,
        category: t.category,
        amount: Number(t.amount),
        type: t.type as "income" | "expense",
        date: t.date?.split("T")[0] || t.date,
        notes: t.notes ?? undefined,
      }));
      set({ transactions, isLoading: false });

      // Fire notifications for large expenses (>50k) — only for new ones
      const newLargeExpenses = transactions.filter(
        (t) => t.type === "expense" && t.amount >= 50000 && !notifiedTransactionIds.has(t.id)
      );
      if (newLargeExpenses.length > 0) {
        const { addNotification } = await import("@/store/notificationStore").then((m) => m.useNotificationStore.getState());
        newLargeExpenses.slice(0, 3).forEach((t) => {
          notifiedTransactionIds.add(t.id);
          addNotification({
            title: "Large expense detected",
            message: `₦${t.amount.toLocaleString()} on ${t.category}`,
            type: "warning",
          });
        });
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to load transactions";
      set({ isLoading: false, error: message });
    }
  },

  addTransaction: async (data) => {
    const res = await apiPost<{ transaction: ApiTransaction }>("/transactions", {
      amount: data.amount,
      type: data.type,
      category: data.category,
      date: data.date ? new Date(data.date).toISOString() : undefined,
      notes: data.notes,
    });
    const tx: Transaction = {
      id: res.transaction.id,
      category: res.transaction.category,
      amount: Number(res.transaction.amount),
      type: res.transaction.type as "income" | "expense",
      date: res.transaction.date?.split("T")[0] || res.transaction.date,
      notes: res.transaction.notes ?? undefined,
    };
    set((state) => ({ transactions: [tx, ...state.transactions] }));

    const { addNotification } = await import("@/store/notificationStore").then((m) => m.useNotificationStore.getState());

    if (tx.type === "expense" && tx.amount >= 50000) {
      addNotification({
        title: "Large expense detected",
        message: `₦${tx.amount.toLocaleString()} on ${tx.category}`,
        type: "warning",
      });
    }

    if (tx.type === "income") {
      addNotification({
        title: "Income recorded",
        message: `+₦${tx.amount.toLocaleString()} from ${tx.category}`,
        type: "success",
      });
    }
  },

  deleteTransaction: async (id) => {
    try {
      await apiDelete(`/transactions/${id}`);
      set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id),
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete transaction";
      set({ error: message });
      throw error;
    }
  },

  getFiltered: () => {
    const { transactions, filter } = get();
    if (filter === "all") return transactions;
    return transactions.filter((t) => t.type === filter);
  },

  getTotals: () => {
    const { transactions } = get();
    const income = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expense = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    return { balance: income - expense, income, expense };
  },

  reset: () => {
    notifiedTransactionIds.clear();
    set({ transactions: [], isLoading: false, error: null, filter: "all" });
  },
}));
