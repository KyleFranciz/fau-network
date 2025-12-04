import type { LucideIcon } from "lucide-react";

interface ActionCalloutCardProps {
  title?: string;
  description?: string;
  buttonLabel?: string;
  onAction?: () => void;
  icon?: LucideIcon;
}

export default function ActionCalloutCard({
  title = "Ready to get started?",
  description = "Choose an action to keep things moving forward.",
  buttonLabel = "Continue",
  onAction,
  icon: Icon,
}: ActionCalloutCardProps) {
  const handleClick = (): void => {
    onAction?.();
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-7 shadow-sm">
      <p className="text-lg font-semibold text-foreground">{title}</p>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      <button
        type="button"
        className="mt-6 w-full rounded-xl bg-primary px-4 py-3 text-base font-semibold text-primary-foreground transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        onClick={handleClick}
      >
        <span className="inline-flex w-full items-center justify-center gap-2">
          {Icon ? (
            // NOTE: input color for fill to change what color the logo is
            <Icon fill="white" className="h-4 w-4" aria-hidden="true" />
          ) : null}
          <span>{buttonLabel}</span>
        </span>
      </button>
    </div>
  );
}
