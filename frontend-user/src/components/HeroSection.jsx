function HeroSection() {
  return (
    <section className="bg-gray-800 py-16 text-center text-white">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
          Welcome to My Blog Site
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8">
          Share your thoughts. Read my blog posts. Connect with me.
        </p>
        <a
          href="#blogs"
          className="bg-violet-700 text-white py-3 px-6 rounded-lg hover:bg-violet-600 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-gray-800"
        >
          Explore Blogs
        </a>
      </div>
    </section>
  );
}

export default HeroSection;
