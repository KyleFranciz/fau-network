import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export interface ChatMessageData {
  id: string;
  senderName: string;
  content: string;
  timestamp: string;
  avatarUrl?: string;
  isCurrentUser?: boolean;
}

interface ChatMessageProps {
  message: ChatMessageData;
  formattedTimestamp: string;
}

export function ChatMessage({ message, formattedTimestamp }: ChatMessageProps) {
  const { isCurrentUser } = message;

  return (
    <div
      className={cn(
        "flex w-full items-end gap-3",
        isCurrentUser ? "flex-row-reverse text-right" : "text-left",
      )}
    >
      {/* Avatar Styling */}
      <Avatar className="h-10 w-10 rounded-3xl border border-border">
        <AvatarImage src={message.avatarUrl} alt={message.senderName} />
        <AvatarFallback>
          {message.senderName
            .split(" ")
            .map((name) => name[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()}
        </AvatarFallback>
      </Avatar>
      {/* NOTE: styling for the message bubbles */}
      <div
        className={cn(
          "flex max-w-[75%] flex-col",
          isCurrentUser ? "items-end" : "items-start",
        )}
      >
        <span className="text-xs text-muted-foreground">
          {isCurrentUser ? "You" : message.senderName} • {formattedTimestamp}
        </span>
        <div
          className={cn(
            "mt-1 rounded-2xl px-4 py-2 text-sm shadow-sm",
            isCurrentUser // for the users and the other attendees message color
              ? "rounded-br-sm bg-blue-500 text-primary-foreground"
              : "rounded-bl-sm bg-muted",
          )}
        >
          {message.content}
        </div>
      </div>
    </div>
  );
}
