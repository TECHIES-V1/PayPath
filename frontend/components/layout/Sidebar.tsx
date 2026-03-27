"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AiChat01Icon,
  ChartIcon,
  CreditCardIcon,
  Home01Icon,
  Logout03Icon,
  Settings01Icon,
  Target01Icon,
} from "@hugeicons/core-free-icons";
import LogoutConfirmDialog from "@/components/auth/LogoutConfirmDialog";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home01Icon },
  { href: "/transactions", label: "Transactions", icon: CreditCardIcon },
  { href: "/goals", label: "Goals", icon: Target01Icon },
  { href: "/ai", label: "AI Coach", icon: AiChat01Icon },
  { href: "/passport", label: "Passport", icon: ChartIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <aside className="hidden border-r border-sidebar-border bg-sidebar md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex h-16 items-center gap-2.5 border-b border-sidebar-border px-6">
            <div className="flex size-8 items-center justify-center rounded-xl bg-primary">
              <span className="font-display text-sm font-bold text-primary-foreground">P</span>
            </div>
            <Link href="/dashboard" className="font-display text-xl font-bold text-sidebar-foreground">
              PayPath
            </Link>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "border-l-[3px] border-primary bg-primary/10 font-semibold text-primary"
                      : "text-sidebar-foreground/60 hover:bg-muted/50 hover:text-sidebar-foreground"
                  )}
                >
                  <HugeiconsIcon icon={item.icon} className="size-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="px-3 pb-2">
            <Link
              href="/settings"
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                pathname === "/settings"
                  ? "border-l-[3px] border-primary bg-primary/10 font-semibold text-primary"
                  : "text-sidebar-foreground/60 hover:bg-muted/50 hover:text-sidebar-foreground"
              )}
            >
              <HugeiconsIcon icon={Settings01Icon} className="size-5" />
              Settings
            </Link>
          </div>

          <div className="space-y-3 border-t border-sidebar-border p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-sm font-bold text-primary">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-sidebar-foreground">
                  {user?.name || "User"}
                </p>
                <p className="truncate text-xs text-sidebar-foreground/50">
                  {user?.email || ""}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowConfirm(true)}
              className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-sidebar-foreground/50 transition-all duration-200 hover:bg-destructive/10 hover:text-destructive"
            >
              <HugeiconsIcon icon={Logout03Icon} className="size-4" />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      <LogoutConfirmDialog open={showConfirm} onOpenChange={setShowConfirm} />
    </>
  );
}
