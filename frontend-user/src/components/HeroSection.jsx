function HeroSection() {
  return (
    <section className="bg-gray-800 py-16 text-white">
      <div className="container mx-auto px-8 md:px-48">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-violet-700 text-left">
          👋 Hi there!
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8 mx-auto text-justify">
          I've been in the tech space for little long enough to share something
          valuable to fellow tech enthusiasts.{" "}
          <span className="text-red-700">Spoiler:</span> This blog will not
          contain any{" "}
          <span className="text-yellow-500">"How to create [this] app"</span> or{" "}
          <span className="text-yellow-500">"How i coded [that]" </span>
          tutorials. I believe one can easily find those from official docs of
          what you desire to learn. This blog will focus on my experiences in
          development, strategic decisons, my methods of coding, architectures
          etc.
        </p>
        <div className="text-center">
          <a
            href="#blogs"
            className="bg-violet-700 text-white py-3 px-6 rounded-lg hover:bg-violet-600 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            Explore Blogs
          </a>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
