import { Outlet, useLocation } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "@/pages/homeComponents/Footer";

export default function RootLayout() {
  // NOTE: To help with rendering certain components on certain pages
  const location = useLocation();
  const isHomePage = location.pathname === "/";

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

      {/* Use the full footer on every page except the home page, which provides its own */}
      {!isHomePage && <Footer />}
    </div>
  );
}
