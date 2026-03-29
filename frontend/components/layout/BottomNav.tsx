"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Home01Icon,
  CreditCardIcon,
  Target01Icon,
  AiChat01Icon,
  ChartIcon,
} from "@hugeicons/core-free-icons";

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home01Icon },
  { href: "/transactions", label: "Money", icon: CreditCardIcon },
  { href: "/goals", label: "Goals", icon: Target01Icon },
  { href: "/ai", label: "Coach", icon: AiChat01Icon },
  { href: "/passport", label: "Score", icon: ChartIcon },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main navigation" className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl shadow-[0_-2px_10px_oklch(0_0_0/0.05)] dark:shadow-none dark:border-t dark:border-white/[0.06] md:hidden">
      <div className="flex items-center justify-around h-[68px] px-2">
        {navItems.map((item) => {
          const isActive = item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center gap-1 min-w-[48px] min-h-[48px] justify-center px-3 py-1.5 rounded-xl transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <HugeiconsIcon icon={item.icon} className="size-[22px]" />
              <span className="text-[10px] font-semibold">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="bottomnav-indicator"
                  className="absolute -bottom-0.5 w-5 h-[3px] rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
