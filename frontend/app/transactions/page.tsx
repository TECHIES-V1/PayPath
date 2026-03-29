"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Activity01Icon,
  Add01Icon,
  Briefcase01Icon,
  Bus01Icon,
  CreditCardIcon,
  Invoice01Icon,
  MoneyReceive01Icon,
  Restaurant01Icon,
  ShoppingBag01Icon,
} from "@hugeicons/core-free-icons";
import AppShell from "@/components/layout/AppShell";
import Header from "@/components/layout/Header";
import AddTransactionDialog from "@/components/transactions/AddTransactionDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTransactionStore, type Transaction } from "@/store/transactionStore";

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
  const { filter, setFilter, getFiltered, fetchTransactions, isLoading, error } = useTransactionStore();
  const transactions = getFiltered();
  const [addOpen, setAddOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const filters = ["all", "income", "expense"] as const;

  return (
    <AppShell>
      <Header title="Transactions" />
      <div className="space-y-5 px-2 py-4 md:p-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between md:hidden">
            <h2 className="text-lg font-display font-bold">Transactions</h2>
            <Button size="sm" onClick={() => setAddOpen(true)}>
              <HugeiconsIcon icon={Add01Icon} className="size-3.5" />
              Add
            </Button>
          </div>
          <div className="hidden items-center justify-end md:flex">
            <Button size="sm" onClick={() => setAddOpen(true)}>
              <HugeiconsIcon icon={Add01Icon} className="size-3.5" />
              Add
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {filters.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold capitalize transition-colors ${filter === value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  }`}
              >
                {value}
              </button>
            ))}
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
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center gap-3 py-2.5">
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
              <div className="flex size-28 items-center justify-center rounded-[2rem] bg-primary/10">
                <HugeiconsIcon icon={CreditCardIcon} className="size-12 text-primary" />
              </div>
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-3 -right-3 size-10 rotate-12 rounded-xl bg-primary/15"
              />
            </div>
            <h3 className="mb-2 font-display md:text-xl text-[1rem] font-bold">No transactions yet</h3>
            <p className="mb-6 max-w-xs md:text-sm text-xs leading-relaxed text-muted-foreground">
              Start logging your income and expenses to track your financial progress.
            </p>
            <Button size="lg" className="rounded-xl text-xs" onClick={() => setAddOpen(true)}>
              <HugeiconsIcon icon={Add01Icon} className="size-4" />
              Log Your First Transaction
            </Button>
          </motion.div>
        ) : (
          <Card>
            <CardContent className="space-y-1">
              {transactions.map((tx, index) => {
                const config = categoryConfig[tx.category] || defaultConfig;

                return (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                    className="group -mx-2 flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-muted/50"
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedTransaction(tx)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelectedTransaction(tx);
                      }
                    }}
                  >
                    <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${config.bg}`}>
                      <HugeiconsIcon icon={config.icon} className={`size-[18px] ${config.color}`} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">{tx.category}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(tx.date)}</p>
                    </div>

                    <span
                      className={`text-xs font-display font-bold tabular-nums ${tx.type === "income" ? "text-primary" : "text-destructive"
                        }`}
                    >
                      {tx.type === "income" ? "+" : "-"}
                      {formatCurrency(tx.amount)}
                    </span>
                  </motion.div>
                );
              })}
            </CardContent>
          </Card>
        )}
      </div>

      <AddTransactionDialog open={addOpen} onOpenChange={setAddOpen} />
      <TransactionDetailsDialog
        transaction={selectedTransaction}
        open={selectedTransaction !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedTransaction(null);
        }}
      />
    </AppShell>
  );
}

function TransactionDetailsDialog({
  transaction,
  open,
  onOpenChange,
}: {
  transaction: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!transaction) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl p-6 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-lg font-bold">Transaction details</DialogTitle>
          <DialogDescription>View the full details for this transaction.</DialogDescription>
        </DialogHeader>

        <div className="space-y-0 py-2">
          <DetailRow label="Category" value={transaction.category} separated />
          <DetailRow
            label="Amount"
            value={`${transaction.type === "income" ? "+" : "-"}${formatCurrency(transaction.amount)}`}
            valueClassName={transaction.type === "income" ? "text-primary" : "text-foreground"}
            separated
          />
          <DetailRow
            label="Date"
            value={new Date(transaction.date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
            separated
          />
          {transaction.notes && <DetailRow label="Description" value={transaction.notes} multiline separated />}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DetailRow({
  label,
  value,
  valueClassName,
  multiline = false,
  separated = false,
}: {
  label: string;
  value: string;
  valueClassName?: string;
  multiline?: boolean;
  separated?: boolean;
}) {
  return (
    <div className={`space-y-1 ${separated ? "border-t border-dotted border-border/80 py-3 first:border-t-0 first:pt-0 last:pb-0" : ""}`}>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={`text-sm ${multiline ? "leading-relaxed" : "font-medium"} ${valueClassName ?? ""}`}>{value}</p>
    </div>
  );
}
