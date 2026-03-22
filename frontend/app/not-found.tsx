import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center space-y-6 max-w-sm">
        <div className="space-y-2">
          <h1 className="text-7xl font-display font-bold text-primary">404</h1>
          <h2 className="text-xl font-display font-bold">Page not found</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center h-12 px-6 rounded-xl bg-primary text-primary-foreground text-base font-semibold hover:bg-primary/85 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
