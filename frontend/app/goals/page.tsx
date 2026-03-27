"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import AppShell from "@/components/layout/AppShell";
import Header from "@/components/layout/Header";
import AddGoalDialog from "@/components/goals/AddGoalDialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useGoalStore, type Goal } from "@/store/goalStore";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Target01Icon,
  Add01Icon,
  Delete01Icon,
  DollarCircleIcon,
} from "@hugeicons/core-free-icons";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
}

function daysUntil(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days > 0 ? `${days} days left` : "Overdue";
}

export default function GoalsPage() {
  const { goals, addFunds, deleteGoal, fetchGoals, isLoading, error } = useGoalStore();
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const handleAddFunds = async (goal: Goal) => {
    const amount = Math.round(goal.targetAmount * 0.1);
    try {
      await addFunds(goal.id, amount);
      toast.success(`Added ${formatCurrency(amount)} to ${goal.name}`);
    } catch {
      toast.error("Failed to add funds");
    }
  };

  const handleDelete = async (goal: Goal) => {
    try {
      await deleteGoal(goal.id);
      toast.success("Goal deleted");
    } catch {
      toast.error("Failed to delete goal");
    }
  };

  return (
    <AppShell>
      <Header title="Savings Goals" />
      <div className="p-4 md:p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-display font-bold">Your Goals</h2>
            <p className="text-sm text-muted-foreground">{goals.length} active goal{goals.length !== 1 ? "s" : ""}</p>
          </div>
          <Button size="sm" onClick={() => setAddOpen(true)}>
            <HugeiconsIcon icon={Add01Icon} className="size-3.5" />
            New Goal
          </Button>
        </div>

        {error && (
          <div className="rounded-2xl bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => fetchGoals()} className="text-xs underline ml-4 shrink-0">Retry</button>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-3 py-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-card p-5 space-y-3 shadow-card dark:shadow-none dark:border dark:border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl skeleton" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 w-32 rounded skeleton" />
                    <div className="h-3 w-20 rounded skeleton" />
                  </div>
                </div>
                <div className="h-3 rounded-full skeleton" />
                <div className="h-3 w-40 rounded skeleton" />
              </div>
            ))}
          </div>
        ) : goals.length === 0 ? (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="relative mb-8">
              <motion.div
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="size-28 rounded-full border-[3px] border-primary/20 flex items-center justify-center"
              >
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.15 }}
                  className="size-20 rounded-full border-[3px] border-primary/30 flex items-center justify-center"
                >
                  <div className="size-10 rounded-full bg-primary flex items-center justify-center">
                    <HugeiconsIcon icon={Target01Icon} className="size-5 text-primary-foreground" />
                  </div>
                </motion.div>
              </motion.div>
            </div>
            <h3 className="text-xl font-display font-bold mb-2">Set your first goal</h3>
            <p className="text-sm text-muted-foreground max-w-xs mb-6 leading-relaxed">
              Track progress toward the things that matter most to you.
            </p>
            <Button size="lg" className="rounded-xl" onClick={() => setAddOpen(true)}>
              <HugeiconsIcon icon={Add01Icon} className="size-4" />
              Create a Goal
            </Button>
          </motion.div>
        ) : (
          /* Goal cards */
          <div className="space-y-3">
            {goals.map((goal, i) => {
              const percentage = Math.round((goal.currentAmount / goal.targetAmount) * 100);
              const isComplete = percentage >= 100;

              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <Card>
                    <CardContent className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <HugeiconsIcon icon={Target01Icon} className="size-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-display font-bold text-sm truncate">{goal.name}</h3>
                            <span className="text-xs font-display font-bold text-primary ml-2">{percentage}%</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{daysUntil(goal.deadline)}</p>
                        </div>
                      </div>

                      <Progress value={percentage} className="h-3 rounded-full" />

                      <div className="flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">
                          <span className="font-semibold text-foreground">{formatCurrency(goal.currentAmount)}</span>
                          {" "}of {formatCurrency(goal.targetAmount)}
                        </div>
                        <div className="flex gap-2">
                          {!isComplete && (
                            <Button
                              size="xs"
                              variant="outline"
                              onClick={() => handleAddFunds(goal)}
                            >
                              <HugeiconsIcon icon={DollarCircleIcon} className="size-3" />
                              Add funds
                            </Button>
                          )}
                          <Button
                            size="xs"
                            variant="ghost"
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => handleDelete(goal)}
                          >
                            <HugeiconsIcon icon={Delete01Icon} className="size-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}

            {/* Add new goal */}
            <button
              onClick={() => setAddOpen(true)}
              className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-primary/20 hover:border-primary/40 hover:bg-primary/5 text-primary rounded-2xl py-4 text-sm font-medium transition-all"
            >
              <HugeiconsIcon icon={Add01Icon} className="size-4" />
              New Goal
            </button>
          </div>
        )}
      </div>

      <AddGoalDialog open={addOpen} onOpenChange={setAddOpen} />
    </AppShell>
  );
}
