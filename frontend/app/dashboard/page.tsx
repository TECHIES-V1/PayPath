"use client";

import { useEffect } from "react";
import { motion } from "motion/react";
import AppShell from "@/components/layout/AppShell";
import Header from "@/components/layout/Header";
import BalanceCard from "@/components/dashboard/BalanceCard";
import AITipCard from "@/components/dashboard/AITipCard";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import GoalsSummary from "@/components/dashboard/GoalsSummary";
import { useAuthStore } from "@/store/authStore";
import { useTransactionStore } from "@/store/transactionStore";
import { useGoalStore } from "@/store/goalStore";

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { fetchTransactions } = useTransactionStore();
  const { fetchGoals } = useGoalStore();

  useEffect(() => {
    fetchTransactions();
    fetchGoals();
  }, [fetchTransactions, fetchGoals]);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <AppShell>
      <Header title="Dashboard" />
      <div className="p-4 md:p-6">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="space-y-5"
        >
          {/* Greeting */}
          <motion.div variants={fadeUp}>
            <h2 className="text-xl md:text-2xl font-display font-bold text-foreground">
              Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">{today}</p>
          </motion.div>

          {/* Hero balance card */}
          <motion.div variants={fadeUp}>
            <BalanceCard />
          </motion.div>

          {/* Bento grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <motion.div variants={fadeUp} className="lg:col-span-3">
              <RecentTransactions />
            </motion.div>
            <div className="lg:col-span-2 flex flex-col gap-4">
              <motion.div variants={fadeUp}>
                <AITipCard />
              </motion.div>
              <motion.div variants={fadeUp}>
                <GoalsSummary />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </AppShell>
  );
}
