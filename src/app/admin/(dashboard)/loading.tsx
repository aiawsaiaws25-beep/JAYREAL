export default function AdminLoading() {
  return (
    <div className="space-y-8" role="status" aria-live="polite" aria-label="Loading">
      <div>
        <div className="h-3 w-24 animate-pulse bg-line" />
        <div className="mt-4 h-10 w-64 animate-pulse bg-line" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse border border-line bg-white" />
        ))}
      </div>
      <div className="h-80 animate-pulse border border-line bg-white" />
    </div>
  );
}
