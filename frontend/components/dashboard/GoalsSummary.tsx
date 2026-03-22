"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useGoalStore } from "@/store/goalStore";
import AddGoalDialog from "@/components/goals/AddGoalDialog";
import { HugeiconsIcon } from "@hugeicons/react";
import { Target01Icon, Add01Icon, ArrowUpRight01Icon } from "@hugeicons/core-free-icons";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function GoalsSummary() {
  const goals = useGoalStore((s) => s.goals).slice(0, 2);
  const [addOpen, setAddOpen] = useState(false);

  return (
    <>
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
          {goals.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No goals yet</p>
          ) : (
            goals.map((goal) => {
              const percentage = Math.round((goal.currentAmount / goal.targetAmount) * 100);
              return (
                <div key={goal.id} className="bg-muted/30 dark:bg-white/[0.04] rounded-xl p-3.5 space-y-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <HugeiconsIcon icon={Target01Icon} className="size-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{goal.name}</p>
                    </div>
                    <span className="text-xs font-display font-bold text-primary">{percentage}%</span>
                  </div>
                  <Progress value={percentage} className="h-2.5 rounded-full" />
                  <div className="flex justify-between text-[11px] text-muted-foreground">
                    <span>{formatCurrency(goal.currentAmount)}</span>
                    <span>{formatCurrency(goal.targetAmount)}</span>
                  </div>
                </div>
              );
            })
          )}

          <button
            onClick={() => setAddOpen(true)}
            className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-primary/20 hover:border-primary/40 hover:bg-primary/5 text-primary rounded-xl py-3 text-sm font-medium transition-all"
          >
            <HugeiconsIcon icon={Add01Icon} className="size-4" />
            New Goal
          </button>
        </CardContent>
      </Card>

      <AddGoalDialog open={addOpen} onOpenChange={setAddOpen} />
    </>
  );
}
