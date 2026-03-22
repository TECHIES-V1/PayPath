"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const mockGoals = [
  { id: "1", name: "Emergency Fund", target: 500000, current: 245000 },
  { id: "2", name: "New Laptop", target: 350000, current: 120000 },
];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function GoalsSummary() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Savings Goals
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockGoals.map((goal) => {
          const percentage = Math.round((goal.current / goal.target) * 100);
          return (
            <div key={goal.id} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{goal.name}</span>
                <span className="text-muted-foreground">{percentage}%</span>
              </div>
              <Progress value={percentage} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatCurrency(goal.current)}</span>
                <span>{formatCurrency(goal.target)}</span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
