"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useNotificationStore } from "@/store/notificationStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HugeiconsIcon } from "@hugeicons/react";
import { Notification01Icon } from "@hugeicons/core-free-icons";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const { user } = useAuthStore();
  const { unreadCount } = useNotificationStore();
  const count = unreadCount();

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center gap-3">
          <span className="md:hidden text-sm font-display font-bold text-primary">PayPath</span>
          <h1 className="text-xl font-display font-bold text-foreground hidden md:block">{title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/notifications"
            className="relative size-9 rounded-xl bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors"
          >
              <HugeiconsIcon icon={Notification01Icon} className="size-[18px] text-muted-foreground" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 size-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {count > 9 ? "9+" : count}
                </span>
              )}
          </Link>

          <Link href="/settings" className="rounded-xl">
            <Avatar className="size-9 rounded-xl ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
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
