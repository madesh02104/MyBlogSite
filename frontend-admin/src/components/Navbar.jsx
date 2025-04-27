import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userSiteUrl, setUserSiteUrl] = useState("#"); // Default fallback value
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const username =
    JSON.parse(localStorage.getItem("user"))?.username || "Admin";

  useEffect(() => {
    // Fetch user site URL from backend config if available
    const fetchUserSiteUrl = async () => {
      try {
        const response = await axios.get("/config");
        if (response.data && response.data.userUrl) {
          setUserSiteUrl(response.data.userUrl);
        }
      } catch (error) {
        console.log("Using default user site URL");
        // If API not available, use fallback from environment variables at build time
        setUserSiteUrl(
          import.meta.env.VITE_USER_URL || "http://localhost:5174"
        );
      }
    };

    fetchUserSiteUrl();

    // Rest of the existing effect code
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-xl font-bold text-white">
          Blog <span className="text-violet-400">Admin</span>
        </Link>

        <Link
          to="/"
          className="hover:text-violet-400 transition-colors duration-200 font-medium"
        >
          Dashboard
        </Link>

        <Link
          to="/create"
          className="hover:text-violet-400 transition-colors duration-200 font-medium"
        >
          New Post
        </Link>

        <a
          href={userSiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-violet-400 transition-colors duration-200 font-medium"
        >
          View Blog
        </a>
      </div>

      {/* User dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="bg-violet-700 hover:bg-violet-600 w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 transform hover:scale-105"
        >
          {username.charAt(0).toUpperCase()}
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg py-1 z-10 border border-gray-600">
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-white hover:bg-violet-700 transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
