import { Check, UserPlus } from "lucide-react";

interface EventImageProps {
  imageUrl?: string | null;
  title?: string | null;
  isRegistered?: boolean;
  isCheckingStatus?: boolean;
  isActionDisabled?: boolean;
  onRegister?: () => void;
  onUnregister?: () => void;
}

// NOTE: Dedicated hero visual for event details and quick registration state.
export default function EventImage({
  imageUrl,
  title,
  isRegistered = false,
  isCheckingStatus = false,
  isActionDisabled = false,
  onRegister,
  onUnregister,
}: EventImageProps) {
  const altText = title ? `${title} hero image` : "Event hero image";

  const isInRegisteredState = Boolean(isRegistered);
  const canShowButton = isInRegisteredState
    ? Boolean(onUnregister)
    : Boolean(onRegister);

  const handleButtonClick = (): void => {
    if (isActionDisabled || isCheckingStatus || !canShowButton) return;

    if (isInRegisteredState) {
      onUnregister?.();
    } else {
      onRegister?.();
    }
  };

  const buttonLabel = isInRegisteredState ? "Registered" : "Register";
  const buttonHelperText = isInRegisteredState
    ? "Tap to unregister"
    : "Save your spot";

  return (
    <div className="relative h-[700px] w-full overflow-hidden rounded-3xl">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={altText}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-3xl bg-muted text-lg font-semibold text-muted-foreground">
          Image coming soon
        </div>
      )}

      {canShowButton && (
        <button
          type="button"
          onClick={handleButtonClick}
          disabled={isActionDisabled || isCheckingStatus}
          className="absolute bottom-6 left-6 inline-flex items-center gap-3 rounded-2xl border border-white/20 bg-black/70 px-5 py-3 text-left text-white shadow-lg backdrop-blur transition hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-white">
            {isInRegisteredState ? (
              <Check className="h-5 w-5" aria-hidden="true" />
            ) : (
              <UserPlus className="h-5 w-5" aria-hidden="true" />
            )}
          </span>
          <span className="flex flex-col text-sm font-semibold leading-tight">
            {buttonLabel}
            <span className="text-xs font-normal text-white/70">
              {isActionDisabled || isCheckingStatus
                ? "Hang tight..."
                : buttonHelperText}
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
