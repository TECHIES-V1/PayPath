import { create } from "zustand";

export interface Transaction {
  id: string;
  category: string;
  amount: number;
  type: "income" | "expense";
  date: string;
  note?: string;
}

interface TransactionState {
  transactions: Transaction[];
  filter: "all" | "income" | "expense";
  setFilter: (filter: "all" | "income" | "expense") => void;
  addTransaction: (data: Omit<Transaction, "id">) => void;
  deleteTransaction: (id: string) => void;
  getFiltered: () => Transaction[];
  getTotals: () => { balance: number; income: number; expense: number };
}

const mockTransactions: Transaction[] = [
  { id: "1", category: "Food", amount: 4500, type: "expense", date: "2026-03-22" },
  { id: "2", category: "Salary", amount: 250000, type: "income", date: "2026-03-21" },
  { id: "3", category: "Transport", amount: 2000, type: "expense", date: "2026-03-21" },
  { id: "4", category: "Freelance", amount: 35000, type: "income", date: "2026-03-20" },
  { id: "5", category: "Bills", amount: 15000, type: "expense", date: "2026-03-19" },
  { id: "6", category: "Salary", amount: 95000, type: "income", date: "2026-03-15" },
  { id: "7", category: "Shopping", amount: 12000, type: "expense", date: "2026-03-14" },
  { id: "8", category: "Entertainment", amount: 5500, type: "expense", date: "2026-03-12" },
];

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: mockTransactions,
  filter: "all",

  setFilter: (filter) => set({ filter }),

  addTransaction: (data) => {
    const id = Date.now().toString();
    set((state) => ({
      transactions: [{ ...data, id }, ...state.transactions],
    }));
  },

  deleteTransaction: (id) => {
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    }));
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
}));
