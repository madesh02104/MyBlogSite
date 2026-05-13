import { useEffect, useState } from "react";
import { fetchPosts } from "../api/posts";
import { Link } from "react-router-dom";

const getReadTime = (content) => {
  const words = content?.trim().split(/\s+/).length || 0;
  return Math.max(1, Math.round(words / 200));
};

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
    return <div className="text-center mt-10 text-text">Loading...</div>;
  if (error)
    return <div className="text-center mt-10 text-danger">{error}</div>;

  return (
    <div id="blogs" className="max-w-4xl mx-auto px-4 py-6 text-text">
      <h1 className="text-3xl font-bold mb-4 text-center">Latest Blogs</h1>
      <div className="flex flex-col gap-2">
        {posts.map((post) => (
          <Link
            key={post.id}
            to={`/blog/${post.id}`}
            className="flex items-center justify-between bg-surface px-4 py-3 rounded-lg border border-border hover:border-accent transition-all duration-200 group"
          >
            <div className="flex flex-col">
              <span className="text-text text-2xl font-semibold group-hover:text-accent transition-colors duration-200 leading-tight">
                {post.title}
              </span>
              <span className="text-muted text-sm mt-1">
                {getReadTime(post.content)} min read
              </span>
            </div>
            <span className="text-muted text-sm whitespace-nowrap ml-6">
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default BlogsSection;
