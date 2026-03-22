"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AITipCard() {
  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
            AI
          </span>
          Tip of the Day
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground leading-relaxed">
          You&apos;ve spent 35% of your income on food this month. Consider meal
          prepping on weekends to cut food costs by up to 40%.
        </p>
        <button className="mt-3 text-xs font-medium text-primary hover:underline">
          Ask AI Coach for more tips
        </button>
      </CardContent>
    </Card>
  );
}
