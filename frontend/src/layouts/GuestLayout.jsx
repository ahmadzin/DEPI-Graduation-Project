import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function GuestLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Navbar />
      <main className="pt-4 pb-16">
        <Outlet />
      </main>
    </div>
  );
}
