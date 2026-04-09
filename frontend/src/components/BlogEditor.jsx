import { useState, useMemo } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { FiTag, FiX } from "react-icons/fi";
import "./BlogEditor.css";

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline", "strike"],
  [{ list: "ordered" }, { list: "bullet" }],
  ["blockquote", "code-block"],
  ["link", "image"],
  ["clean"],
];

export default function BlogEditor({
  initialTitle = "",
  initialContent = "",
  initialTags = [],
  onSubmit,
  submitLabel = "Publish",
  loading = false,
}) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [tags, setTags] = useState(initialTags);
  const [tagInput, setTagInput] = useState("");

  const modules = useMemo(
    () => ({
      toolbar: TOOLBAR_OPTIONS,
    }),
    []
  );

  const addTag = () => {
    const trimmed = tagInput.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setTagInput("");
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onSubmit({ title: title.trim(), content, tags });
  };

  return (
    <form className="blog-editor" onSubmit={handleSubmit} id="blog-editor-form">
      <div className="blog-editor__title-wrapper">
        <input
          type="text"
          className="blog-editor__title"
          placeholder="Your story title…"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          id="blog-title-input"
        />
      </div>

      <div className="blog-editor__tags-wrapper">
        <FiTag size={16} className="blog-editor__tags-icon" />
        <div className="blog-editor__tags-container">
          {tags.map((tag) => (
            <span className="blog-editor__tag" key={tag}>
              {tag}
              <button
                type="button"
                className="blog-editor__tag-remove"
                onClick={() => removeTag(tag)}
                aria-label={`Remove tag ${tag}`}
              >
                <FiX size={12} />
              </button>
            </span>
          ))}
          <input
            type="text"
            className="blog-editor__tag-input"
            placeholder="Add tags (press Enter)…"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            onBlur={addTag}
            id="blog-tags-input"
          />
        </div>
      </div>

      <div className="blog-editor__editor-wrapper">
        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          modules={modules}
          placeholder="Tell your story…"
          id="blog-content-editor"
        />
      </div>

      <div className="blog-editor__actions">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || !title.trim() || !content.trim()}
          id="blog-submit-btn"
        >
          {loading ? "Publishing…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
