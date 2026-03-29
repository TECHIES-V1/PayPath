export default function DashboardLoading() {
  return (
    <div className="p-4 md:p-6 space-y-5" role="status" aria-label="Loading dashboard">
      <div className="space-y-2">
        <div className="h-6 w-48 rounded-lg skeleton" />
        <div className="h-4 w-32 rounded-lg skeleton" />
      </div>
      <div className="h-48 rounded-3xl skeleton" />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 h-64 rounded-2xl skeleton" />
        <div className="lg:col-span-2 space-y-4">
          <div className="h-28 rounded-2xl skeleton" />
          <div className="h-28 rounded-2xl skeleton" />
        </div>
      </div>
      <div className="h-56 rounded-2xl skeleton" />
    </div>
  );
}
