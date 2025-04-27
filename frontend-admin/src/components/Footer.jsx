function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-4 px-8 border-t border-gray-700">
      <div className="flex justify-between items-center">
        <div className="text-sm">
          &copy; 2000BC MyBlogSite. No rights reserved.
        </div>
        <div className="text-sm">
          <span>Admin Dashboard by </span>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/madesh02104"
            className="text-violet-400 hover:text-violet-300 transition-colors duration-200"
          >
            Madesh : )
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
