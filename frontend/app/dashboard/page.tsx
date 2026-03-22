"use client";

import AppShell from "@/components/layout/AppShell";
import Header from "@/components/layout/Header";
import BalanceCard from "@/components/dashboard/BalanceCard";
import AITipCard from "@/components/dashboard/AITipCard";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import GoalsSummary from "@/components/dashboard/GoalsSummary";
import { useAuthStore } from "@/store/authStore";

export default function DashboardPage() {
  const { user } = useAuthStore();

  return (
    <AppShell>
      <Header title="Dashboard" />
      <div className="p-4 md:p-6 space-y-6">
        {/* Greeting */}
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Here&apos;s your financial overview
          </p>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BalanceCard />
          <AITipCard />
          <RecentTransactions />
          <GoalsSummary />
        </div>
      </div>
    </AppShell>
  );
}
