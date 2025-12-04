import { cn } from "@/lib/utils";

interface ChatBubbleLoaderProps {
  bubbles?: number;
}

export function ChatBubbleLoader({ bubbles = 3 }: ChatBubbleLoaderProps) {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="flex flex-col gap-5"
      role="status"
    >
      {Array.from({ length: bubbles }).map((_, index) => {
        const isCurrentUser = index % 2 === 1;

        return (
          <div
            key={index}
            className={cn(
              "flex w-full items-end gap-3",
              isCurrentUser ? "flex-row-reverse" : "",
            )}
          >
            <div className="h-10 w-10 rounded-3xl border border-border bg-muted animate-pulse" />
            <div
              className={cn(
                "flex max-w-[75%] flex-col gap-2",
                isCurrentUser ? "items-end" : "items-start",
              )}
            >
              <div className="h-3 w-20 rounded-full bg-muted-foreground/20 animate-pulse" />
              <div
                className={cn(
                  "h-14 w-full rounded-2xl bg-muted animate-pulse",
                  isCurrentUser ? "rounded-br-sm" : "rounded-bl-sm",
                )}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
