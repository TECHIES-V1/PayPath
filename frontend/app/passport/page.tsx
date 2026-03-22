"use client";

import { motion } from "motion/react";
import AppShell from "@/components/layout/AppShell";
import Header from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  LockIcon,
  Award01Icon,
  Target01Icon,
  AiChat01Icon,
  CreditCardIcon,
  DollarCircleIcon,
} from "@hugeicons/core-free-icons";

const badges = [
  { name: "Saver", icon: DollarCircleIcon },
  { name: "Budgeter", icon: CreditCardIcon },
  { name: "Investor", icon: Award01Icon },
];

const checklist = [
  { label: "Set a savings goal", done: false },
  { label: "Log 10 transactions", done: false },
  { label: "Chat with AI Coach", done: false },
  { label: "Maintain a budget for 30 days", done: false },
  { label: "Reach your first goal", done: false },
];

export default function PassportPage() {
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
                strokeDasharray={2 * Math.PI * 78}
                initial={{ strokeDashoffset: 2 * Math.PI * 78 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 78 * 0.85 }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-display font-bold">---</span>
              <span className="text-xs text-muted-foreground mt-1">Health Score</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4">Complete tasks to unlock your score</p>
        </motion.div>

        {/* Badge slots */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex justify-center gap-6"
        >
          {badges.map((badge) => (
            <div key={badge.name} className="flex flex-col items-center gap-2">
              <div className="size-16 rounded-2xl bg-muted/50 dark:bg-white/[0.04] flex items-center justify-center relative">
                <HugeiconsIcon icon={badge.icon} className="size-7 text-muted-foreground/40" />
                <div className="absolute -bottom-1 -right-1 size-5 rounded-full bg-muted dark:bg-white/[0.08] flex items-center justify-center">
                  <HugeiconsIcon icon={LockIcon} className="size-2.5 text-muted-foreground/50" />
                </div>
              </div>
              <span className="text-xs text-muted-foreground font-medium">{badge.name}</span>
            </div>
          ))}
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
                  <div className={`size-5 rounded-full border-2 shrink-0 ${
                    item.done
                      ? "bg-primary border-primary"
                      : "border-muted-foreground/30"
                  }`} />
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
