"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Restaurant01Icon,
  MoneyReceive01Icon,
  Bus01Icon,
  Briefcase01Icon,
  Invoice01Icon,
  ArrowUpRight01Icon,
} from "@hugeicons/core-free-icons";

const categoryConfig: Record<string, { icon: typeof Restaurant01Icon; color: string; bg: string }> = {
  Food: { icon: Restaurant01Icon, color: "text-orange-400", bg: "bg-orange-400/10" },
  Salary: { icon: MoneyReceive01Icon, color: "text-primary", bg: "bg-primary/10" },
  Transport: { icon: Bus01Icon, color: "text-blue-400", bg: "bg-blue-400/10" },
  Freelance: { icon: Briefcase01Icon, color: "text-purple-400", bg: "bg-purple-400/10" },
  Bills: { icon: Invoice01Icon, color: "text-red-400", bg: "bg-red-400/10" },
};

const mockTransactions = [
  { id: "1", category: "Food", amount: -4500, type: "expense", date: "Today" },
  { id: "2", category: "Salary", amount: 250000, type: "income", date: "Yesterday" },
  { id: "3", category: "Transport", amount: -2000, type: "expense", date: "Yesterday" },
  { id: "4", category: "Freelance", amount: 35000, type: "income", date: "Mar 20" },
  { id: "5", category: "Bills", amount: -15000, type: "expense", date: "Mar 19" },
];

function formatCurrency(amount: number) {
  const abs = Math.abs(amount);
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(abs);
}

export default function RecentTransactions() {
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
        {mockTransactions.map((tx) => {
          const config = categoryConfig[tx.category] || categoryConfig.Food;
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
                <p className="text-xs text-muted-foreground">{tx.date}</p>
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
        })}
      </CardContent>
    </Card>
  );
}
