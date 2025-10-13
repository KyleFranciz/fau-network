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
// TODO: use the useParam function to help with the routing to the eventId page to when elements are clicked on the route to different pages

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
        path: "events/:eventId", // this is for the individual event page
        element: <EventDetailPage />,
      },
      {
        path: "login", // this is for the auth page (might combine the login and the signup page)
        element: <LoginPage />,
      },
      {
        path: "signup", // this is for the auth page (might combine the login and the signup page)
        element: <SignUpPage />,
      },
      {
        path: "profile", // this is for the profile page to edit the account information
        element: <ProfilePage />,
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
    <RouterProvider router={router} />
  </React.StrictMode>,
);
