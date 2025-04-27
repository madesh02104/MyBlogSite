import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

function CreatePost() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

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
      await axios.post(
        "/posts",
        { title, content, published },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/");
    } catch (err) {
      console.error("Error creating post:", err);
      setError(err.response?.data?.message || "Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Create New Post</h1>
      </div>

      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
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
              Publish immediately
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
              {isSubmitting ? "Creating..." : "Create Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePost;
