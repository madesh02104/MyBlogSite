import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/auth";

function RegisterPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = await registerUser({ username, email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", data.username);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="max-w-md mx-auto py-16 px-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700">
        <h1 className="text-3xl font-bold mb-6 text-center text-white">
          Register
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-red-400 bg-red-900/30 p-3 rounded-md">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Choose a username"
              className="w-full bg-gray-700 border border-gray-600 p-2 rounded-md text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

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
              placeholder="Your email address"
              className="w-full bg-gray-700 border border-gray-600 p-2 rounded-md text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              placeholder="Create a password"
              className="w-full bg-gray-700 border border-gray-600 p-2 rounded-md text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-violet-700 text-white py-2 rounded-md hover:bg-violet-600 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>

          <p className="text-center text-gray-400 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-violet-400 hover:text-violet-300">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}

export default RegisterPage;
