import { queryClient } from "@/lib/queryClient"; // used to make prefetches for the routing in the navbar
import { eventPagePrefetcher } from "@/prefetchers/eventPagePrefetcher";
import { homePagePrefetcher } from "@/prefetchers/homePagePrefetcher";
import { Link } from "react-router";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

export default function Navbar() {
  // check the auth state
  const { user, loading } = useAuth();
  const handleSignOut = async (): Promise<void> => {
    try {
      await signOut();
    } catch (error) {
      console.error("Failed to sign out", error);
    }
  };
  return (
    <nav className="border-b max-w-7xl w-full mx-auto px-6 mt-4 sticky top-4  py-4 z-100 rounded-4xl bg-white/25 backdrop-blur-sm border-white/20 shadow-sm">
      <div className="mx-auto">
        {/* TODO: add in an avatar component to hold house the avatar image of the user */}
        {/* TODO: MAKE SURE THAT WHEN THE PAGE IS NAVIGATED TO THE PAGE STARTS AT THE TOP */}
        {/* WARNING: EVERY THING BELLOW SHOULD BE EDITED IF WORKING ON THE NAVBAR COMPONENT */}
        {/* NOTE: The link components will be used to route to other pages in the app, best to use in the navbar */}
        <div className="flex items-center">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">NETWORK</h1>
          </div>
          <nav className="flex items-center gap-6">
            <Link
              to="/"
              className="text-lg font-semibold text-gray-800 transition-colors hover:text-gray-900"
              // NOTE: Added in a prefetcher to get homepage data when hovering on the homepage
              onMouseEnter={() => homePagePrefetcher(queryClient)}
            >
              Home
            </Link>
            <Link
              to="/events"
              className="text-lg font-semibold text-gray-800 transition-colors hover:text-gray-900"
              onMouseEnter={() => eventPagePrefetcher(queryClient)}
            >
              Events
            </Link>
            <Link
              to="/profile"
              className="text-lg font-semibold text-gray-800 transition-colors hover:text-gray-900"
            >
              Profile
            </Link>
          </nav>
          <div className="flex-1 flex justify-end items-center gap-4">
            {loading ? (
              <div
                className="h-10 w-28 rounded-3xl bg-gray-200 animate-pulse"
                aria-hidden="true"
              />
            ) : user ? (
              <div className="flex items-center ">
                {/* NOTE: User avatar and signout appear if the user is signed in  */}
                <Avatar className="mr-3">
                  <AvatarImage />
                  <AvatarFallback>Logo</AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="px-5 py-1 bg-black text-white rounded-3xl font-semibold text-lg transition-colors hover:bg-gray-800"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-5 py-1 bg-black text-white rounded-3xl font-semibold text-lg transition-colors hover:bg-gray-800"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-3 py-1 bg-black text-white rounded-3xl font-semibold text-lg transition-colors hover:bg-gray-800"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
        {/* WARNING: EVERY THING ABOVE SHOULD BE EDITED IF WORKING ON THE NAVBAR COMPONENT */}
      </div>
    </nav>
  );
}
