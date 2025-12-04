// mutation helpers for chat-related API calls

import axios from "axios";
import { API_BASE_URL } from "@/services/apiClient";
import type { SendEventMessageI } from "@/schemas/chats.interface";

// send a chat message to the backend route and return the server response
export const sendChatMessage = async (
  eventId: string | undefined,
  payload: SendEventMessageI,
) => {
  if (!eventId) {
    throw new Error("eventId is required to send chat messages");
  }

  const { data } = await axios.post<{ message: unknown }>(
    `${API_BASE_URL}/event/${eventId}/chat`,
    payload,
  );

  return data;
};
