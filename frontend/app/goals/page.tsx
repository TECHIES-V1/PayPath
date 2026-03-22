"use client";

import AppShell from "@/components/layout/AppShell";
import Header from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";

export default function GoalsPage() {
  return (
    <AppShell>
      <Header title="Savings Goals" />
      <div className="p-4 md:p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold">No goals yet</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs">
              Set your first savings goal and start building your financial future.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
