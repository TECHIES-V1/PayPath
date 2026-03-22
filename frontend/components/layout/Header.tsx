"use client";

import { useAuthStore } from "@/store/authStore";
import { HugeiconsIcon } from "@hugeicons/react";
import { Notification01Icon } from "@hugeicons/core-free-icons";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const { user } = useAuthStore();

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center gap-3">
          {/* Mobile brand */}
          <span className="md:hidden text-sm font-display font-bold text-primary">PayPath</span>
          <h1 className="text-xl font-display font-bold text-foreground hidden md:block">{title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-display font-bold text-foreground md:hidden">{title}</h1>
          <button className="relative size-9 rounded-xl bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors">
            <HugeiconsIcon icon={Notification01Icon} className="size-[18px] text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-destructive animate-pulse-dot" />
          </button>
          <div className="size-9 rounded-xl bg-primary/15 ring-2 ring-primary/20 flex items-center justify-center text-primary text-xs font-bold">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
        </div>
      </div>
    </header>
  );
}
