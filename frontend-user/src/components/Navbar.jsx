import { Link } from "react-router-dom";

function Navbar({ theme, onToggleTheme }) {
  return (
    <nav className="bg-surface text-text px-6 py-4 flex items-center justify-between border-b border-border">
      <div className="flex items-center gap-6">
        <Link
          to="/"
          aria-label="Home"
          className="text-muted hover:text-accent transition-colors duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
            aria-hidden="true"
          >
            <path d="M3 11.5L12 4l9 7.5" />
            <path d="M5.5 10.5V20h13V10.5" />
            <path d="M9.5 20v-6h5v6" />
          </svg>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleTheme}
          className="p-2 rounded-md border border-border bg-bg text-muted hover:text-accent hover:border-accent transition-colors duration-200"
          aria-label="Toggle color theme"
        >
          {theme === "dark" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2" />
              <path d="M12 20v2" />
              <path d="M4.93 4.93l1.41 1.41" />
              <path d="M17.66 17.66l1.41 1.41" />
              <path d="M2 12h2" />
              <path d="M20 12h2" />
              <path d="M4.93 19.07l1.41-1.41" />
              <path d="M17.66 6.34l1.41-1.41" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M21 12.3A8.2 8.2 0 1 1 11.7 3a7 7 0 0 0 9.3 9.3z" />
            </svg>
          )}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
