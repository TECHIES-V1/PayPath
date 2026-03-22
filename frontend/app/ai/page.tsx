"use client";

import AppShell from "@/components/layout/AppShell";
import Header from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";

export default function AIPage() {
  return (
    <AppShell>
      <Header title="AI Coach" />
      <div className="p-4 md:p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <span className="text-lg font-bold text-primary">AI</span>
            </div>
            <h3 className="text-lg font-semibold">Your AI Financial Coach</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs">
              Chat with your personal AI coach to get financial advice, spending insights, and savings tips.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
