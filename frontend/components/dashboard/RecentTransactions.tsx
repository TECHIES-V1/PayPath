"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const mockTransactions = [
  { id: "1", category: "Food", amount: -4500, type: "expense", date: "Today" },
  { id: "2", category: "Salary", amount: 250000, type: "income", date: "Yesterday" },
  { id: "3", category: "Transport", amount: -2000, type: "expense", date: "Yesterday" },
  { id: "4", category: "Freelance", amount: 35000, type: "income", date: "Mar 20" },
  { id: "5", category: "Bills", amount: -15000, type: "expense", date: "Mar 19" },
];

function formatCurrency(amount: number) {
  const abs = Math.abs(amount);
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(abs);
}

export default function RecentTransactions() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Recent Transactions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {mockTransactions.map((tx) => (
          <div key={tx.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge
                variant={tx.type === "income" ? "default" : "secondary"}
                className="text-[10px] w-16 justify-center"
              >
                {tx.category}
              </Badge>
              <span className="text-xs text-muted-foreground">{tx.date}</span>
            </div>
            <span
              className={`text-sm font-medium ${
                tx.type === "income" ? "text-income" : "text-expense"
              }`}
            >
              {tx.type === "income" ? "+" : "-"}
              {formatCurrency(tx.amount)}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
