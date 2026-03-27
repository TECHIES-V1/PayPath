"use client";

import { useState, useTransition } from "react";
import { flushSync } from "react-dom";
import { useRouter } from "next/navigation";
import { Logout03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface LogoutConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  pendingLabel?: string;
}

export default function LogoutConfirmDialog({
  open,
  onOpenChange,
  title = "Sign out?",
  description = "Are you sure you want to sign out of PayPath?",
  confirmLabel = "Sign out",
  pendingLabel = "Signing out...",
}: LogoutConfirmDialogProps) {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPending, startTransition] = useTransition();
  const isBusy = isSubmitting || isPending;

  const handleOpenChange = (nextOpen: boolean) => {
    if (isBusy) return;
    if (!nextOpen) setIsSubmitting(false);
    onOpenChange(nextOpen);
  };

  const handleLogout = () => {
    if (isBusy) return;

    flushSync(() => {
      setIsSubmitting(true);
    });

    requestAnimationFrame(() => {
      logout();
      startTransition(() => {
        router.push("/login");
      });
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="rounded-2xl p-6 sm:max-w-md"
        showCloseButton={!isBusy}
        onEscapeKeyDown={(event) => {
          if (isBusy) event.preventDefault();
        }}
        onPointerDownOutside={(event) => {
          if (isBusy) event.preventDefault();
        }}
      >
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
              <HugeiconsIcon icon={Logout03Icon} className="size-5" />
            </div>
            <DialogTitle className="font-display text-lg font-bold">{title}</DialogTitle>
          </div>
          <DialogDescription className="text-sm">{description}</DialogDescription>
        </DialogHeader>

        <DialogFooter className="pt-2">
          <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={isBusy}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={handleLogout} disabled={isBusy} aria-busy={isBusy}>
            {isBusy ? pendingLabel : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
