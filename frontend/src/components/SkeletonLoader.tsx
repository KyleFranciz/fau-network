import { cn } from "@/lib/utils";

interface SkeletonLoaderProps {
  lines?: number;
  withImage?: boolean;
  className?: string;
}

export default function SkeletonLoader({
  lines = 3,
  withImage = false,
  className,
}: SkeletonLoaderProps) {
  const lineWidths = ["w-3/4", "w-full", "w-2/3", "w-1/2"];

  return (
    <div
      className={cn("animate-pulse rounded-2xl bg-card p-5", className)}
      aria-label="Loading content"
    >
      {withImage && <div className="mb-4 h-40 w-full rounded-xl bg-muted" />}
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              "h-4 rounded bg-muted",
              lineWidths[index % lineWidths.length],
            )}
          />
        ))}
      </div>
    </div>
  );
}
