import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

function Dashboard() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletePostId, setDeletePostId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/posts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(response.data);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handlePublishToggle = async (postId, currentStatus) => {
    try {
      const token = localStorage.getItem("token");

      // Choose the appropriate endpoint and data based on the current status
      if (!currentStatus) {
        await axios.put(
          `/posts/${postId}/publish`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.put(
          `/posts/${postId}`,
          {
            title: posts.find((post) => post.id === postId)?.title,
            content: posts.find((post) => post.id === postId)?.content,
            published: false,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      // Update local state
      setPosts(
        posts.map((post) =>
          post.id === postId ? { ...post, published: !currentStatus } : post
        )
      );
    } catch (err) {
      console.error("Error toggling publish status:", err);
      alert(
        "Failed to update publish status: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  const openDeleteModal = (postId) => {
    setDeletePostId(postId);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletePostId(null);
  };

  const confirmDelete = async () => {
    if (!deletePostId) return;

    setDeleteLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/posts/${deletePostId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove post from state
      setPosts(posts.filter((post) => post.id !== deletePostId));
      closeDeleteModal();
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Failed to delete post");
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center text-white">Loading posts...</div>;
  }

  if (error) {
    return <div className="text-center text-red-400">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Posts</h1>

      {posts.length === 0 ? (
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <p className="text-gray-300 text-center">
            No posts found. Create your first post using the sidebar!
          </p>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Created Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-700">
                  <td className="px-6 py-4 text-white">
                    <div className="font-medium">{post.title}</div>
                    <div className="text-sm text-gray-400 truncate max-w-xs">
                      {post.content.substring(0, 60)}...
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap flex items-center justify-between">
                    {/* Toggle button on left */}
                    <div>
                      <button
                        onClick={() =>
                          handlePublishToggle(post.id, post.published)
                        }
                        className={`relative inline-flex items-center h-6 rounded-full w-11 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 ${
                          post.published ? "bg-green-600" : "bg-gray-500"
                        }`}
                      >
                        <span
                          className={`${
                            post.published ? "translate-x-6" : "translate-x-1"
                          } inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out`}
                        />
                      </button>
                      <span className="ml-2 text-xs">
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </div>

                    {/* Edit and Delete buttons on right */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => navigate(`/edit/${post.id}`)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white py-1 px-3 rounded text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(post.id)}
                        className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">
              Confirm Deletion
            </h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this post? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeDeleteModal}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteLoading}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-500 transition-colors disabled:opacity-70"
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
