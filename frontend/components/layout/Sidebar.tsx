"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Home01Icon,
  CreditCardIcon,
  Target01Icon,
  AiChat01Icon,
  ChartIcon,
  Logout03Icon,
  Settings01Icon,
} from "@hugeicons/core-free-icons";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home01Icon },
  { href: "/transactions", label: "Transactions", icon: CreditCardIcon },
  { href: "/goals", label: "Goals", icon: Target01Icon },
  { href: "/ai", label: "AI Coach", icon: AiChat01Icon },
  { href: "/passport", label: "Passport", icon: ChartIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <>
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-sidebar border-r border-sidebar-border">
      <div className="flex flex-col flex-1 min-h-0">
        {/* Logo */}
        <div className="flex items-center gap-2.5 h-16 px-6 border-b border-sidebar-border">
          <div className="size-8 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-display font-bold text-sm">P</span>
          </div>
          <Link href="/dashboard" className="text-xl font-display font-bold text-sidebar-foreground">
            PayPath
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-5 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary border-l-[3px] border-primary font-semibold"
                    : "text-sidebar-foreground/60 hover:bg-muted/50 hover:text-sidebar-foreground"
                )}
              >
                <HugeiconsIcon icon={item.icon} className="size-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Settings link */}
        <div className="px-3 pb-2">
          <Link
            href="/settings"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
              pathname === "/settings"
                ? "bg-primary/10 text-primary border-l-[3px] border-primary font-semibold"
                : "text-sidebar-foreground/60 hover:bg-muted/50 hover:text-sidebar-foreground"
            )}
          >
            <HugeiconsIcon icon={Settings01Icon} className="size-5" />
            Settings
          </Link>
        </div>

        {/* User section */}
        <div className="p-4 border-t border-sidebar-border space-y-3">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary/15 flex items-center justify-center text-primary text-sm font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-sidebar-foreground truncate">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-sidebar-foreground/50 truncate">
                {user?.email || ""}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-2 w-full text-left text-sm text-sidebar-foreground/50 hover:text-destructive hover:bg-destructive/10 rounded-lg px-3 py-2 transition-all duration-200 cursor-pointer"
          >
            <HugeiconsIcon icon={Logout03Icon} className="size-4" />
            Sign out
          </button>
        </div>
      </div>

    </aside>

      {/* Sign out confirmation modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-card rounded-2xl p-6 shadow-xl w-80 space-y-4 border border-border">
            <div className="space-y-1">
              <h3 className="font-display font-bold text-base">Sign out?</h3>
              <p className="text-sm text-muted-foreground">Are you sure you want to sign out of PayPath?</p>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 rounded-xl border border-border py-2 text-sm font-medium hover:bg-muted transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 rounded-xl bg-destructive text-destructive-foreground py-2 text-sm font-medium hover:bg-destructive/90 transition-colors cursor-pointer"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
