import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [deleteCommentId, setDeleteCommentId] = useState(null);
  const [showDeleteCommentModal, setShowDeleteCommentModal] = useState(false);
  const [deleteCommentLoading, setDeleteCommentLoading] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`/posts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { title, content, published, comments } = response.data;
        setTitle(title);
        setContent(content);
        setPublished(published);
        setComments(comments || []);
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/posts/${id}`,
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // If publish status changed, make a separate request
      const currentPost = await axios.get(`/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (currentPost.data.published !== published) {
        if (published) {
          await axios.put(
            `/posts/${id}/publish`,
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        } else {
          // This endpoint doesn't exist in your API, so we'll need to handle unpublishing differently
          // For now, let's just alert that this feature isn't available
          alert("Note: API doesn't support unpublishing posts directly");
        }
      }

      navigate("/");
    } catch (err) {
      console.error("Error updating post:", err);
      setError(err.response?.data?.message || "Failed to update post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDeleteCommentModal = (commentId) => {
    setDeleteCommentId(commentId);
    setShowDeleteCommentModal(true);
  };

  const closeDeleteCommentModal = () => {
    setShowDeleteCommentModal(false);
    setDeleteCommentId(null);
  };

  const confirmDeleteComment = async () => {
    if (!deleteCommentId) return;

    setDeleteCommentLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/comments/${deleteCommentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove comment from state
      setComments(comments.filter((comment) => comment.id !== deleteCommentId));
      closeDeleteCommentModal();
    } catch (err) {
      console.error("Error deleting comment:", err);
      alert("Failed to delete comment");
    } finally {
      setDeleteCommentLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center p-8 text-white">Loading post...</div>;
  }

  if (error && !title && !content) {
    return <div className="text-center p-8 text-red-400">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Edit Post</h1>
      </div>

      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-8">
        {error && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-500 text-red-400 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Post Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 p-2 rounded-md text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              placeholder="Enter post title"
              required
            />
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Post Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="12"
              className="w-full bg-gray-700 border border-gray-600 p-2 rounded-md text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              placeholder="Write your post content here..."
              required
            ></textarea>
          </div>

          <div className="flex items-center">
            <input
              id="published"
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="h-4 w-4 rounded border-gray-600 text-violet-600 focus:ring-violet-500 bg-gray-700"
            />
            <label
              htmlFor="published"
              className="ml-2 block text-sm text-gray-300"
            >
              Published
            </label>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-violet-700 text-white rounded-md hover:bg-violet-600 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Updating..." : "Update Post"}
            </button>
          </div>
        </form>
      </div>

      {/* Comments Management Section */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-white mb-4">
          Manage Comments ({comments.length})
        </h2>

        {comments.length === 0 ? (
          <p className="text-gray-400">No comments on this post yet.</p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="border border-gray-700 rounded-lg p-4 bg-gray-750 hover:bg-gray-700 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-violet-700 rounded-full flex items-center justify-center text-sm font-bold">
                      {comment.author.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-bold text-violet-400">
                        {comment.author.username}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => openDeleteCommentModal(comment.id)}
                    className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded text-sm transition-colors"
                  >
                    Delete
                  </button>
                </div>
                <p className="text-gray-300 ml-10 mt-2">{comment.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Comment Confirmation Modal */}
      {showDeleteCommentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">
              Confirm Comment Deletion
            </h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this comment? This action cannot
              be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeDeleteCommentModal}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteComment}
                disabled={deleteCommentLoading}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-500 transition-colors disabled:opacity-70"
              >
                {deleteCommentLoading ? "Deleting..." : "Delete Comment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditPost;
