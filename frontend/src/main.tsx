import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router";
import "./index.css";
import RootLayout from "./layouts/RootLayout";
import HomePage from "./pages/Home";
import EventsPage from "./pages/Events";
import EventDetailPage from "./pages/EventDetail";
import LoginPage from "./pages/Login";
import SignUpPage from "./pages/SignUp";
import ProfilePage from "./pages/Profile";
import NotFoundPage from "./pages/NotFound";
import AuthCallbackPage from "./pages/AuthCallback";
import CreateEventPage from "./pages/CreateEvent";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import EventChatPage from "./pages/EventChat";
import { Toaster } from "sonner";
// TODO: use the useParam function to help with the routing to the eventId page to when elements are clicked on the route to different pages

//NOTE: set up for the queryClient so that we can use useQuery to get data across the application

// TODO: add in <AuthProvider> component to wrap the route on so that the application can access the user

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      // route for the HomePage
      {
        index: true, // has an outlet to load different part of the HomePage that needs to be render
        element: <HomePage />,
      },
      {
        path: "events", // this for the event page
        element: <EventsPage />,
      },
      {
        path: "event/:eventId", // this is for the individual event page
        element: <EventDetailPage />,
      },
      { path: "event/:eventId/chat", element: <EventChatPage /> },
      {
        path: "login", // this is for the auth page (might combine the login and the signup page)
        element: <LoginPage />,
      },
      {
        path: "signup", // this is for the auth page (might combine the login and the signup page)
        element: <SignUpPage />,
      },
      {
        path: "auth/callback", // this is for handling email verification callback
        element: <AuthCallbackPage />,
      },
      {
        path: "profile", // this is for the profile page to edit the account information
        // TODO: take the user to login page if not signed in already
        element: <ProfilePage />,
      },
      {
        path: "events/create", // this is for creating a new event
        element: <CreateEventPage />,
      },
      {
        path: "*", // catch-all route for 404 pages
        element: <NotFoundPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
        {/* NOTE: Might change the position of the toaster that pops up */}
        <Toaster position="top-center" />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
