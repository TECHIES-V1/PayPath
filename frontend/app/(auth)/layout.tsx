"use client";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-primary">PayPath</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your AI-powered financial coach
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
