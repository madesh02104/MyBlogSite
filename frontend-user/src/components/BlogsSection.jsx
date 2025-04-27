import { useEffect, useState } from "react";
import { fetchPosts } from "../api/posts";
import { Link } from "react-router-dom";

function BlogsSection() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchPosts();
        setPosts(data);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setError("Failed to load posts");
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  if (loading)
    return <div className="text-center mt-10 text-white">Loading...</div>;
  if (error)
    return <div className="text-center mt-10 text-red-400">{error}</div>;

  return (
    <div
      id="blogs"
      className="max-w-6xl mx-auto p-4 py-12 bg-gray-700 text-white"
    >
      <h1 className="text-3xl font-bold mb-8 text-center">Latest Blogs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] border border-gray-700"
          >
            <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
            <p className="text-gray-300 mb-4 line-clamp-3">{post.content}</p>
            <Link
              to={`/blog/${post.id}`}
              className="text-violet-400 hover:text-violet-300 inline-flex items-center group"
            >
              Read More
              <span className="ml-1 transform transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BlogsSection;
