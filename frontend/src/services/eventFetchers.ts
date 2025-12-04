//NOTE: this file will have the fetching functions that interact with the backend api, these functions will be used in useQueries to handle fetching data for different events for the components that need them
import axios from "axios";
import type { EventI } from "@/schemas/Events.interface";

// import the .env variable
const API_BASE_URL =
  // NOTE: This checks to make sure that the url does not equal to undefined and that it is the .env
  typeof import.meta !== "undefined" && "http://localhost:8000"
    ? // if it does then make the value the api
      "http://localhost:8000"
    : // if not set the value to the default
      "http://localhost:8000";

// function to get the featured events from the data base
export const getFeaturedEvents = async (): Promise<EventI[]> => {
  try {
    // TODO: UPDATE THE ROUTE TO HAVE THE "featured" TO GET THE featured SECTION ONCE THE ROUTE IS MADE
    const response = await axios.get<EventI[]>(`${API_BASE_URL}/events`);
    console.log("Featured events fetched successfully");
    // checks to see if the data is an array and if it is then return the data if not then return an empty array
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching featured events:", error);
    return [];
  }
};

export const getEventById = async (eventId: string): Promise<EventI | null> => {
  try {
    const response = await axios.get<EventI>(
      `${API_BASE_URL}/event/${eventId}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching event by id:", error);
    return null;
  }
};

// function to get popular events from the backend
export const getPopularEvents = async (): Promise<EventI[]> => {
  try {
    // get the data from the popular route in the backend
    const response = await axios.get<EventI[]>(
      `${API_BASE_URL}/events/popular`,
    );

    // check if the data is an array, return if it is, empty array if not
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching popular events:", error);
    return [];
  }
};

// function to get Categorized Events
// TODO: Add in pagination to switch pages to cycle through the events
// TODO: Add at later date test the routing to make sure that this is efficient
export const getCategoryEvents = async (
  categoryId: string, // categoryId passed in so and sent as a param to the backend
  search?: string, // optional parameter for users searchs
): Promise<EventI[]> => {
  // check if the categoryId is for "All" or if there is a search param
  if (categoryId === "0" && !search) {
    // run the function  to get the featured events and return them to the frontend
    return getFeaturedEvents();
  }
  // otherwise: get the data for the study events from the backend
  const response = await axios.get<EventI[]>(
    `${API_BASE_URL}/events/category/${categoryId}`,
    {
      // search: feild sent to the backend
      params: search ? { search } : undefined,
    },
  );

  // check the data to make sure its an array, return the data, if not then return an empty array
  return Array.isArray(response.data) ? response.data : [];
};
// function to get a specific event by id
export const getSpecificEvent = async (
  eventId: string | undefined,
): Promise<EventI> => {
  // check if the id is undefined
  if (typeof eventId === "undefined") {
    throw new Error("The eventId is undefined");
  }
  // otherwise return the data
  const response = await axios.get<EventI>(`${API_BASE_URL}/event/${eventId}`);
  return response.data;
};

// function to get events created by a specific user (host)
export const getUserCreatedEvents = async (
  hostId: string,
): Promise<EventI[]> => {
  try {
    const response = await axios.get<EventI[]>(
      `${API_BASE_URL}/events/host/${hostId}`,
    );
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching user created events:", error);
    return [];
  }
};

// interface for the backend response of attended events
export interface AttendedEventResponse {
  id: string;
  event_id: string;
  user_id: string;
  status: string;
  joined_at: string;
  events: {
    id: string;
    title: string | null;
    description: string | null;
    date: string | null;
    time: string | null;
    location: string | null;
    image_url: string | null;
    categories: { id: string; name: string; description: string } | null;
  };
}

// function to get events that a user has attended/registered for
export const getUserAttendedEvents = async (
  userId: string,
): Promise<AttendedEventResponse[]> => {
  try {
    const response = await axios.get<AttendedEventResponse[]>(
      `${API_BASE_URL}/events/attendee/${userId}`,
    );
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching user attended events:", error);
    return [];
  }
};