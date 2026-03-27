"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useGoalStore, type Goal } from "@/store/goalStore";
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

interface EditGoalDialogProps {
  goal: Goal | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditGoalDialog({ goal, open, onOpenChange }: EditGoalDialogProps) {
  const updateGoal = useGoalStore((state) => state.updateGoal);
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!goal) return;

    setName(goal.name);
    setTarget(String(goal.targetAmount));
    setDeadline(goal.deadline);
  }, [goal]);

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

    const numTarget = parseFloat(target);
    if (!numTarget || numTarget <= 0) {
      toast.error("Please enter a valid target amount");
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
      toast.success("Goal updated");
      onOpenChange(false);
      resetState();
    } catch {
      toast.error("Failed to update goal");
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
              type="number"
              min="0"
              step="1000"
              value={target}
              onChange={(event) => setTarget(event.target.value)}
              className="text-lg font-display font-bold"
              required
            />
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
