function HeroSection() {
  return (
    <section className="bg-bg py-16 text-text">
      <div className="w-full md:w-[70%] mx-auto px-6 md:px-20">
        <p className="w-full text-left text-xl md:text-2xl leading-relaxed">
          Hey there! I'll be milking my hobbies for content in here :). I write
          about tech and... will try to write beyond just that. There will be
          project setup guides, tools guide, general computer concepts, deep
          dives into how(s) and why(s) of tech realted topics, and more. I try
          to post consistently(every 1/2 weeks). If you like the content, make
          sure to comment on what do you think and leave a star on{" "}
          <a
            href="https://github.com/madesh02104/MyBlogSite"
            className="text-accent hover:text-accent-strong transition-colors duration-200"
          >
            GitHub
          </a>
          . Happy reading!
        </p>
      </div>
    </section>
  );
}

export default HeroSection;
