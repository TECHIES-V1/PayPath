export default function GoalsLoading() {
  return (
    <div className="p-4 md:p-6 space-y-5 max-w-4xl mx-auto" role="status" aria-label="Loading goals">
      <div className="h-6 w-36 rounded-lg skeleton" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-40 rounded-2xl skeleton" />
        ))}
      </div>
    </div>
  );
}
