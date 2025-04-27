import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUsername(user.username || "Admin");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="bg-gray-800 text-white h-screen w-64 flex flex-col shadow-xl fixed left-0 top-0">
      {/* Header */}
      <div className="p-5 border-b border-gray-700">
        <h1 className="text-xl font-bold">
          Blog <span className="text-violet-400">Admin</span>
        </h1>
      </div>

      {/* User profile */}
      <div className="p-5 border-b border-gray-700 flex items-center space-x-3">
        <div className="bg-violet-700 w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold">
          {username.charAt(0).toUpperCase()}
        </div>
        <div className="flex flex-col">
          <span className="font-medium">{username}</span>
          <span className="text-xs text-gray-400">Administrator</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-5 flex-grow">
        <p className="text-xs uppercase text-gray-500 font-semibold mb-3">
          Main
        </p>
        <ul className="space-y-2">
          <li>
            <Link
              to="/"
              className={`flex items-center space-x-2 py-2 px-3 rounded-md ${
                location.pathname === "/"
                  ? "bg-violet-700"
                  : "hover:bg-gray-700"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              to="/create"
              className={`flex items-center space-x-2 py-2 px-3 rounded-md ${
                location.pathname === "/create"
                  ? "bg-violet-700"
                  : "hover:bg-gray-700"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>New Post</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-5 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 text-gray-400 hover:text-white w-full py-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm7 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm1 4a1 1 0 102 0 1 1 0 00-2 0z"
              clipRule="evenodd"
            />
            <path d="M9 14a1 1 0 100-2 1 1 0 000 2z" />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
