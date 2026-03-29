"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import LogoutConfirmDialog from "@/components/auth/LogoutConfirmDialog";
import AppShell from "@/components/layout/AppShell";
import Header from "@/components/layout/Header";
import EditProfileDialog from "@/components/settings/EditProfileDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/authStore";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Edit01Icon,
  Notification01Icon,
  Mail01Icon,
  InformationCircleIcon,
  Logout03Icon,
  Delete01Icon,
} from "@hugeicons/core-free-icons";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
};

export default function SettingsPage() {
  const user = useAuthStore((state) => state.user);
  const [editOpen, setEditOpen] = useState(false);
  const [pushNotif, setPushNotif] = useState(() => {
    if (typeof window === "undefined") return true;
    const storedValue = localStorage.getItem("paypath_push_notifications");
    return storedValue === null ? true : storedValue === "true";
  });
  const [emailNotif, setEmailNotif] = useState(() => {
    if (typeof window === "undefined") return false;
    const storedValue = localStorage.getItem("paypath_email_notifications");
    return storedValue === null ? false : storedValue === "true";
  });
  const [logoutConfirm, setLogoutConfirm] = useState(false);

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "—";

  useEffect(() => {
    localStorage.setItem("paypath_push_notifications", String(pushNotif));
  }, [pushNotif]);

  useEffect(() => {
    localStorage.setItem("paypath_email_notifications", String(emailNotif));
  }, [emailNotif]);

  return (
    <AppShell>
      <Header title="Settings" />
      <div className="mx-auto max-w-2xl p-4 md:p-6">
        <motion.div
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } }}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          <motion.div variants={fadeUp}>
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="size-16 rounded-2xl" size="lg">
                    <AvatarImage src={user?.avatarUrl || ""} alt={user?.name || "User"} />
                    <AvatarFallback className="rounded-2xl bg-primary/15 text-primary text-xl font-display font-bold">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-lg font-display font-bold">{user?.name || "User"}</h3>
                    <p className="truncate text-sm text-muted-foreground">{user?.email || ""}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">Member since {memberSince}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
                    <HugeiconsIcon icon={Edit01Icon} className="size-3.5" />
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeUp}>
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ToggleRow
                  icon={Notification01Icon}
                  label="Push notifications"
                  description="Get notified about spending alerts"
                  checked={pushNotif}
                  onChange={setPushNotif}
                />
                <Separator />
                <ToggleRow
                  icon={Mail01Icon}
                  label="Weekly email alerts"
                  description="Weekly spending summaries"
                  checked={emailNotif}
                  onChange={setEmailNotif}
                  disabled
                  badge="Coming Soon"
                />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeUp}>
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-3">
                  <HugeiconsIcon icon={InformationCircleIcon} className="size-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">PayPath</p>
                    <p className="text-xs text-muted-foreground">Version 1.0.0</p>
                  </div>
                </div>
                <p className="pl-7 text-xs text-muted-foreground">Made with love for the PayPath Hackathon</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeUp}>
            <Card>
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-center gap-2"
                  onClick={() => setLogoutConfirm(true)}
                >
                  <HugeiconsIcon icon={Logout03Icon} className="size-4" />
                  Sign out
                </Button>
                <Button
                  variant="destructive"
                  className="w-full justify-center gap-2"
                  disabled
                  onClick={() => toast.info("Coming soon")}
                >
                  <HugeiconsIcon icon={Delete01Icon} className="size-4" />
                  Delete account
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>

      <EditProfileDialog open={editOpen} onOpenChange={setEditOpen} />
      <LogoutConfirmDialog
        open={logoutConfirm}
        onOpenChange={setLogoutConfirm}
        title="Sign out?"
        description="Are you sure you want to sign out of PayPath?"
        confirmLabel="Sign out"
        pendingLabel="Signing out..."
      />
    </AppShell>
  );
}

function ToggleRow({
  icon,
  label,
  description,
  checked,
  onChange,
  disabled = false,
  badge,
}: {
  icon: typeof Notification01Icon;
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  badge?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <HugeiconsIcon icon={icon} className="size-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium">{label}</p>
          {badge && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              {badge}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={`relative h-6 w-10 cursor-pointer rounded-full transition-colors ${
          checked ? "bg-primary" : "bg-muted"
        } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
      >
        <div
          className={`absolute top-1 size-4 rounded-full bg-white transition-transform ${
            checked ? "translate-x-5" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
