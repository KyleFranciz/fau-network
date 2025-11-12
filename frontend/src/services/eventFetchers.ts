//NOTE: this file will have the fetching functions that interact with the backend api, these functions will be used in useQueries to handle fetching data for different events for the components that need them
import axios from "axios";
import type { EventI } from "@/schemas/Events.interface";

// import the .env variable
const API_BASE_URL =
  // NOTE: This checks to make sure that the url does not equal to undefined and that it is the .env
  typeof import.meta !== "undefined" && import.meta.env.VITE_API_URL
    ? // if it does then make the value the api
      import.meta.env.VITE_API_URL
    : // if not set the value to the default
      "http://localhost:8000";

// function to get the featured events from the data base
export const getFeaturedEvents = async (): Promise<EventI[]> => {
  // TODO: UPDATE THE ROUTE TO HAVE THE "featured" TO GET THE featured SECTION ONCE THE ROUTE IS MADE
  const response = await axios.get<EventI[]>(`${API_BASE_URL}/events`);
  // checks to see if the data is an array and if it is then return the data if not then return an empty array
  return Array.isArray(response.data) ? response.data : [];
};

// function to get popular events from the backend
export const getPopularEvents = async (): Promise<EventI[]> => {
  // get the data from the popular route in the backend
  const response = await axios.get<EventI[]>(`${API_BASE_URL}/events/popular`);

  // check if the data is an array, return if it is, empty array if not
  return Array.isArray(response.data) ? response.data : [];
};

// function to get Categorized Events
// TODO: Add in pagination to switch pages to cycle through the events
// TODO: Add at later date test the routing to make sure that this is efficient
export const getCategoryEvents = async (
  categoryId: string, // categoryId passed in so and sent as a param to the backend
): Promise<EventI[]> => {
  // check if the categoryId is for "All"
  if (categoryId === "0") {
    // run the function  to get the featured events and return them to the frontend
    return getFeaturedEvents();
  }
  // otherwise: get the data for the study events from the backend
  const response = await axios.get<EventI[]>(
    `${API_BASE_URL}/events/category/${categoryId}`,
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
  const response = await axios.get<EventI>(`${API_BASE_URL}/events/${eventId}`);
  return response.data;
};
