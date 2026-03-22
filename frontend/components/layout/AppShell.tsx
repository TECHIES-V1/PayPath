"use client";

import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="md:pl-64">
        <main className="pb-20 md:pb-0">{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}
