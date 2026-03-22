"use client";

import { motion } from "motion/react";
import AppShell from "@/components/layout/AppShell";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { CreditCardIcon, Add01Icon } from "@hugeicons/core-free-icons";

export default function TransactionsPage() {
  return (
    <AppShell>
      <Header title="Transactions" />
      <div className="p-4 md:p-6 space-y-5">
        {/* Filter tabs (mock) */}
        <div className="flex items-center gap-2">
          {["All", "Income", "Expense"].map((tab, i) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                i === 0
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}
            >
              {tab}
            </button>
          ))}
          <div className="ml-auto">
            <button className="px-3 py-2 rounded-xl text-xs font-medium bg-muted/50 text-muted-foreground hover:bg-muted transition-colors">
              This Month
            </button>
          </div>
        </div>

        {/* Empty state */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          {/* Illustration */}
          <div className="relative mb-8">
            <div className="size-28 rounded-[2rem] bg-primary/10 flex items-center justify-center">
              <HugeiconsIcon icon={CreditCardIcon} className="size-12 text-primary" />
            </div>
            {/* Floating decorative elements */}
            <motion.div
              animate={{ y: [-4, 4, -4] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-3 -right-3 size-10 rounded-xl bg-primary/15 rotate-12"
            />
            <motion.div
              animate={{ y: [3, -3, 3] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-2 -left-4 size-8 rounded-lg bg-primary/10 -rotate-6"
            />
          </div>

          <h3 className="text-xl font-display font-bold mb-2">No transactions yet</h3>
          <p className="text-sm text-muted-foreground max-w-xs mb-6 leading-relaxed">
            Start logging your income and expenses to track your financial progress.
          </p>
          <Button size="lg" className="rounded-xl">
            <HugeiconsIcon icon={Add01Icon} className="size-4" />
            Log Your First Transaction
          </Button>
        </motion.div>
      </div>
    </AppShell>
  );
}
