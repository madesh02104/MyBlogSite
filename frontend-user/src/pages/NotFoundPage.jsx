import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <section className="h-[70vh] flex flex-col justify-center items-center text-center text-text bg-surface">
      <h1 className="text-7xl font-bold mb-4 text-accent">404</h1>
      <p className="text-2xl mb-8 text-muted">Oops! Page not found.</p>
      <Link
        to="/"
        className="bg-accent-strong text-white px-8 py-3 rounded-md hover:bg-accent transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg"
      >
        Go Back Home
      </Link>
    </section>
  );
}

export default NotFoundPage;
