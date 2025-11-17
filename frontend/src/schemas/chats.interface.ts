// This file will have the chat interfaces that are needed for messaging

// interface for the event messages
export interface EventMessagesI {
  id: string; // message id
  event_id: string; // event_id to help link all the chats to their events
  user_id: string; // user_id so we know who sent the messages
  message: string; // message that the user is sending
  created_at: Date; // data and time that the message was created at
}
