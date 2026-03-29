"use client";

import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";
import AuthGuard from "@/components/auth/AuthGuard";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <div className="md:pl-64">
          <main className="pb-24 md:pb-0">
            {children}
          </main>
        </div>
        <BottomNav />
      </div>
    </AuthGuard>
  );
}
