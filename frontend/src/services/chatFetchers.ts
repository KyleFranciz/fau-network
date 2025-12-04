// file to get the fetch the chat data that may be needed

import axios from "axios";
import { API_BASE_URL } from "@/services/apiClient";
import type { EventMessagesWithUserInfo } from "@/schemas/chats.interface";

export { API_BASE_URL };

// function to fetch the chat using the eventId
export const getChatMessages = async (
  eventId: string | undefined,
): Promise<EventMessagesWithUserInfo[]> => {
  // guard clause keeps the API shape predictable for callers
  if (!eventId) {
    throw new Error("eventId is required to fetch chat messages");
  }

  try {
    // backend wraps the rows in { messages: [...] } so unpack that shape here
    const { data } = await axios.get<{
      messages: EventMessagesWithUserInfo[];
    }>(`${API_BASE_URL}/event/${eventId}/chat`);

    // default to an empty array so the UI can continue rendering gracefully
    return data?.messages ?? [];
  } catch (err) {
    // let React Query handle retries/loading while still logging the failure
    console.error("There was an internal error on the fetch", err);
    throw err;
  }
};
