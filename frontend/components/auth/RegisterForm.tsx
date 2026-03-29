"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Mail01Icon, LockPasswordIcon, UserCircleIcon } from "@hugeicons/core-free-icons";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.15 },
  },
};
const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function RegisterForm() {
  const router = useRouter();
  const { register, isLoading, error, clearError } = useAuthStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters");
      return;
    }

    try {
      await register(name, email, password);
      router.push("/dashboard");
    } catch {
      // error is set in the store
    }
  };

  const displayError = localError || error;

  // Password strength
  const strength = useMemo(() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 6) s++;
    if (password.length >= 10) s++;
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  }, [password]);
  const strengthColors = ["bg-destructive", "bg-orange-400", "bg-yellow-400", "bg-primary"];
  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.15 }}
    >
      <div className="bg-card rounded-2xl px-4 py-6 md:p-8 shadow-card dark:shadow-none dark:border dark:border-white/[0.06]">
        <div className="space-y-2 mb-8">
          <h2 className="text-xl md:text-2xl font-display font-bold">Create your account</h2>
          <p className="text-xs md:text-sm text-muted-foreground">Start your financial journey with PayPath</p>
        </div>

        <form onSubmit={handleSubmit}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-5"
          >
            {displayError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                role="alert"
                className="rounded-xl bg-destructive/10 p-3.5 text-sm text-destructive"
              >
                {displayError}
                <button
                  type="button"
                  onClick={() => { setLocalError(""); clearError(); }}
                  className="ml-2 font-semibold underline underline-offset-2"
                >
                  Dismiss
                </button>
              </motion.div>
            )}

            <motion.div variants={itemVariants} className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <HugeiconsIcon icon={UserCircleIcon} className="absolute left-3.5 top-1/2 -translate-y-1/2 size-[18px] text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="pl-11"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <HugeiconsIcon icon={Mail01Icon} className="absolute left-3.5 top-1/2 -translate-y-1/2 size-[18px] text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-11"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <HugeiconsIcon icon={LockPasswordIcon} className="absolute left-3.5 top-1/2 -translate-y-1/2 size-[18px] text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-11"
                />
              </div>
              {password && (
                <div className="flex items-center gap-2 pt-1">
                  <div className="flex gap-1 flex-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${i < strength ? strengthColors[strength - 1] : "bg-muted"
                          }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-muted-foreground font-medium">
                    {strength > 0 ? strengthLabels[strength - 1] : ""}
                  </span>
                </div>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <HugeiconsIcon icon={LockPasswordIcon} className="absolute left-3.5 top-1/2 -translate-y-1/2 size-[18px] text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="pl-11"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Button type="submit" size="lg" className="w-full rounded-xl text-sm" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </motion.div>

            <motion.div variants={itemVariants} className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <span className="relative bg-card px-3 text-xs text-muted-foreground">or</span>
            </motion.div>

            <motion.p variants={itemVariants} className="text-center text-xs md:text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-primary hover:underline underline-offset-2">
                Sign in
              </Link>
            </motion.p>
          </motion.div>
        </form>
      </div>
    </motion.div>
  );
}
