import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getSingleBlog, toggleLikeBlog, deleteBlog } from "../api/blog";
import { useAuth } from "../context/AuthContext";
import CommentSection from "../components/CommentSection";
import Loader from "../components/Loader";
import DOMPurify from "dompurify";
import { format } from "date-fns";
import {
  FiHeart,
  FiCalendar,
  FiEdit3,
  FiTrash2,
  FiArrowLeft,
} from "react-icons/fi";
import toast from "react-hot-toast";
import "./BlogDetail.css";

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin } = useAuth();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const { data } = await getSingleBlog(id);
        setBlog(data);
        setLikeCount(data.likes?.length || 0);
        setLiked(data.likes?.includes(user?._id) || false);
      } catch {
        toast.error("Blog not found");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id, user?._id]);

  const handleLike = async () => {
    if (!isAuthenticated) return toast.error("Log in to like posts");
    try {
      const { data } = await toggleLikeBlog(id);
      setLikeCount(data.likes);
      setLiked(!liked);
    } catch {
      toast.error("Failed to like post");
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteBlog(id);
      toast.success("Blog deleted");
      navigate("/");
    } catch (err) {
      console.error("Delete blog error:", err.response?.status, err.response?.data);
      toast.error(err.response?.data?.message || "Failed to delete blog");
      setShowDeleteConfirm(false);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <Loader text="Loading article…" />;
  if (!blog) return null;

  const dateStr = blog.createdAt
    ? format(new Date(blog.createdAt), "MMMM d, yyyy")
    : "";

  return (
    <main className="blog-detail" id="blog-detail-page">
      <div className="blog-detail__container container">
        <div className="prose-container">
          {/* Back button */}
          <Link to="/" className="blog-detail__back animate-fade-in" id="back-to-home">
            <FiArrowLeft size={18} />
            <span>Back to articles</span>
          </Link>

          {/* Header */}
          <header className="blog-detail__header animate-fade-in-up">
            <div className="blog-detail__meta">
              <span className="blog-detail__date">
                <FiCalendar size={14} />
                {dateStr}
              </span>
            </div>

            <h1 className="blog-detail__title">{blog.title}</h1>

            {blog.tags?.length > 0 && (
              <div className="tag-group" style={{ marginTop: "var(--space-md)" }}>
                {blog.tags.map((tag) => (
                  <span className="tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Actions */}
          <div className="blog-detail__actions animate-fade-in delay-2">
            <button
              className={`blog-detail__like-btn ${liked ? "blog-detail__like-btn--liked" : ""}`}
              onClick={handleLike}
              id="like-blog-btn"
            >
              <FiHeart size={18} fill={liked ? "currentColor" : "none"} />
              <span>{likeCount}</span>
            </button>

            {isAdmin && (
              <div className="blog-detail__admin-actions">
                <Link
                  to={`/write/${id}`}
                  className="btn btn-ghost btn-sm"
                  id="edit-blog-btn"
                >
                  <FiEdit3 size={15} />
                  Edit
                </Link>
                <button
                  className="btn btn-ghost btn-sm blog-detail__delete-btn"
                  onClick={() => setShowDeleteConfirm(true)}
                  id="delete-blog-btn"
                >
                  <FiTrash2 size={15} />
                  Delete
                </button>
              </div>
            )}
          </div>

          {/* Delete Confirmation Inline */}
          {showDeleteConfirm && (
            <div className="blog-detail__confirm animate-slide-down">
              <p>Are you sure you want to delete this post permanently?</p>
              <div className="blog-detail__confirm-actions">
                <button
                  className="btn btn-danger btn-sm"
                  onClick={handleDelete}
                  disabled={deleting}
                  id="confirm-delete-btn"
                >
                  {deleting ? "Deleting…" : "Yes, delete"}
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleting}
                  id="cancel-delete-btn"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Divider */}
          <hr className="blog-detail__divider" />

          {/* Content */}
          <article
            className="blog-content animate-fade-in-up delay-3"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(blog.content),
            }}
            id="blog-content"
          />

          {/* Comments */}
          <CommentSection blogId={id} />
        </div>
      </div>
    </main>
  );
}
