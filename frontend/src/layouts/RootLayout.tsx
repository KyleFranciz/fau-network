import { Link, Outlet } from "react-router";

export default function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b max-w-7xl w-full mx-auto px-6 mt-4 sticky top-4  py-4 z-100 rounded-4xl bg-white/30 backdrop-blur-md border-b border-white/20 shadow-sm">
        <div className="mx-auto">
          {/* WARNING: EVERY THING BELLOW SHOULD BE EDITED IF WORKING ON THE NAVBAR COMPONENT */}
          {/* NOTE: The link components will be used to route to other pages in the app, best to use in the navbar */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">NETWORK</h1>
            <nav className="flex items-center gap-6">
              <Link
                to="/"
                className="text-lg font-semibold text-gray-800 transition-colors hover:text-gray-900"
              >
                Home
              </Link>
              <Link
                to="/events"
                className="text-lg font-semibold text-gray-800 transition-colors hover:text-gray-900"
              >
                Events
              </Link>
              <Link
                to="/login"
                className="text-lg font-semibold text-gray-800 transition-colors hover:text-gray-900"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-lg font-semibold text-gray-800 transition-colors hover:text-gray-900"
              >
                Sign Up
              </Link>
              <Link
                to="/profile"
                className="text-lg font-semibold text-gray-800 transition-colors hover:text-gray-900"
              >
                Profile
              </Link>
            </nav>
          </div>
          {/* WARNING: EVERY THING BELLOW SHOULD BE EDITED IF WORKING ON THE NAVBAR COMPONENT */}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="mx-auto flex justify-center">
          {/* WARNING: THIS PART IS FOR THE DIFFERENT PAGE COMPONENTS TO RENDER OUT */}
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      {/* WARNING: THIS PART IS TO EDIT FOR THE FOOTER COMPONENT */}
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
