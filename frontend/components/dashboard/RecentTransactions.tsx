"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import { useTransactionStore } from "@/store/transactionStore";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Restaurant01Icon,
  MoneyReceive01Icon,
  Bus01Icon,
  Briefcase01Icon,
  Invoice01Icon,
  ShoppingBag01Icon,
  Activity01Icon,
  CreditCardIcon,
  ArrowUpRight01Icon,
} from "@hugeicons/core-free-icons";

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

export default function RecentTransactions() {
  const transactions = useTransactionStore((s) => s.transactions).slice(0, 5);
  const isLoading = useTransactionStore((s) => s.isLoading);
  const error = useTransactionStore((s) => s.error);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardAction>
          <Link
            href="/transactions"
            className="size-8 rounded-xl bg-primary flex items-center justify-center hover:bg-primary/85 transition-colors"
          >
            <HugeiconsIcon icon={ArrowUpRight01Icon} className="size-4 text-primary-foreground" />
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-1">
        {error ? (
          <p className="text-sm text-destructive text-center py-6">{error}</p>
        ) : isLoading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-2.5">
              <div className="size-10 rounded-xl skeleton" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 w-20 rounded skeleton" />
                <div className="h-3 w-14 rounded skeleton" />
              </div>
              <div className="h-4 w-16 rounded skeleton" />
            </div>
          ))
        ) : transactions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">No transactions yet</p>
        ) : (
          transactions.map((tx) => {
            const config = categoryConfig[tx.category] || defaultConfig;
            return (
              <div
                key={tx.id}
                className="flex items-center gap-3 py-2.5 px-2 -mx-2 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className={`size-10 rounded-xl ${config.bg} flex items-center justify-center shrink-0`}>
                  <HugeiconsIcon icon={config.icon} className={`size-[18px] ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{tx.category}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(tx.date)}</p>
                </div>
                <span
                  className={`text-sm font-display font-bold tabular-nums ${
                    tx.type === "income" ? "text-primary" : "text-foreground"
                  }`}
                >
                  {tx.type === "income" ? "+" : "-"}
                  {formatCurrency(tx.amount)}
                </span>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
