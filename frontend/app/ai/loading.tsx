export default function AILoading() {
  return (
    <div className="p-4 md:p-6 space-y-4" role="status" aria-label="Loading AI coach">
      <div className="h-6 w-32 rounded-lg skeleton" />
      <div className="flex-1 space-y-3">
        <div className="h-16 w-3/4 rounded-2xl skeleton" />
        <div className="h-16 w-1/2 rounded-2xl skeleton ml-auto" />
        <div className="h-16 w-2/3 rounded-2xl skeleton" />
      </div>
      <div className="h-12 rounded-xl skeleton" />
    </div>
  );
}
