// This file will have the chat interfaces that are needed for messaging

// interface for the event messages gotten from the backend
export interface EventMessagesWithUserInfo {
  id: string; // message id
  event_id: string; // event_id to help link all the chats to their events
  user_id?: string; // user_id so we know who sent the messages
  message: string; // message that the user is sending
  created_at: string; // data and time that the message was created at
  updated_at: string | null;
  users: MessageUser | null;
}

// interface for the user data that is gotten for each message
export interface MessageUser {
  full_name: string | null;
  profile_image: string | null;
}

// interface for getting the chat message data from the backend
export interface ChatMessageData {
  id: string;
  senderName: string;
  content: string;
  timestamp: string;
  avatarUrl?: string;
  isCurrentUser?: boolean;
}

// interface for sending event messages to the backend
export interface SendEventMessageI {
  user_id: string;
  message: string;
}
