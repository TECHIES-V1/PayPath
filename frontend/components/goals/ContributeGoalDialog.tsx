"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { type Goal, useGoalStore } from "@/store/goalStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDecimalInput, parseDecimalInput } from "@/lib/number";

interface ContributeGoalDialogProps {
  goal: Goal | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export default function ContributeGoalDialog({ goal, open, onOpenChange }: ContributeGoalDialogProps) {
  const addFunds = useGoalStore((state) => state.addFunds);
  const [amount, setAmount] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) {
      setAmount("");
      setSaving(false);
    }
  }, [open]);

  const remainingAmount = goal ? Math.max(0, goal.targetAmount - goal.currentAmount) : 0;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!goal) return;

    const contribution = parseDecimalInput(amount);
    if (!Number.isFinite(contribution) || contribution <= 0) {
      toast.error("Enter an amount greater than 0");
      return;
    }

    if (contribution > remainingAmount) {
      toast.error("Contribution cannot push this goal past 100%");
      return;
    }

    setSaving(true);
    try {
      await addFunds(goal.id, contribution);
      toast.success(`Added ${formatCurrency(contribution)} to ${goal.name}`);
      onOpenChange(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to add contribution";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !saving && onOpenChange(nextOpen)}>
      <DialogContent className="rounded-2xl p-6 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-lg font-bold">Add contribution</DialogTitle>
          <DialogDescription>
            {goal ? `Add money to "${goal.name}" without exceeding the remaining target.` : "Add money to this goal."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="rounded-2xl bg-muted/40 px-4 py-3 text-sm">
            <p className="text-muted-foreground">Remaining amount</p>
            <p className="mt-1 font-display text-lg font-bold text-foreground">{formatCurrency(remainingAmount)}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal-contribution">Contribution amount (NGN)</Label>
            <Input
              id="goal-contribution"
              type="text"
              inputMode="decimal"
              placeholder="0.00"
              value={amount}
              onChange={(event) => setAmount(formatDecimalInput(event.target.value))}
              className="text-lg font-display font-bold"
              disabled={saving || remainingAmount <= 0}
              required
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" disabled={saving} onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving || remainingAmount <= 0}>
              {saving ? "Adding..." : "Add contribution"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
