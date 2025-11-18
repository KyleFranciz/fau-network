export default function ActionCalloutCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-7 shadow-sm">
      <div className="h-6 w-2/3 animate-pulse rounded bg-muted" />
      <div className="mt-3 h-4 w-full animate-pulse rounded bg-muted" />
      <div className="mt-1 h-4 w-5/6 animate-pulse rounded bg-muted" />
      <div className="mt-6 h-12 w-full animate-pulse rounded-xl bg-muted" />
    </div>
  );
}
