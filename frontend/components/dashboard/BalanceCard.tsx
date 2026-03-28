"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ViewIcon,
  ViewOffIcon,
  Add01Icon,
  Remove01Icon,
  ArrowUpRight01Icon
} from "@hugeicons/core-free-icons";
import { useTransactionStore } from "@/store/transactionStore";
import AddTransactionDialog from "@/components/transactions/AddTransactionDialog";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatHiddenAmount() {
  return "****";
}

function useCountUp(target: number, duration = 800) {
  const [value, setValue] = useState(0);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) {
        ref.current = requestAnimationFrame(animate);
      }
    };
    ref.current = requestAnimationFrame(animate);
    return () => {
      if (ref.current) cancelAnimationFrame(ref.current);
    };
  }, [target, duration]);

  return value;
}

export default function BalanceCard() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") return true;

    const stored = localStorage.getItem("paypath_balance_visible");
    return stored === null ? true : stored === "true";
  });
  const [addOpen, setAddOpen] = useState(false);
  const [addType, setAddType] = useState<"income" | "expense">("income");
  const { getTotals, isLoading } = useTransactionStore();
  const { balance, income, expense } = getTotals();
  const animatedBalance = useCountUp(balance);

  useEffect(() => {
    localStorage.setItem("paypath_balance_visible", String(visible));
  }, [visible]);

  const openAdd = (type: "income" | "expense") => {
    setAddType(type);
    setAddOpen(true);
  };

  return (
    <>
      <div className="relative overflow-hidden rounded-3xl bg-[oklch(0.15_0.005_0)] text-white p-6 md:p-8">
        {/* Decorative shapes */}
        <div className="absolute -top-12 -right-12 size-48 rounded-[3rem] bg-primary/8 rotate-12" />
        <div className="absolute -bottom-8 -left-8 size-36 rounded-[2.5rem] bg-primary/5 -rotate-6" />
        <div className="absolute top-1/2 right-1/4 size-20 rounded-[1.5rem] bg-white/[0.03] rotate-[20deg]" />

        <div className="relative z-10">
          {/* Header row */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs font-medium text-white/40 uppercase tracking-wider">Total Balance</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setVisible((current) => !current)}
                className="size-8 rounded-xl bg-white/[0.06] flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <HugeiconsIcon icon={visible ? ViewIcon : ViewOffIcon} className="size-4 text-white/50" />
              </button>
              <Link href="/transactions" className="size-8 rounded-xl bg-primary flex items-center justify-center hover:bg-primary/85 transition-colors">
                <HugeiconsIcon icon={ArrowUpRight01Icon} className="size-4 text-primary-foreground" />
              </Link>
            </div>
          </div>

          {/* Balance */}
          <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight mb-8">
            {isLoading ? (
              <span className="inline-block h-10 w-48 rounded-xl skeleton bg-white/[0.06]" />
            ) : visible ? formatCurrency(animatedBalance) : "****"}
          </h2>

          {/* Income / Expense pills */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="bg-white/[0.06] backdrop-blur-sm rounded-2xl px-4 py-3 flex-1 min-w-[140px]">
              <p className="text-[11px] text-white/40 font-medium mb-1">Income</p>
              <p className="text-sm md:text-lg font-display font-bold text-primary">
                {visible ? `+${formatCurrency(income)}` : formatHiddenAmount()}
              </p>
            </div>
            <div className="bg-white/[0.06] backdrop-blur-sm rounded-2xl px-4 py-3 flex-1 min-w-[140px]">
              <p className="text-[11px] text-white/40 font-medium mb-1">Expenses</p>
              <p className="text-sm md:text-lg font-display font-bold text-red-400">
                {visible ? `-${formatCurrency(expense)}` : formatHiddenAmount()}
              </p>
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex gap-2">
            <button
              onClick={() => openAdd("income")}
              className="flex items-center gap-1.5 bg-white/[0.08] hover:bg-white/[0.12] text-white rounded-full px-4 py-2 text-xs font-medium transition-colors cursor-pointer"
            >
              {visible && <HugeiconsIcon icon={Add01Icon} className="size-3 md:size-3.5" />}
              Add Income
            </button>
            <button
              onClick={() => openAdd("expense")}
              className="flex items-center gap-1.5 bg-white/[0.08] hover:bg-white/[0.12] text-white rounded-full px-4 py-2 text-xs font-medium transition-colors cursor-pointer"
            >
              {visible && <HugeiconsIcon icon={Remove01Icon} className="size-3" />}
              Add Expense
            </button>
          </div>
        </div>
      </div>

      <AddTransactionDialog open={addOpen} onOpenChange={setAddOpen} defaultType={addType} />
    </>
  );
}
