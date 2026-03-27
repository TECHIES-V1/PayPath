"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useTransactionStore } from "@/store/transactionStore";
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

const categories = {
  income: ["Salary", "Freelance", "Gift", "Investment", "Other"],
  expense: ["Food", "Transport", "Bills", "Shopping", "Entertainment", "Health", "Other"],
};

interface AddTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultType?: "income" | "expense";
}

export default function AddTransactionDialog({
  open,
  onOpenChange,
  defaultType = "expense",
}: AddTransactionDialogProps) {
  const addTransaction = useTransactionStore((s) => s.addTransaction);
  const [type, setType] = useState<"income" | "expense">(defaultType);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");

  const resetForm = () => {
    setAmount("");
    setCategory("");
    setNote("");
    setType(defaultType);
  };

  const [submitting, setSubmitting] = useState(false);

  const normalizeAmount = (value: string) => value.replace(/[^\d.]/g, "");

  const formatAmountForInput = (value: string) => {
    if (!value) return "";
    const [intPartRaw, decPartRaw] = value.split(".");
    const intPart = intPartRaw.replace(/\D/g, "");
    if (!intPart) return "";
    const withCommas = new Intl.NumberFormat("en-NG").format(Number(intPart));
    if (decPartRaw !== undefined) {
      const decPart = decPartRaw.replace(/\D/g, "").slice(0, 2);
      return decPart.length ? `${withCommas}.${decPart}` : `${withCommas}.`;
    }
    return withCommas;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanedAmount = normalizeAmount(amount);
    const numAmount = parseFloat(cleanedAmount);
    if (!numAmount || numAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (!category) {
      toast.error("Please select a category");
      return;
    }

    setSubmitting(true);
    try {
      await addTransaction({
        type,
        amount: numAmount,
        category,
        date: new Date().toISOString().split("T")[0],
        note: note.trim() || undefined,
      });
      toast.success(`${type === "income" ? "Income" : "Expense"} added`);
      resetForm();
      onOpenChange(false);
    } catch {
      toast.error("Failed to add transaction");
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
          <DialogTitle className="font-display text-lg font-bold">Add Transaction</DialogTitle>
          <DialogDescription>Log a new income or expense</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Type toggle */}
          <div className="flex gap-2">
            {(["income", "expense"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setType(t);
                  setCategory("");
                }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  type === t
                    ? t === "income"
                      ? "bg-primary text-primary-foreground"
                      : "bg-destructive/15 text-destructive"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                }`}
              >
                {t === "income" ? "Income" : "Expense"}
              </button>
            ))}
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="tx-amount">Amount (NGN)</Label>
            <Input
              id="tx-amount"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              placeholder="0"
              value={amount}
              onChange={(e) => {
                const raw = normalizeAmount(e.target.value);
                setAmount(formatAmountForInput(raw));
              }}
              className="text-lg font-display font-bold"
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Category</Label>
            <div className="flex flex-wrap gap-2">
              {categories[type].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    category === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Note */}
          <div className="space-y-2">
            <Label htmlFor="tx-note">Note (optional)</Label>
            <Input
              id="tx-note"
              placeholder="What was this for?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Adding..." : `Add ${type === "income" ? "Income" : "Expense"}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
