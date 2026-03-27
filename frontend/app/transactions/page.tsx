"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import AppShell from "@/components/layout/AppShell";
import Header from "@/components/layout/Header";
import AddTransactionDialog from "@/components/transactions/AddTransactionDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTransactionStore, type Transaction } from "@/store/transactionStore";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CreditCardIcon,
  Add01Icon,
  Restaurant01Icon,
  MoneyReceive01Icon,
  Bus01Icon,
  Briefcase01Icon,
  Invoice01Icon,
  ShoppingBag01Icon,
  Activity01Icon,
  Delete01Icon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";

const categoryConfig: Record<string, { icon: typeof Restaurant01Icon; color: string; bg: string }> = {
  Food: { icon: Restaurant01Icon, color: "text-orange-400", bg: "bg-orange-400/10" },
  Salary: { icon: MoneyReceive01Icon, color: "text-primary", bg: "bg-primary/10" },
  Transport: { icon: Bus01Icon, color: "text-blue-400", bg: "bg-blue-400/10" },
  Freelance: { icon: Briefcase01Icon, color: "text-purple-400", bg: "bg-purple-400/10" },
  Bills: { icon: Invoice01Icon, color: "text-red-400", bg: "bg-red-400/10" },
  Shopping: { icon: ShoppingBag01Icon, color: "text-pink-400", bg: "bg-pink-400/10" },
  Entertainment: { icon: Activity01Icon, color: "text-yellow-400", bg: "bg-yellow-400/10" },
};

const defaultConfig = { icon: CreditCardIcon, color: "text-muted-foreground", bg: "bg-muted" };

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function TransactionsPage() {
  const { filter, setFilter, getFiltered, deleteTransaction, fetchTransactions, isLoading, error } = useTransactionStore();
  const transactions = getFiltered();
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleDelete = async (tx: Transaction) => {
    try {
      await deleteTransaction(tx.id);
      toast.success("Transaction deleted");
    } catch {
      toast.error("Failed to delete transaction");
    }
  };

  const filters = ["all", "income", "expense"] as const;

  return (
    <AppShell>
      <Header title="Transactions" />
      <div className="p-4 md:p-6 space-y-5">
        {/* Filter tabs + add button */}
        <div className="flex items-center gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors capitalize ${
                filter === f
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}
            >
              {f}
            </button>
          ))}
          <div className="ml-auto">
            <Button size="sm" onClick={() => setAddOpen(true)}>
              <HugeiconsIcon icon={Add01Icon} className="size-3.5" />
              Add
            </Button>
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div className="rounded-2xl bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => fetchTransactions()} className="text-xs underline ml-4 shrink-0">Retry</button>
          </div>
        )}

        {/* Loading / Transaction list / Empty state */}
        {isLoading ? (
          <div className="space-y-3 py-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5">
                <div className="size-10 rounded-xl skeleton" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-24 rounded skeleton" />
                  <div className="h-3 w-16 rounded skeleton" />
                </div>
                <div className="h-4 w-20 rounded skeleton" />
              </div>
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="relative mb-8">
              <div className="size-28 rounded-[2rem] bg-primary/10 flex items-center justify-center">
                <HugeiconsIcon icon={CreditCardIcon} className="size-12 text-primary" />
              </div>
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-3 -right-3 size-10 rounded-xl bg-primary/15 rotate-12"
              />
            </div>
            <h3 className="text-xl font-display font-bold mb-2">No transactions yet</h3>
            <p className="text-sm text-muted-foreground max-w-xs mb-6 leading-relaxed">
              Start logging your income and expenses to track your financial progress.
            </p>
            <Button size="lg" className="rounded-xl" onClick={() => setAddOpen(true)}>
              <HugeiconsIcon icon={Add01Icon} className="size-4" />
              Log Your First Transaction
            </Button>
          </motion.div>
        ) : (
          <Card>
            <CardContent className="space-y-1">
              {transactions.map((tx, i) => {
                const config = categoryConfig[tx.category] || defaultConfig;
                return (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.03 }}
                    className="flex items-center gap-3 py-2.5 px-2 -mx-2 rounded-xl hover:bg-muted/50 transition-colors group"
                  >
                    <div className={`size-10 rounded-xl ${config.bg} flex items-center justify-center shrink-0`}>
                      <HugeiconsIcon icon={config.icon} className={`size-[18px] ${config.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold">{tx.category}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(tx.date)}
                        {tx.note && ` · ${tx.note}`}
                      </p>
                    </div>
                    <span
                      className={`text-sm font-display font-bold tabular-nums ${
                        tx.type === "income" ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {tx.type === "income" ? "+" : "-"}
                      {formatCurrency(tx.amount)}
                    </span>
                    <button
                      onClick={() => handleDelete(tx)}
                      className="opacity-0 group-hover:opacity-100 size-7 rounded-lg flex items-center justify-center hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
                    >
                      <HugeiconsIcon icon={Delete01Icon} className="size-3.5" />
                    </button>
                  </motion.div>
                );
              })}
            </CardContent>
          </Card>
        )}
      </div>

      <AddTransactionDialog open={addOpen} onOpenChange={setAddOpen} />
    </AppShell>
  );
}
