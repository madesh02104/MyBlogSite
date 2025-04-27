import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

function LoginPage({ setIsAuthenticated, setIsAdmin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await axios.post("/auth/login", { email, password });
      const { token, isAdmin, ...userData } = response.data;

      if (!isAdmin) {
        setError("You do not have admin privileges");
        setIsSubmitting(false);
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ ...userData, isAdmin }));

      setIsAuthenticated(true);
      setIsAdmin(true);
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-700 p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-700">
        <h1 className="text-3xl font-bold text-center text-white mb-6">
          Admin Login
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-500 text-red-400 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 p-2 rounded-md text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 p-2 rounded-md text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-violet-700 text-white py-2 rounded-md hover:bg-violet-600 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
