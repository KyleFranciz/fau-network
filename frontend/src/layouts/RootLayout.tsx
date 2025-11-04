import { Outlet } from "react-router";
import Navbar from "../components/Navbar";

export default function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* Main Content */}
      <main className="flex-1">
        <div className="mx-auto flex justify-center">
          {/* WARNING: THIS PART IS FOR THE DIFFERENT PAGE COMPONENTS TO RENDER OUT */}
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      {/* WARNING: THIS PART IS TO EDIT FOR THE FOOTER COMPONENT */}
      {/* TODO: UPDATE THE FOOTER TO HAVE THE FOOTER COMPONENT ACROSS THE WHOLE APP LAYOUT  */}
      <footer className="border-t bg-gray-50">
        <div className="mx-auto py-6">
          <p className="text-center text-sm text-gray-600">
            &copy; 2025 Campus Event Planner
          </p>
        </div>
      </footer>
      {/* WARNING: EDIT IN BETWEEN FOR THE FOOTER */}
    </div>
  );
}
