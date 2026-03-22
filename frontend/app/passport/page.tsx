"use client";

import AppShell from "@/components/layout/AppShell";
import Header from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";

export default function PassportPage() {
  return (
    <AppShell>
      <Header title="Financial Passport" />
      <div className="p-4 md:p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
                <circle cx="12" cy="10" r="3" />
                <path d="M8 17h8" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold">Your Financial Passport</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs">
              Track your financial health score, earn badges, and build your financial identity.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
