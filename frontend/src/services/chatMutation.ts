// mutation helpers for chat-related API calls

import type { SendEventMessageI } from "@/schemas/chats.interface";
import axios from "axios";

const API_BASE_URL =
  // NOTE: This checks to make sure that the url does not equal to undefined and that it is the .env
  typeof import.meta !== "undefined" && "http://localhost:8000"
    ? // if it does then make the value the api
      "http://localhost:8000"
    : // if not set the value to the default
      "http://localhost:8000";

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
