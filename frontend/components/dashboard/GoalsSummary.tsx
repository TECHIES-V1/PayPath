"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { HugeiconsIcon } from "@hugeicons/react";
import { Target01Icon, LaptopIcon, Add01Icon, ArrowUpRight01Icon } from "@hugeicons/core-free-icons";

const mockGoals = [
  { id: "1", name: "Emergency Fund", target: 500000, current: 245000, icon: Target01Icon },
  { id: "2", name: "New Laptop", target: 350000, current: 120000, icon: LaptopIcon },
];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function GoalsSummary() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Savings Goals</CardTitle>
        <CardAction>
          <Link
            href="/goals"
            className="size-8 rounded-xl bg-primary flex items-center justify-center hover:bg-primary/85 transition-colors"
          >
            <HugeiconsIcon icon={ArrowUpRight01Icon} className="size-4 text-primary-foreground" />
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-3">
        {mockGoals.map((goal) => {
          const percentage = Math.round((goal.current / goal.target) * 100);
          return (
            <div key={goal.id} className="bg-muted/30 dark:bg-white/[0.04] rounded-xl p-3.5 space-y-2.5">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <HugeiconsIcon icon={goal.icon} className="size-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{goal.name}</p>
                </div>
                <span className="text-xs font-display font-bold text-primary">{percentage}%</span>
              </div>
              <Progress value={percentage} className="h-2.5 rounded-full" />
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>{formatCurrency(goal.current)}</span>
                <span>{formatCurrency(goal.target)}</span>
              </div>
            </div>
          );
        })}

        {/* New goal button */}
        <Link
          href="/goals"
          className="flex items-center justify-center gap-2 border-2 border-dashed border-primary/20 hover:border-primary/40 hover:bg-primary/5 text-primary rounded-xl py-3 text-sm font-medium transition-all"
        >
          <HugeiconsIcon icon={Add01Icon} className="size-4" />
          New Goal
        </Link>
      </CardContent>
    </Card>
  );
}
