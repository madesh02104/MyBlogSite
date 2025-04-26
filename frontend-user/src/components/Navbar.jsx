import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-gray-900 text-white p-4 flex items-center justify-between">
      {/* Left Side */}
      <div className="flex items-center gap-4">
        <Link to="/" className="hover:text-gray-300">
          Home
        </Link>
        <Link to="/about" className="hover:text-gray-300">
          About
        </Link>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        <Link to="/login" className="hover:text-gray-300">
          Login
        </Link>
        <Link to="/register" className="hover:text-gray-300">
          Register
        </Link>
        <a
          href="http://localhost:5174"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-300"
        >
          Admin Dashboard
        </a>

        {/* Profile Circle (When Logged In) */}
        {/* We'll conditionally render this later after setting up Auth Context */}
      </div>
    </nav>
  );
}

export default Navbar;
