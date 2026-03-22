"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const mockData = {
  balance: 245000,
  income: 380000,
  expense: 135000,
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function BalanceCard() {
  return (
    <Card className="col-span-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Total Balance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground">
          {formatCurrency(mockData.balance)}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Income</p>
            <p className="text-lg font-semibold text-income">
              +{formatCurrency(mockData.income)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Expenses</p>
            <p className="text-lg font-semibold text-expense">
              -{formatCurrency(mockData.expense)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
