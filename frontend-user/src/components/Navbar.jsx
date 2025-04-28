import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get user information from localStorage
    const user = localStorage.getItem("user");
    if (user && localStorage.getItem("token")) {
      setIsLoggedIn(true);
      setUsername(user);
    } else {
      setIsLoggedIn(false);
      setUsername("");
    }
  }, [location]);

  useEffect(() => {
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
    setIsLoggedIn(false);
    setDropdownOpen(false);
    navigate("/");
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex items-center justify-between shadow-md">
      {/* Left Side */}
      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="hover:text-violet-400 transition-colors duration-200 font-medium"
        >
          Home
        </Link>
        <a
          href="https://madesh-blogs-admin.netlify.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-violet-400 transition-colors duration-200 font-medium"
        >
          Admin Dashboard
        </a>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {isLoggedIn ? (
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
        ) : (
          <>
            <Link
              to="/login"
              className="hover:text-violet-400 transition-colors duration-200 font-medium"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-violet-700 hover:bg-violet-600 px-4 py-2 rounded-md transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
