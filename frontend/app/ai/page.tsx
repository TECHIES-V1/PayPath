"use client";

import { motion } from "motion/react";
import AppShell from "@/components/layout/AppShell";
import Header from "@/components/layout/Header";
import { Input } from "@/components/ui/input";
import { HugeiconsIcon } from "@hugeicons/react";
import { SparklesIcon, SentIcon } from "@hugeicons/core-free-icons";

const suggestedQuestions = [
  "How can I save more?",
  "Analyze my spending",
  "Budget tips",
];

export default function AIPage() {
  return (
    <AppShell>
      <Header title="AI Coach" />
      <div className="p-4 md:p-6 flex flex-col h-[calc(100vh-4rem-6rem)] md:h-[calc(100vh-4rem)]">
        {/* Chat header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-3 pb-5 border-b border-border mb-5"
        >
          <div className="relative">
            <div className="size-11 rounded-2xl bg-primary/15 flex items-center justify-center">
              <HugeiconsIcon icon={SparklesIcon} className="size-5 text-primary" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-green-500 ring-2 ring-background animate-pulse-dot" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm">PayPath AI</h3>
            <p className="text-xs text-muted-foreground">Online</p>
          </div>
        </motion.div>

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto space-y-4 pb-4">
          {/* AI message */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex gap-3 max-w-lg"
          >
            <div className="size-8 rounded-xl bg-primary/15 flex items-center justify-center shrink-0 mt-1">
              <HugeiconsIcon icon={SparklesIcon} className="size-3.5 text-primary" />
            </div>
            <div className="bg-muted/50 dark:bg-white/[0.04] rounded-2xl rounded-tl-md p-4">
              <p className="text-sm leading-relaxed">
                Hi! I&apos;m your personal financial coach. Ask me anything about budgeting, saving, or investing. I&apos;ll analyze your spending patterns and help you make smarter money decisions.
              </p>
            </div>
          </motion.div>

          {/* Sample user message */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="flex justify-end max-w-lg ml-auto"
          >
            <div className="bg-primary/10 dark:bg-primary/15 rounded-2xl rounded-tr-md p-4">
              <p className="text-sm leading-relaxed">
                How much should I be saving each month?
              </p>
            </div>
          </motion.div>

          {/* AI response */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="flex gap-3 max-w-lg"
          >
            <div className="size-8 rounded-xl bg-primary/15 flex items-center justify-center shrink-0 mt-1">
              <HugeiconsIcon icon={SparklesIcon} className="size-3.5 text-primary" />
            </div>
            <div className="bg-muted/50 dark:bg-white/[0.04] rounded-2xl rounded-tl-md p-4">
              <p className="text-sm leading-relaxed">
                A good rule of thumb is the <strong>50/30/20 rule</strong>: 50% for needs, 30% for wants, and 20% for savings. Based on your income of &#8358;380,000, that&apos;s about <strong>&#8358;76,000/month</strong> in savings!
              </p>
            </div>
          </motion.div>
        </div>

        {/* Suggested questions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap gap-2 pb-3"
        >
          {suggestedQuestions.map((q) => (
            <button
              key={q}
              className="text-xs font-medium text-primary bg-primary/10 hover:bg-primary/15 rounded-full px-3 py-1.5 transition-colors"
            >
              {q}
            </button>
          ))}
        </motion.div>

        {/* Input bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="flex items-center gap-2 bg-card rounded-2xl shadow-card dark:shadow-none dark:border dark:border-white/[0.06] p-2"
        >
          <Input
            placeholder="Ask your AI coach..."
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:border-0 h-10"
          />
          <button className="size-10 rounded-xl bg-primary flex items-center justify-center shrink-0 hover:bg-primary/85 transition-colors">
            <HugeiconsIcon icon={SentIcon} className="size-[18px] text-primary-foreground" />
          </button>
        </motion.div>
      </div>
    </AppShell>
  );
}
