import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import Layout from "./components/Layout";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated and is admin
  useEffect(() => {
    const checkAuth = () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      if (user && token && user.isAdmin) {
        setIsAuthenticated(true);
        setIsAdmin(true);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-700 text-white">
          Loading...
        </div>
      );
    }

    if (!isAuthenticated || !isAdmin) {
      return <Navigate to="/login" />;
    }

    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <LoginPage
              setIsAuthenticated={setIsAuthenticated}
              setIsAdmin={setIsAdmin}
            />
          }
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="create" element={<CreatePost />} />
          <Route path="edit/:id" element={<EditPost />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
