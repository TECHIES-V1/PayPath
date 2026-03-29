"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useGoalStore, type Goal } from "@/store/goalStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDecimalInput, parseDecimalInput } from "@/lib/number";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EditGoalDialogProps {
  goal: Goal | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditGoalDialog({ goal, open, onOpenChange }: EditGoalDialogProps) {
  const updateGoal = useGoalStore((state) => state.updateGoal);
  const fetchGoals = useGoalStore((state) => state.fetchGoals);
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!goal || !open) return;

    setName(goal.name);
    setTarget(formatDecimalInput(String(goal.targetAmount)));
    setDeadline(goal.deadline);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goal?.id, open]);

  const resetState = () => {
    setName("");
    setTarget("");
    setDeadline("");
    setSaving(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!goal) return;

    if (!name.trim()) {
      toast.error("Please enter a goal name");
      return;
    }

    const numTarget = parseDecimalInput(target);
    if (!Number.isFinite(numTarget) || numTarget <= 0) {
      toast.error("Please enter a valid target amount");
      return;
    }
    if (numTarget < goal.currentAmount) {
      toast.error("Target amount cannot be lower than the amount already contributed");
      return;
    }

    if (!deadline) {
      toast.error("Please select a deadline");
      return;
    }

    setSaving(true);
    try {
      await updateGoal(goal.id, {
        name: name.trim(),
        targetAmount: numTarget,
        deadline,
      });
      await fetchGoals();
      toast.success("Goal updated");
      onOpenChange(false);
      resetState();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to update goal right now.";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (saving) return;
        if (!nextOpen) resetState();
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="rounded-2xl p-6 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-lg font-bold">Edit Goal</DialogTitle>
          <DialogDescription>Update your goal name, target amount, and deadline.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="edit-goal-name">Goal name</Label>
            <Input
              id="edit-goal-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Emergency Fund"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-goal-target">Target amount (NGN)</Label>
            <Input
              id="edit-goal-target"
              type="text"
              inputMode="decimal"
              value={target}
              onChange={(event) => setTarget(formatDecimalInput(event.target.value))}
              placeholder={`${goal?.currentAmount ?? 0}`}
              className="text-lg font-display font-bold"
              required
            />
            {goal && (
              <p className="text-xs text-muted-foreground">
                Minimum allowed: {goal.currentAmount.toLocaleString("en-NG", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-goal-deadline">Deadline</Label>
            <Input
              id="edit-goal-deadline"
              type="date"
              value={deadline}
              onChange={(event) => setDeadline(event.target.value)}
              required
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" disabled={saving} onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
