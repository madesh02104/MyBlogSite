import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

function CreatePost() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("image", file);

      const response = await axios.post("/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const markdownImage = `![image](${response.data.url})`;
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent =
        content.substring(0, start) +
        markdownImage +
        content.substring(end);
      setContent(newContent);

      setTimeout(() => {
        textarea.selectionStart = start + markdownImage.length;
        textarea.selectionEnd = start + markdownImage.length;
        textarea.focus();
      }, 0);
    } catch (err) {
      setUploadError(err.response?.data?.message || "Failed to upload image");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

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
            <div className="flex justify-between items-center mb-1">
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-300"
              >
                Post Content (Markdown supported)
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  disabled={uploading}
                  className="text-sm text-violet-400 hover:text-violet-300 disabled:opacity-50 flex items-center gap-1"
                >
                  {uploading ? "Uploading..." : "Insert Image"}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="text-sm text-violet-400 hover:text-violet-300"
                >
                  {showPreview ? "Hide Preview" : "Show Preview"}
                </button>
              </div>
            </div>
            {uploadError && (
              <p className="text-sm text-red-400 mb-1">{uploadError}</p>
            )}
            <textarea
              ref={textareaRef}
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="12"
              className="w-full bg-gray-700 border border-gray-600 p-2 rounded-md text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent font-mono"
              placeholder="Write your post content here using Markdown...

# Heading 1
## Heading 2
**bold text**
*italic text*
`inline code`

```javascript
// code block
const x = 10;
```

> Blockquote"
              required
            ></textarea>
            {showPreview && (
              <div className="mt-4 p-4 bg-gray-700 rounded-md border border-gray-600">
                <h3 className="text-sm font-medium text-gray-400 mb-2">
                  Preview:
                </h3>
                <div className="prose prose-invert prose-violet max-w-none">
                  <ReactMarkdown
                    components={{
                      code({ _node, inline, className, children, ...props }) {
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
                            className="bg-gray-600 px-1.5 py-0.5 rounded text-violet-300"
                            {...props}
                          >
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {content || "*No content yet*"}
                  </ReactMarkdown>
                </div>
              </div>
            )}
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
