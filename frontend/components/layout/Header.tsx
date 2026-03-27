"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HugeiconsIcon } from "@hugeicons/react";
import { Notification01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const { user } = useAuthStore();
  const [showNotif, setShowNotif] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center gap-3">
          <span className="md:hidden text-sm font-display font-bold text-primary">PayPath</span>
          <h1 className="text-xl font-display font-bold text-foreground hidden md:block">{title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-display font-bold text-foreground md:hidden">{title}</h1>

          <div className="relative">
            <button
              onClick={() => setShowNotif((v) => !v)}
              className="relative size-9 rounded-xl bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors cursor-pointer"
            >
              <HugeiconsIcon icon={Notification01Icon} className="size-[18px] text-muted-foreground" />
            </button>

            {showNotif && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotif(false)} />
                <div className="absolute right-0 top-11 z-50 w-72 bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                    <p className="text-sm font-semibold">Notifications</p>
                    <button onClick={() => setShowNotif(false)} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                      <HugeiconsIcon icon={Cancel01Icon} className="size-4" />
                    </button>
                  </div>
                  <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
                    <HugeiconsIcon icon={Notification01Icon} className="size-8 text-muted-foreground/40" />
                    <p className="text-sm text-muted-foreground">No notifications yet</p>
                  </div>
                </div>
              </>
            )}
          </div>

          <Link href="/settings" className="rounded-xl">
            <Avatar className="size-9 rounded-xl ring-2 ring-primary/20 hover:ring-primary/40 transition-all avatar-glow">
              <AvatarImage src={user?.avatarUrl || ""} alt={user?.name || "User"} />
              <AvatarFallback className="rounded-xl bg-primary/15 text-primary text-xs font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </header>
  );
}
