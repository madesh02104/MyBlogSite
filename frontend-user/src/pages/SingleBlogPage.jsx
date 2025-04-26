import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPostById } from "../api/posts";

function SingleBlogPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  console.log(comments);

  // Dummy logged-in state
  const isLoggedIn = true; // Later we will replace it with real auth

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (error)
    return <div className="text-center py-12 text-red-500">{error}</div>;
  if (!blog)
    return <div className="text-center py-12">Blog post not found</div>;

  return (
    <section className="max-w-4xl mx-auto py-12 px-4">
      {/* Blog Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{blog.title}</h1>
        <p className="text-gray-600 mb-4">
          By <b>Madesh</b> | Created On{" "}
          <b>
            {blog.createdAt
              ? new Date(blog.createdAt).toLocaleDateString()
              : "Unknown date"}
          </b>
        </p>
        <div className="text-lg leading-7 text-gray-800">{blog.content}</div>
      </div>

      {/* Comments Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">
          Comments ({comments.length})
        </h2>

        {comments.length === 0 ? (
          <p className="text-gray-500">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="border-b border-gray-200 py-4 mb-2"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold">{comment.author.username}</span>
                  <span className="text-xs text-gray-500">
                    ({comment.author.email})
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  Posted on {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-800">{comment.content}</p>
            </div>
          ))
        )}
      </div>

      {/* Comment Form */}
      {isLoggedIn && (
        <form className="mt-8 space-y-4">
          <textarea
            rows="3"
            placeholder="Write your comment here..."
            className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          ></textarea>
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition"
          >
            Submit Comment
          </button>
        </form>
      )}

      {!isLoggedIn && (
        <p className="mt-8 text-gray-500">
          Please <span className="text-blue-500">login</span> to write a
          comment.
        </p>
      )}
    </section>
  );
}

export default SingleBlogPage;
