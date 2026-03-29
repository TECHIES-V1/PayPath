"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { SparklesIcon } from "@hugeicons/core-free-icons";
import { useChatStore } from "@/store/chatStore";

export default function AITipCard() {
  const { insights, fetchInsights } = useChatStore();
  const [tipIndex] = useState(() => Math.floor(Math.random() * 100));

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  const tip =
    insights.length > 0
      ? insights[tipIndex % insights.length]
      : "Loading your personalized financial tip...";

  return (
    <Card className="border-l-4 border-l-primary bg-gradient-to-r from-primary/[0.06] to-transparent dark:from-primary/[0.04]">
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-xl bg-primary/15 flex items-center justify-center">
            <HugeiconsIcon icon={SparklesIcon} className="size-4 text-primary" />
          </div>
          <h3 className="text-sm font-display font-semibold">AI Tip of the Day</h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {tip}
        </p>
        <Link
          href="/ai"
          className="inline-flex items-center text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/15 rounded-full px-3 py-1.5 transition-colors"
        >
          Ask AI Coach
        </Link>
      </CardContent>
    </Card>
  );
}
