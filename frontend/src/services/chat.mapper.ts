// this is to help structure the data from the backend to the frontend so that the data is structured better for the UI

import type {
  ChatMessageData,
  EventMessagesWithUserInfo,
} from "@/schemas/chats.interface";

export function mapMessagesToChatData(
  messages: EventMessagesWithUserInfo[],
  currentUserId?: string,
): ChatMessageData[] {
  return messages.map((msg) => ({
    id: msg.id,
    senderName: msg.users?.full_name ?? "Unknown user",
    content: msg.message,
    timestamp: msg.created_at,
    avatarUrl: msg.users?.profile_image ?? undefined,
    isCurrentUser: currentUserId ? msg.user_id === currentUserId : false,
  }));
}
