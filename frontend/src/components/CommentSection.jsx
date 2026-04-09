import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getCommentsByBlog,
  addComment,
} from "../api/comment";
import CommentItem from "./CommentItem";
import { FiMessageCircle, FiSend } from "react-icons/fi";
import toast from "react-hot-toast";
import "./CommentSection.css";

export default function CommentSection({ blogId }) {
  const { isAuthenticated } = useAuth();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = async () => {
    try {
      const { data } = await getCommentsByBlog(blogId);
      setComments(data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [blogId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      await addComment(blogId, text.trim());
      setText("");
      await fetchComments();
      toast.success("Comment added!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  };

  // Build tree from flat list
  const buildTree = (comments) => {
    const map = {};
    const roots = [];

    comments.forEach((c) => {
      map[c._id] = { ...c, replies: [] };
    });

    comments.forEach((c) => {
      if (c.parentCommentId && map[c.parentCommentId]) {
        map[c.parentCommentId].replies.push(map[c._id]);
      } else {
        roots.push(map[c._id]);
      }
    });

    return roots;
  };

  const tree = buildTree(comments);

  return (
    <section className="comment-section" id="comment-section">
      <div className="comment-section__header">
        <FiMessageCircle size={20} />
        <h3>
          {comments.length === 0
            ? "No comments yet"
            : `${comments.length} Comment${comments.length !== 1 ? "s" : ""}`}
        </h3>
      </div>

      {isAuthenticated && (
        <form
          className="comment-section__form"
          onSubmit={handleAdd}
          id="add-comment-form"
        >
          <textarea
            className="comment-section__textarea"
            placeholder="Share your thoughts…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            id="comment-textarea"
          />
          <button
            type="submit"
            className="btn btn-primary btn-sm"
            disabled={submitting || !text.trim()}
            id="submit-comment-btn"
          >
            <FiSend size={14} />
            {submitting ? "Posting…" : "Post"}
          </button>
        </form>
      )}

      {loading ? (
        <div className="comment-section__loading">
          <div className="skeleton" style={{ height: 60, width: "100%" }} />
          <div className="skeleton" style={{ height: 60, width: "90%" }} />
          <div className="skeleton" style={{ height: 60, width: "80%" }} />
        </div>
      ) : (
        <div className="comment-section__list">
          {tree.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              onRefresh={fetchComments}
            />
          ))}
        </div>
      )}
    </section>
  );
}
