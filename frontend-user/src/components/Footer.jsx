function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        {/* Left side - copyright */}
        <div className="mb-4 md:mb-0 text-center md:text-left">
          &copy; 2000BC MyBlogSite. No rights reserved.
        </div>

        {/* Right side - quick links */}
        <div className="flex space-x-6">
          <p>
            Made with care by{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/madesh02104"
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
