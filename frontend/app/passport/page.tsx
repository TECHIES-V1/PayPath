"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import AppShell from "@/components/layout/AppShell";
import Header from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  LockIcon,
  Award01Icon,
  Target01Icon,
  CreditCardIcon,
  DollarCircleIcon,
  CheckmarkCircle01Icon,
} from "@hugeicons/core-free-icons";
import { apiGet } from "@/lib/api";

interface PassportData {
  score: number;
  tier: string;
  badges: string[];
  savingsStreak: number;
  budgetAdherence: number;
  incomeConsistency: number;
  hasCompletedGoal: boolean;
  completedGoalsCount: number;
  goalsCount: number;
  transactionCount: number;
  hasIncomeAndExpense: boolean;
}

interface BreakdownFactor {
  name: string;
  weight: number;
  value: number;
  description: string;
}

const badgeConfig = [
  { name: "Starter", icon: DollarCircleIcon },
  { name: "Builder", icon: CreditCardIcon },
  { name: "Stable", icon: Award01Icon },
  { name: "Trusted", icon: CheckmarkCircle01Icon },
];

const tierOrder = badgeConfig.map((badge) => badge.name);

export default function PassportPage() {
  const [passport, setPassport] = useState<PassportData | null>(null);
  const [factors, setFactors] = useState<BreakdownFactor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [passportRes, breakdownRes] = await Promise.all([
          apiGet<{ passport: PassportData }>("/passport"),
          apiGet<{ breakdown: { factors: BreakdownFactor[] } }>("/passport/breakdown"),
        ]);
        setPassport(passportRes.passport);
        setFactors(breakdownRes.breakdown.factors);
      } catch {
        // fail silently, show default state
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const score = passport?.score ?? 0;
  const tier = passport?.tier ?? "Starter";
  const earnedBadges = passport?.badges ?? [];
  const hasCompletedGoal = passport?.hasCompletedGoal ?? false;
  const goalsCount = passport?.goalsCount ?? 0;
  const transactionCount = passport?.transactionCount ?? 0;
  const hasIncomeAndExpense = passport?.hasIncomeAndExpense ?? false;
  const circumference = 2 * Math.PI * 78;
  const dashOffset = circumference * (1 - score / 100);

  const checklist = [
    { label: "Set a savings goal", done: goalsCount >= 1 },
    { label: "Log 10 transactions", done: transactionCount >= 10 },
    { label: "Add both income and expense", done: hasIncomeAndExpense },
    { label: "Maintain a budget for 30 days", done: earnedBadges.includes("Streak Master") },
    { label: "Reach your first goal", done: hasCompletedGoal },
  ];

  return (
    <AppShell>
      <Header title="Financial Passport" />
      <div className="p-4 md:p-6 space-y-5">
        {/* Score ring */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center py-8"
        >
          <div className="relative">
            <svg width="180" height="180" viewBox="0 0 180 180" className="transform -rotate-90">
              <circle
                cx="90"
                cy="90"
                r="78"
                fill="none"
                className="stroke-muted"
                strokeWidth="10"
              />
              <motion.circle
                cx="90"
                cy="90"
                r="78"
                fill="none"
                className="stroke-primary"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: isLoading ? circumference : dashOffset }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-display font-bold">
                {isLoading ? "..." : score}
              </span>
              <span className="text-xs text-muted-foreground mt-1">Health Score</span>
            </div>
          </div>
          <div className="mt-4 text-center">
            <span className="inline-block text-xs font-semibold text-primary bg-primary/10 rounded-full px-3 py-1">
              {tier}
            </span>
            {!isLoading && score === 0 && (
              <p className="text-sm text-muted-foreground mt-2">Log transactions to build your score</p>
            )}
          </div>
        </motion.div>

        {/* Score breakdown */}
        {factors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Score Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {factors.map((f) => (
                  <div key={f.name} className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{f.name} <span className="text-muted-foreground text-xs">({f.weight}%)</span></span>
                      <span className="font-display font-bold text-primary">{f.value}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${f.value}%` }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground">{f.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Badge slots */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex justify-center gap-6"
        >
          {badgeConfig.map((badge) => {
            const currentTierIndex = tierOrder.indexOf(tier);
            const badgeTierIndex = tierOrder.indexOf(badge.name);
            const isEarned = currentTierIndex >= badgeTierIndex;
            return (
              <div key={badge.name} className="flex flex-col items-center gap-2">
                <div className={`size-16 rounded-2xl flex items-center justify-center relative ${
                  isEarned
                    ? "bg-primary/15"
                    : "bg-muted/50 dark:bg-white/[0.04]"
                }`}>
                  <HugeiconsIcon
                    icon={badge.icon}
                    className={`size-7 ${isEarned ? "text-primary" : "text-muted-foreground/40"}`}
                  />
                  {!isEarned && (
                    <div className="absolute -bottom-1 -right-1 size-5 rounded-full bg-muted dark:bg-white/[0.08] flex items-center justify-center">
                      <HugeiconsIcon icon={LockIcon} className="size-2.5 text-muted-foreground/50" />
                    </div>
                  )}
                </div>
                <span className={`text-xs font-medium ${isEarned ? "text-primary" : "text-muted-foreground"}`}>
                  {badge.name}
                </span>
              </div>
            );
          })}
        </motion.div>

        {/* Checklist */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HugeiconsIcon icon={Target01Icon} className="size-4 text-primary" />
                Financial Health Checklist
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {checklist.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + i * 0.06 }}
                  className="flex items-center gap-3 py-2.5 px-2 -mx-2 rounded-xl hover:bg-muted/30 transition-colors"
                >
                  <div className={`size-5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                    item.done
                      ? "bg-primary border-primary"
                      : "border-muted-foreground/30"
                  }`}>
                    {item.done && (
                      <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-3 text-primary-foreground" />
                    )}
                  </div>
                  <span className={`text-sm ${item.done ? "line-through text-muted-foreground" : ""}`}>
                    {item.label}
                  </span>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppShell>
  );
}
