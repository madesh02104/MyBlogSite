function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8 shadow-inner">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0 text-center md:text-left">
          &copy; 2000BC MyBlogSite. No rights reserved.
        </div>

        <div className="flex space-x-6">
          <p>
            Made with care by{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/madesh02104"
              className="text-violet-400 hover:text-violet-300 transition-colors duration-200"
            >
              Madesh : )
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
