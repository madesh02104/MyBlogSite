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
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchPosts({ limit: 8 });
        setPosts(data.items || []);
        setNextCursor(data.nextCursor || null);
        setHasMore(Boolean(data.hasMore));
        setLoading(false);
      } catch (err) {
        console.log(err);
        setError("Failed to load posts");
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  const handleLoadMore = async () => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    try {
      const data = await fetchPosts({ limit: 8, cursor: nextCursor });
      setPosts((prev) => [...prev, ...(data.items || [])]);
      setNextCursor(data.nextCursor || null);
      setHasMore(Boolean(data.hasMore));
    } catch (err) {
      console.log(err);
      setError("Failed to load more posts");
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading)
    return <div className="text-center mt-10 text-text">Loading...</div>;
  if (error && posts.length === 0)
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
      {error && posts.length > 0 && (
        <div className="text-center text-danger mt-4">{error}</div>
      )}
      {hasMore && (
        <div className="flex justify-center mt-6">
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="group relative flex items-center justify-center w-11 h-11 rounded-full border border-border bg-surface text-muted hover:text-accent hover:border-accent transition-colors disabled:opacity-60"
            aria-label="Load more posts"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className={`w-6 h-6 ${loadingMore ? "animate-bounce" : ""}`}
            >
              <path
                d="M6 9l6 6 6-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="pointer-events-none absolute -top-8 whitespace-nowrap rounded-md border border-border bg-surface px-2 py-1 text-xs text-muted opacity-0 transition-opacity group-hover:opacity-100">
              {loadingMore ? "Loading more" : "Load more"}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

export default BlogsSection;
