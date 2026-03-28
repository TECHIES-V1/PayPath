"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Mail01Icon, LockPasswordIcon } from "@hugeicons/core-free-icons";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginForm() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch {
      // error is set in the store
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.15 }}
    >
      <div className="bg-card rounded-2xl px-4 py-6 md:p-8 shadow-card dark:shadow-none dark:border dark:border-white/[0.06]">
        <div className="space-y-2 mb-8">
          <h2 className="text-xl md:text-2xl font-display font-bold">Welcome back</h2>
          <p className="text-xs md:text-sm text-muted-foreground">Sign in to your PayPath account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="rounded-xl bg-destructive/10 p-3.5 text-sm text-destructive"
            >
              {error}
              <button
                type="button"
                onClick={clearError}
                className="ml-2 font-semibold underline underline-offset-2"
              >
                Dismiss
              </button>
            </motion.div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <HugeiconsIcon icon={Mail01Icon} className="absolute left-3.5 top-1/2 -translate-y-1/2 size-[18px] text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <HugeiconsIcon icon={LockPasswordIcon} className="absolute left-3.5 top-1/2 -translate-y-1/2 size-[18px] text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-11"
              />
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full rounded-xl text-sm" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <span className="relative bg-card px-3 text-xs text-muted-foreground">or</span>
          </div>

          <p className="text-center text-xs md:text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-primary hover:underline underline-offset-2">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </motion.div>
  );
}
