"use client";

import AppShell from "@/components/layout/AppShell";
import Header from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";

export default function TransactionsPage() {
  return (
    <AppShell>
      <Header title="Transactions" />
      <div className="p-4 md:p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold">No transactions yet</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs">
              Start logging your income and expenses to track your financial progress.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
