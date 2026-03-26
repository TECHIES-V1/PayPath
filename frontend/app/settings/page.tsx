"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import LogoutConfirmDialog from "@/components/auth/LogoutConfirmDialog";
import AppShell from "@/components/layout/AppShell";
import Header from "@/components/layout/Header";
import EditProfileDialog from "@/components/settings/EditProfileDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/store/authStore";
import { useThemeStore } from "@/store/themeStore";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Edit01Icon,
  Sun01Icon,
  MoonIcon,
  ComputerIcon,
  Notification01Icon,
  Mail01Icon,
  InformationCircleIcon,
  Logout03Icon,
  Delete01Icon,
} from "@hugeicons/core-free-icons";

const themes = [
  { value: "light" as const, label: "Light", icon: Sun01Icon },
  { value: "dark" as const, label: "Dark", icon: MoonIcon },
  { value: "system" as const, label: "System", icon: ComputerIcon },
];

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
};

export default function SettingsPage() {
  const user = useAuthStore((state) => state.user);
  const { theme, setTheme } = useThemeStore();
  const [editOpen, setEditOpen] = useState(false);
  const [pushNotif, setPushNotif] = useState(true);
  const [emailNotif, setEmailNotif] = useState(false);

  const [logoutConfirm, setLogoutConfirm] = useState(false);

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <AppShell>
      <Header title="Settings" />
      <div className="p-4 md:p-6 max-w-2xl mx-auto">
        <motion.div
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } }}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {/* Profile */}
          <motion.div variants={fadeUp}>
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="size-16 rounded-2xl bg-primary/15 flex items-center justify-center text-primary text-xl font-display font-bold shrink-0">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold text-lg truncate">{user?.name || "User"}</h3>
                    <p className="text-sm text-muted-foreground truncate">{user?.email || ""}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Member since {memberSince}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
                    <HugeiconsIcon icon={Edit01Icon} className="size-3.5" />
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Appearance */}
          <motion.div variants={fadeUp}>
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  {themes.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setTheme(t.value)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                        theme === t.value
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted/50 text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <HugeiconsIcon icon={t.icon} className="size-4" />
                      {t.label}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Notifications */}
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
                  label="Email alerts"
                  description="Weekly spending summaries"
                  checked={emailNotif}
                  onChange={setEmailNotif}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* About */}
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
                <p className="text-xs text-muted-foreground pl-7">
                  Made with love for the PayPath Hackathon
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Danger zone */}
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
}: {
  icon: typeof Notification01Icon;
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <HugeiconsIcon icon={icon} className="size-4 text-muted-foreground shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-6 rounded-full transition-colors cursor-pointer ${
          checked ? "bg-primary" : "bg-muted"
        }`}
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
