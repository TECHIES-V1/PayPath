"use client";

import { useMemo } from "react";
import type { TooltipContentProps } from "recharts";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTransactionStore } from "@/store/transactionStore";

function formatShort(amount: number) {
  if (amount >= 1_000_000) return `₦${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `₦${(amount / 1_000).toFixed(0)}K`;
  return `₦${amount}`;
}

function CustomTooltip({ active, payload, label }: TooltipContentProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name === "income" ? "Income" : "Expenses"}: {formatShort(Number(p.value ?? 0))}
        </p>
      ))}
    </div>
  );
}

export default function SpendingChart() {
  const transactions = useTransactionStore((s) => s.transactions);
  const isLoading = useTransactionStore((s) => s.isLoading);

  const data = useMemo(() => {
    // Build last 6 months buckets
    const months: { label: string; key: string; income: number; expense: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setDate(1);
      d.setMonth(d.getMonth() - i);
      months.push({
        label: d.toLocaleDateString("en-US", { month: "short" }),
        key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
        income: 0,
        expense: 0,
      });
    }

    for (const tx of transactions) {
      const key = tx.date.slice(0, 7); // "YYYY-MM"
      const bucket = months.find((m) => m.key === key);
      if (!bucket) continue;
      if (tx.type === "income") bucket.income += tx.amount;
      else bucket.expense += tx.amount;
    }

    return months;
  }, [transactions]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>6-Month Overview</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-48 rounded-xl skeleton" />
        ) : (
          <ResponsiveContainer width="100%" height={192}>
            <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f87171" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={formatShort} tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip content={CustomTooltip} />
              <Area type="monotone" dataKey="income" stroke="var(--color-primary)" strokeWidth={2} fill="url(#incomeGrad)" dot={false} />
              <Area type="monotone" dataKey="expense" stroke="#f87171" strokeWidth={2} fill="url(#expenseGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        )}
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="size-2.5 rounded-full bg-primary inline-block" />
            Income
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="size-2.5 rounded-full bg-red-400 inline-block" />
            Expenses
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
