import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  replyToComment,
  deleteComment,
  toggleLikeComment,
} from "../api/comment";
import { FiHeart, FiCornerDownRight, FiTrash2, FiX } from "react-icons/fi";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";
import "./CommentItem.css";

export default function CommentItem({ comment, onRefresh, depth = 0 }) {
  const { user, isAuthenticated } = useAuth();
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replying, setReplying] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likes?.length || 0);
  const [liked, setLiked] = useState(
    comment.likes?.includes(user?._id) || false
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const canDelete =
    user &&
    (comment.userId?._id === user._id ||
      comment.userId === user._id ||
      ["admin", "moderator"].includes(user.role));

  const handleLike = async () => {
    if (!isAuthenticated) return toast.error("Log in to like comments");
    try {
      const { data } = await toggleLikeComment(comment._id);
      setLikeCount(data.likes);
      setLiked(!liked);
    } catch {
      toast.error("Failed to like comment");
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setReplying(true);
    try {
      await replyToComment(comment._id, replyText.trim());
      setReplyText("");
      setShowReply(false);
      await onRefresh();
      toast.success("Reply posted!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reply");
    } finally {
      setReplying(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteComment(comment._id);
      await onRefresh();
      toast.success("Comment deleted");
    } catch (err) {
      console.error("Delete comment error:", err.response?.status, err.response?.data);
      toast.error(err.response?.data?.message || "Failed to delete");
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const userName = comment.userId?.name || "Anonymous";
  const timeAgo = comment.createdAt
    ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })
    : "";

  return (
    <div
      className={`comment-item ${depth > 0 ? "comment-item--nested" : ""}`}
      style={{ marginLeft: depth > 0 ? Math.min(depth * 24, 72) : 0 }}
      id={`comment-${comment._id}`}
    >
      <div className="comment-item__main">
        <div className="comment-item__avatar">
          {userName.charAt(0).toUpperCase()}
        </div>

        <div className="comment-item__content">
          <div className="comment-item__header">
            <span className="comment-item__name">{userName}</span>
            <span className="comment-item__time">{timeAgo}</span>
          </div>

          <p className="comment-item__text">{comment.text}</p>

          <div className="comment-item__actions">
            <button
              className={`comment-item__action ${liked ? "comment-item__action--liked" : ""}`}
              onClick={handleLike}
            >
              <FiHeart size={13} fill={liked ? "currentColor" : "none"} />
              <span>{likeCount}</span>
            </button>

            {isAuthenticated && depth < 3 && (
              <button
                className="comment-item__action"
                onClick={() => setShowReply(!showReply)}
              >
                <FiCornerDownRight size={13} />
                <span>Reply</span>
              </button>
            )}

            {canDelete && !showDeleteConfirm && (
              <button
                className="comment-item__action comment-item__action--delete"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <FiTrash2 size={13} />
              </button>
            )}

            {showDeleteConfirm && (
              <span className="comment-item__delete-confirm animate-fade-in">
                <button
                  className="comment-item__action comment-item__action--confirm-yes"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? "…" : "Delete?"}
                </button>
                <button
                  className="comment-item__action"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                >
                  <FiX size={13} />
                </button>
              </span>
            )}
          </div>

          {showReply && (
            <form
              className="comment-item__reply-form animate-slide-down"
              onSubmit={handleReply}
            >
              <input
                type="text"
                placeholder="Write a reply…"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="comment-item__reply-input"
                autoFocus
              />
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={replying || !replyText.trim()}
              >
                {replying ? "…" : "Reply"}
              </button>
            </form>
          )}
        </div>
      </div>

      {comment.replies?.map((reply) => (
        <CommentItem
          key={reply._id}
          comment={reply}
          onRefresh={onRefresh}
          depth={depth + 1}
        />
      ))}
    </div>
  );
}
