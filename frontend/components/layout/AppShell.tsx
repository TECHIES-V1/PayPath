"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="md:pl-64">
        <AnimatePresence mode="wait">
          <motion.main
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="pb-24 md:pb-0"
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
      <BottomNav />
    </div>
  );
}
