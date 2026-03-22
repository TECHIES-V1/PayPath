"use client";

import { motion } from "motion/react";
import AppShell from "@/components/layout/AppShell";
import Header from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Target01Icon, ChartIcon, StarIcon, Add01Icon } from "@hugeicons/core-free-icons";

const benefits = [
  { icon: Target01Icon, title: "Track Progress", desc: "See how close you are to your goals" },
  { icon: ChartIcon, title: "Stay Motivated", desc: "Visual milestones keep you on track" },
  { icon: StarIcon, title: "Reach Targets", desc: "Achieve what matters most to you" },
];

export default function GoalsPage() {
  return (
    <AppShell>
      <Header title="Savings Goals" />
      <div className="p-4 md:p-6 space-y-5">
        {/* Motivational banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="bg-gradient-to-r from-primary/10 to-primary/[0.03] dark:from-primary/[0.08] dark:to-transparent border-0 dark:border dark:border-primary/10">
            <CardContent className="flex items-center gap-4">
              <div className="size-12 rounded-2xl bg-primary/15 flex items-center justify-center shrink-0">
                <HugeiconsIcon icon={Target01Icon} className="size-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base">Your savings journey starts here</h3>
                <p className="text-sm text-muted-foreground">Set goals, track progress, build your future</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Empty state */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          {/* Animated target illustration */}
          <div className="relative mb-8">
            <motion.div
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="size-28 rounded-full border-[3px] border-primary/20 flex items-center justify-center"
            >
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.15 }}
                className="size-20 rounded-full border-[3px] border-primary/30 flex items-center justify-center"
              >
                <div className="size-10 rounded-full bg-primary flex items-center justify-center">
                  <HugeiconsIcon icon={Target01Icon} className="size-5 text-primary-foreground" />
                </div>
              </motion.div>
            </motion.div>
          </div>

          <h3 className="text-xl font-display font-bold mb-2">Set your first goal</h3>
          <p className="text-sm text-muted-foreground max-w-xs mb-6 leading-relaxed">
            Track progress toward the things that matter most to you.
          </p>
          <Button size="lg" className="rounded-xl">
            <HugeiconsIcon icon={Add01Icon} className="size-4" />
            Create a Goal
          </Button>
        </motion.div>

        {/* Benefit cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
            >
              <Card size="sm">
                <CardContent className="flex flex-col items-center text-center gap-2">
                  <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <HugeiconsIcon icon={b.icon} className="size-5 text-primary" />
                  </div>
                  <h4 className="text-sm font-display font-semibold">{b.title}</h4>
                  <p className="text-xs text-muted-foreground">{b.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
