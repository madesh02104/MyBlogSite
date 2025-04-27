import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <section className="h-[70vh] flex flex-col justify-center items-center text-center text-white bg-gray-800">
      <h1 className="text-7xl font-bold mb-4 text-violet-500">404</h1>
      <p className="text-2xl mb-8 text-gray-300">Oops! Page not found.</p>
      <Link
        to="/"
        className="bg-violet-700 text-white px-8 py-3 rounded-md hover:bg-violet-600 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-gray-800"
      >
        Go Back Home
      </Link>
    </section>
  );
}

export default NotFoundPage;
