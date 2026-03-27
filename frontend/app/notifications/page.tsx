"use client";

import { useEffect } from "react";
import AppShell from "@/components/layout/AppShell";
import Header from "@/components/layout/Header";
import { useNotificationStore } from "@/store/notificationStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Notification01Icon, Tick01Icon, Delete01Icon } from "@hugeicons/core-free-icons";

const typeStyles = {
  success: "bg-primary/10 text-primary",
  warning: "bg-yellow-400/10 text-yellow-400",
  info: "bg-blue-400/10 text-blue-400",
};

export default function NotificationsPage() {
  const { notifications, markAllRead, clearAll } = useNotificationStore();

  useEffect(() => {
    if (notifications.some((notification) => !notification.read)) {
      markAllRead();
    }
  }, [markAllRead, notifications]);

  return (
    <AppShell>
      <Header title="Notifications" />
      <div className="mx-auto w-full max-w-3xl space-y-5 px-4 py-4 md:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-display font-bold">All Notifications</h2>
            <p className="text-sm text-muted-foreground">
              {notifications.length === 0 ? "No notifications yet." : `${notifications.length} notification${notifications.length === 1 ? "" : "s"}`}
            </p>
          </div>
          {notifications.length > 0 && (
            <div className="flex w-full sm:w-auto">
              <Button size="sm" variant="outline" className="w-full sm:w-auto" onClick={markAllRead}>
                <HugeiconsIcon icon={Tick01Icon} className="size-3.5" />
                Mark all read
              </Button>
            </div>
          )}
        </div>

        {notifications.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center gap-3 py-14 text-center">
              <HugeiconsIcon icon={Notification01Icon} className="size-10 text-muted-foreground/40" />
              <div>
                <p className="font-medium">No notifications yet</p>
                <p className="text-sm text-muted-foreground">Activity alerts will appear here as they come in.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <Card key={notification.id} className={!notification.read ? "border-primary/20 bg-primary/[0.03]" : undefined}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-start gap-3 text-base">
                    <div className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl ${typeStyles[notification.type]}`}>
                      <HugeiconsIcon icon={Notification01Icon} className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                        <span className="break-words">{notification.title}</span>
                        <span className="shrink-0 text-xs font-normal text-muted-foreground">
                          {new Date(notification.createdAt).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{notification.message}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {notifications.length > 0 && (
          <div className="pt-2">
            <Button
              variant="ghost"
              className="w-full justify-center text-muted-foreground hover:text-destructive"
              onClick={clearAll}
            >
              <HugeiconsIcon icon={Delete01Icon} className="size-3.5" />
              Clear notifications
            </Button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
