import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function PublicLayout() {
  return (
    <div className="flex flex-col bg-white min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet /> {/* This is where the Home or Event Detail page will inject */}
      </main>
      <Footer />
    </div>
  );
}
