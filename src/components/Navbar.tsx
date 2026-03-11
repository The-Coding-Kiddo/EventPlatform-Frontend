import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center bg-white px-6 md:px-12 py-4 border-gray-100 border-b">
      <Link to="/" className="font-bold text-gray-900 text-2xl tracking-tight">
        TechEvent<span className="text-blue-600">.</span>
      </Link>

      <div className="hidden md:flex items-center space-x-8">
        <Link to="/" className="font-medium text-gray-900 transition duration-300">
          Home
        </Link>
        <Link to="/events" className="font-medium text-gray-500 hover:text-gray-900 transition duration-300">
          Events
        </Link>
        <Link to="/contact" className="font-medium text-gray-500 hover:text-gray-900 transition duration-300">
          Contact
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <Link to="/login" className="px-5 py-2 border border-gray-200 rounded-full font-medium text-gray-700 hover:text-blue-600 transition duration-300">
          Login
        </Link>
        <Link to="/register" className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-full font-medium text-white transition duration-300">
          Sign Up
        </Link>
      </div>
    </nav>
  );
}
