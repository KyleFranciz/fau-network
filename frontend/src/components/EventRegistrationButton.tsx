interface EventRegistrationButtonProps {
  label?: string;
  onRegister?: () => void;
}

// NOTE: Might change out some of the components with shadcn component if I have time
export default function EventRegistrationButton({
  label = "Register",
  onRegister,
}: EventRegistrationButtonProps) {
  const handleClick = (): void => {
    onRegister?.();
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-7 shadow-sm">
      <p className="text-lg font-semibold text-foreground">
        Ready to join this event?
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        Reserve your spot now to make sure you don&apos;t miss out.
      </p>
      <button
        type="button"
        className="mt-6 w-full rounded-xl bg-primary px-4 py-3 text-base font-semibold text-primary-foreground transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        onClick={handleClick}
      >
        {label}
      </button>
    </div>
  );
}
