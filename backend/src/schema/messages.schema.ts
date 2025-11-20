// schema for the event_message data that you get from the backend
export interface EventMessageWithUser {
  id: string;
  event_id: string;
  user_id?: string; // optional: to help with message validation on the frontend
  message: string;
  created_at: string;
  update_at?: string | null; // optional: might add in editting message funcitonality
  users: MessageUser[] | null; // info on all the users in the event
}

// regular event message
export interface EventMessage {
  id: string;
  event_id: string;
  user_id: string; // optional: to allow the incase I just want to send the userId instead later on
  message: string;
  created_at: string;
  updated_at?: string;
}

// interface for the query to get the users profile data for messages
export interface MessageUser {
  full_name: string | null;
  profile_image: string | null;
}

// schema for the event message body sent in from the request
export interface EventMessageBody {
  event_id?: string; // might not be needed
  user_id: string; // users id
  message: string; // message from the user
}

// interface for the message data thats sent out back to the frontend
export interface EventMessageResponse {
  id: string;
  event_id: string;
  user_id: string;
  message: string;
  created_at: string;
  updated_at: string;
}
