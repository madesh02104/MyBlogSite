import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchPostById } from "../api/posts";
import axios from "../api/axios";

function SingleBlogPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [commentError, setCommentError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const data = await fetchPostById(id);
        setBlog(data);
        setComments(data.comments || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blog post:", error);
        setError("Failed to load blog post");
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const isLoggedIn = Boolean(
    localStorage.getItem("user") && localStorage.getItem("token")
  );

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      setSubmitting(true);
      setCommentError(null);

      const token = localStorage.getItem("token");

      const newComment = await axios.post(
        `/comments/${id}`,
        { content: commentText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComments([...comments, newComment.data]);
      setCommentText("");
    } catch (error) {
      console.error("Error submitting comment:", error);
      setCommentError("Failed to submit comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return <div className="text-center py-12 text-white">Loading...</div>;
  if (error)
    return <div className="text-center py-12 text-red-400">{error}</div>;
  if (!blog)
    return (
      <div className="text-center py-12 text-white">Blog post not found</div>
    );

  return (
    <section className="max-w-4xl mx-auto py-12 px-4 text-white">
      {/* Blog Section */}
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700 mb-8">
        <h1 className="text-4xl font-bold mb-2">{blog.title}</h1>
        <p className="text-gray-400 mb-6">
          By <span className="text-violet-400">Madesh</span> | Created On{" "}
          <span className="text-violet-400">
            {blog.createdAt
              ? new Date(blog.createdAt).toLocaleDateString()
              : "Unknown date"}
          </span>
        </p>
        <div className="text-lg leading-7 text-gray-300 whitespace-pre-wrap">
          {blog.content}
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700">
        <h2 className="text-2xl font-semibold mb-6">
          Comments ({comments.length})
        </h2>

        {comments.length === 0 ? (
          <p className="text-gray-400">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="border-b border-gray-700 py-4 mb-4"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-violet-700 rounded-full flex items-center justify-center text-sm font-bold">
                    {comment.author.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-bold text-violet-400">
                    {comment.author.username}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  Posted on {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-300 ml-10">{comment.content}</p>
            </div>
          ))
        )}

        {/* Comment Form */}
        {isLoggedIn && (
          <form onSubmit={handleCommentSubmit} className="mt-8 space-y-4">
            {commentError && (
              <div className="text-red-400 bg-red-900/30 p-3 rounded-md">
                {commentError}
              </div>
            )}
            <textarea
              rows="3"
              placeholder="Write your comment here..."
              className="w-full bg-gray-700 border border-gray-600 p-3 rounded-md text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              required
            ></textarea>
            <button
              type="submit"
              className="bg-violet-700 text-white px-6 py-2 rounded-md hover:bg-violet-600 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Comment"}
            </button>
          </form>
        )}

        {!isLoggedIn && (
          <div className="mt-8 p-4 bg-gray-700 rounded-md">
            <p className="text-gray-300">
              Please{" "}
              <Link
                to="/login"
                className="text-violet-400 hover:text-violet-300"
              >
                login
              </Link>{" "}
              to write a comment.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default SingleBlogPage;
