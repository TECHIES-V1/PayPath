"use client";

import dynamic from "next/dynamic";
import { motion } from "motion/react";

const Antigravity = dynamic(() => import("@/components/ui/antigravity"), { ssr: false });

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Left branding panel — desktop only */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden bg-[oklch(0.13_0.005_0)] items-center justify-center p-12">
        {/* Antigravity particle background */}
        <div className="absolute inset-0 z-0">
          <Antigravity
            count={300}
            magnetRadius={6}
            ringRadius={7}
            waveSpeed={0.4}
            waveAmplitude={1}
            particleSize={1.5}
            lerpSpeed={0.05}
            color="#BFFF00"
            autoAnimate
            particleVariance={1}
            rotationSpeed={0}
            depthFactor={1}
            pulseSpeed={3}
            particleShape="capsule"
            fieldStrength={10}
          />
        </div>

        {/* Content overlay */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-center space-y-6 pointer-events-none"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="size-12 rounded-2xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-xl">P</span>
            </div>
            <h1 className="text-4xl font-display font-bold text-white">PayPath</h1>
          </div>
          <p className="text-lg text-white/60 max-w-sm mx-auto leading-relaxed">
            Take control of your money with AI-powered financial coaching
          </p>

          {/* Mock dashboard card preview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 bg-white/[0.06] backdrop-blur-sm rounded-3xl p-6 max-w-xs mx-auto border border-white/[0.06]"
          >
            <div className="text-left space-y-3">
              <p className="text-white/40 text-xs font-medium uppercase tracking-wider">Total Balance</p>
              <p className="text-3xl font-display font-bold text-white">&#8358;245,000</p>
              <div className="flex gap-3 mt-3">
                <span className="text-xs text-primary bg-primary/15 rounded-full px-3 py-1 font-medium">+&#8358;380k income</span>
                <span className="text-xs text-red-400 bg-red-400/15 rounded-full px-3 py-1 font-medium">-&#8358;135k spent</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="w-full max-w-md space-y-8"
        >
          {/* Mobile-only branding */}
          <div className="text-center lg:hidden">
            <div className="inline-flex items-center gap-2.5 mb-2">
              <div className="size-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-lg">P</span>
              </div>
              <h1 className="text-2xl font-display font-bold">PayPath</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Your AI-powered financial coach
            </p>
          </div>
          {children}
        </motion.div>
      </div>
    </div>
  );
}
