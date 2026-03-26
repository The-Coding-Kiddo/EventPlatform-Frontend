import { Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { User } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
        {isAuthenticated ? (
          // IF TRUE: Show the Avatar and Dropdown
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex justify-center items-center bg-gray-100 hover:bg-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 w-10 h-10 transition"
            >
              <User className="w-5 h-5 text-gray-600" />
            </button>

            {isDropdownOpen && (
              <div className="right-0 z-50 absolute bg-white shadow-lg mt-2 py-2 border border-gray-100 rounded-xl w-56">
                <div className="mb-1 px-4 py-3 border-gray-50 border-b">
                  <p className="font-semibold text-gray-900 text-sm truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-gray-500 text-xs truncate">{user?.email}</p>
                </div>

                <Link
                  to="/profile"
                  onClick={() => setIsDropdownOpen(false)}
                  className="block hover:bg-gray-50 px-4 py-2 text-gray-700 text-sm transition"
                >
                  My Profile
                </Link>

                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    logout();
                  }}
                  className="block hover:bg-red-50 mt-1 px-4 py-2 pt-2 border-gray-50 border-t w-full text-red-600 text-sm text-left transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          // IF FALSE: Show the standard guest UI
          <>
            <Link to="/login" className="px-5 py-2 border border-gray-200 rounded-full font-medium text-gray-700 hover:text-blue-600 transition duration-300">
              Login
            </Link>
            <Link to="/register" className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-full font-medium text-white transition duration-300">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
