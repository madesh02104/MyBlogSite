import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <section className="h-[70vh] flex flex-col justify-center items-center text-center">
      <h1 className="text-7xl font-bold mb-4 text-red-500">404</h1>
      <p className="text-2xl mb-6">Oops! Page not found.</p>
      <Link
        to="/"
        className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition"
      >
        Go Back Home
      </Link>
    </section>
  );
}

export default NotFoundPage;
