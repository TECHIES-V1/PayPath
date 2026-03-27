"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useNotificationStore } from "@/store/notificationStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HugeiconsIcon } from "@hugeicons/react";
import { Notification01Icon, Cancel01Icon, Tick01Icon } from "@hugeicons/core-free-icons";

interface HeaderProps {
  title: string;
}

const typeStyles = {
  success: "bg-primary/10 text-primary",
  warning: "bg-yellow-400/10 text-yellow-400",
  info: "bg-blue-400/10 text-blue-400",
};

export default function Header({ title }: HeaderProps) {
  const { user } = useAuthStore();
  const { notifications, markAllRead, clearAll, unreadCount } = useNotificationStore();
  const [showNotif, setShowNotif] = useState(false);
  const count = unreadCount();

  const handleOpen = () => {
    setShowNotif((v) => !v);
  };

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center gap-3">
          <span className="md:hidden text-sm font-display font-bold text-primary">PayPath</span>
          <h1 className="text-xl font-display font-bold text-foreground hidden md:block">{title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={handleOpen}
              className="relative size-9 rounded-xl bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors cursor-pointer"
            >
              <HugeiconsIcon icon={Notification01Icon} className="size-[18px] text-muted-foreground" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 size-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </button>

            {showNotif && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotif(false)} />
                <div className="absolute right-0 top-11 z-50 w-80 bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                    <p className="text-sm font-semibold">Notifications</p>
                    <div className="flex items-center gap-2">
                      {notifications.length > 0 && (
                        <>
                          <button
                            onClick={markAllRead}
                            className="text-xs text-primary hover:underline flex items-center gap-1"
                          >
                            <HugeiconsIcon icon={Tick01Icon} className="size-3" />
                            Mark all read
                          </button>
                          <button
                            onClick={clearAll}
                            className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                          >
                            Clear
                          </button>
                        </>
                      )}
                      <button onClick={() => setShowNotif(false)} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer ml-1">
                        <HugeiconsIcon icon={Cancel01Icon} className="size-4" />
                      </button>
                    </div>
                  </div>

                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
                        <HugeiconsIcon icon={Notification01Icon} className="size-8 text-muted-foreground/40" />
                        <p className="text-sm text-muted-foreground">No notifications yet</p>
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`flex items-start gap-3 px-4 py-3 border-b border-border/50 last:border-0 transition-colors ${
                            !n.read ? "bg-primary/[0.03]" : ""
                          }`}
                        >
                          <div className={`size-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${typeStyles[n.type]}`}>
                            <HugeiconsIcon icon={Notification01Icon} className="size-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold leading-tight">{n.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                            <p className="text-[10px] text-muted-foreground/60 mt-1">
                              {new Date(n.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                          {!n.read && <div className="size-2 rounded-full bg-primary mt-1.5 shrink-0" />}
                        </div>
                      ))
                    )}
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
