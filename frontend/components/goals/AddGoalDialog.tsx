"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useGoalStore } from "@/store/goalStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface AddGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddGoalDialog({ open, onOpenChange }: AddGoalDialogProps) {
  const addGoal = useGoalStore((s) => s.addGoal);
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [deadline, setDeadline] = useState("");

  const resetForm = () => {
    setName("");
    setTarget("");
    setDeadline("");
  };

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

    setSubmitting(true);
    try {
      await addGoal({
        name: name.trim(),
        targetAmount: numTarget,
        deadline,
      });
      toast.success("Goal created!");
      resetForm();
      onOpenChange(false);
    } catch {
      toast.error("Failed to create goal");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) resetForm();
        onOpenChange(v);
      }}
    >
      <DialogContent className="sm:max-w-md rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="font-display text-lg font-bold">Create a Goal</DialogTitle>
          <DialogDescription>Set a savings target to work toward</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="goal-name">Goal name</Label>
            <Input
              id="goal-name"
              placeholder="e.g. Emergency Fund"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal-target">Target amount (NGN)</Label>
            <Input
              id="goal-target"
              type="number"
              min="0"
              step="1000"
              placeholder="0"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="text-lg font-display font-bold"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal-deadline">Deadline</Label>
            <Input
              id="goal-deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Creating..." : "Create Goal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
