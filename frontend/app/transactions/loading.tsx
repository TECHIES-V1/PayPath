export default function TransactionsLoading() {
  return (
    <div className="p-4 md:p-6 space-y-5 max-w-4xl mx-auto" role="status" aria-label="Loading transactions">
      <div className="h-6 w-40 rounded-lg skeleton" />
      <div className="h-10 rounded-xl skeleton" />
      <div className="space-y-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-16 rounded-xl skeleton" />
        ))}
      </div>
    </div>
  );
}
