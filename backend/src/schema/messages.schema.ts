// schema for the event_message data that you get from the backend
export interface EventMessage {
  id: string;
  event_id: string;
  user_id: string;
  message: string;
  created_at: string;
  updated_at: string;
}

// schema for the event message body from the request
export interface EventMessageBody {
  event_id?: string; // might not be needed
  user_id: string; // users id
  message: string; // message from the user
}

// interface for the message route response
export interface EventMessageResponse {
  id: string;
  event_id: string;
  user_id: string;
  message: string;
  created_at: string;
  updated_at: string;
}
