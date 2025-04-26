function HeroSection() {
  return (
    <section className="bg-gray-100 py-16 text-center">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
          Welcome to My Blog Site
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8">
          Share your thoughts. Read my blog posts. Connect with me.
        </p>
        <a
          href="#blogs"
          className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition"
        >
          Explore Blogs
        </a>
      </div>
    </section>
  );
}

export default HeroSection;
