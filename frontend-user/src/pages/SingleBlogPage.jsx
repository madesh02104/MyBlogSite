import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPostById } from "../api/posts";
import axios from "../api/axios";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

function SingleBlogPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [commentError, setCommentError] = useState(null);
  const [commenterName, setCommenterName] = useState("");
  const [nameModalOpen, setNameModalOpen] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [nameError, setNameError] = useState(null);

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

  useEffect(() => {
    const storedName = localStorage.getItem("commenterName");
    if (storedName) {
      setCommenterName(storedName);
      setNameInput(storedName);
    }
  }, []);

  const submitComment = async (authorName) => {
    try {
      setSubmitting(true);
      setCommentError(null);

      const newComment = await axios.post(`/comments/${id}`, {
        content: commentText,
        authorName,
      });

      setComments((prevComments) => [...prevComments, newComment.data]);
      setCommentText("");
    } catch (error) {
      console.error("Error submitting comment:", error);
      setCommentError("Failed to submit comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (!commenterName.trim()) {
      setNameInput(commenterName);
      setNameError(null);
      setNameModalOpen(true);
      return;
    }

    await submitComment(commenterName.trim());
  };

  const handleNameConfirm = async (e) => {
    e.preventDefault();
    const trimmedName = nameInput.trim();
    if (!trimmedName) {
      setNameError("Please enter your name.");
      return;
    }

    localStorage.setItem("commenterName", trimmedName);
    setCommenterName(trimmedName);
    setNameModalOpen(false);
    setNameError(null);
    await submitComment(trimmedName);
  };

  if (loading)
    return <div className="text-center py-12 text-text">Loading...</div>;
  if (error)
    return <div className="text-center py-12 text-danger">{error}</div>;
  if (!blog)
    return (
      <div className="text-center py-12 text-text">Blog post not found</div>
    );

  return (
    <section className="w-full py-10 px-2 sm:px-4 md:max-w-4xl md:mx-auto text-text">
      {/* Blog Section */}
      <div className="bg-transparent p-0 md:bg-surface md:p-8 md:rounded-lg md:shadow-lg md:border md:border-border mb-6 md:mb-8">
        <h1 className="text-4xl font-bold mb-2">{blog.title}</h1>
        <p className="text-muted mb-6">
          By <span className="text-accent">Madesh</span> | Created On{" "}
          <span className="text-accent">
            {blog.createdAt
              ? new Date(blog.createdAt).toLocaleDateString()
              : "Unknown date"}
          </span>
        </p>
        <hr className="border-border mb-6" />
        <div className="prose max-w-none">
          <ReactMarkdown
            components={{
              code({ inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    className="rounded-lg"
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code
                    className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-900 border border-gray-200"
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
              img({ src, alt }) {
                return (
                  <img
                    src={src}
                    alt={alt}
                    className="max-w-full rounded-lg my-4 mx-auto block"
                  />
                );
              },
            }}
          >
            {blog.content}
          </ReactMarkdown>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-surface p-6 sm:p-8 rounded-lg shadow-lg border border-border">
        <h2 className="text-2xl font-semibold mb-6">
          Comments ({comments.length})
        </h2>

        {comments.length === 0 ? (
          <p className="text-muted">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="border-b border-border py-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-accent-strong rounded-full flex items-center justify-center text-sm font-bold">
                    {(comment.authorName || comment.author?.username || "A")
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                  <span className="font-bold text-accent">
                    {comment.authorName ||
                      comment.author?.username ||
                      "Anonymous"}
                  </span>
                </div>
                <span className="text-sm text-muted">
                  Posted on {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-muted ml-10">{comment.content}</p>
            </div>
          ))
        )}

        {/* Comment Form */}
        <form onSubmit={handleCommentSubmit} className="mt-8 space-y-4">
          {commentError && (
            <div className="text-danger bg-accent-soft p-3 rounded-md border border-border">
              {commentError}
            </div>
          )}
          <div className="flex items-center justify-between text-sm text-muted">
            <span>Commenting as {commenterName.trim() || "Guest"}</span>
            <button
              type="button"
              onClick={() => {
                setNameInput(commenterName);
                setNameError(null);
                setNameModalOpen(true);
              }}
              className="text-accent hover:text-accent-strong transition-colors duration-200"
            >
              Change name
            </button>
          </div>
          <textarea
            rows="3"
            placeholder="Write your comment here..."
            className="w-full bg-surface-strong border border-border p-3 rounded-md text-text focus:ring-2 focus:ring-accent focus:border-transparent"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            required
          ></textarea>
          <button
            type="submit"
            className="bg-accent-strong text-white px-6 py-2 rounded-md hover:bg-accent transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Comment"}
          </button>
        </form>
      </div>

      {nameModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-lg border border-border bg-surface p-6 shadow-xl">
            <h3 className="text-xl font-semibold mb-2">Your name</h3>
            <p className="text-sm text-muted mb-4">
              This name will appear next to your comment.
            </p>
            <form onSubmit={handleNameConfirm} className="space-y-4">
              {nameError && (
                <div className="text-danger bg-accent-soft p-3 rounded-md border border-border">
                  {nameError}
                </div>
              )}
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full bg-surface-strong border border-border p-3 rounded-md text-text focus:ring-2 focus:ring-accent focus:border-transparent"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                required
              />
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setNameModalOpen(false);
                    setNameError(null);
                  }}
                  className="flex-1 border border-border py-2 rounded-md text-text hover:border-accent transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-accent-strong text-white py-2 rounded-md hover:bg-accent transition-all duration-200"
                >
                  Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default SingleBlogPage;
