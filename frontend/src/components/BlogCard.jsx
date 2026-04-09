import { Link } from "react-router-dom";
import { FiHeart, FiClock } from "react-icons/fi";
import { format } from "date-fns";
import DOMPurify from "dompurify";
import "./BlogCard.css";

function stripHtml(html) {
  const tmp = document.createElement("div");
  tmp.innerHTML = DOMPurify.sanitize(html);
  return tmp.textContent || tmp.innerText || "";
}

export default function BlogCard({ blog, index = 0 }) {
  const excerpt = stripHtml(blog.content).slice(0, 160) + "…";
  const dateStr = blog.createdAt
    ? format(new Date(blog.createdAt), "MMM d, yyyy")
    : "";

  return (
    <Link
      to={`/blog/${blog._id}`}
      className={`blog-card card animate-fade-in-up delay-${(index % 5) + 1}`}
      id={`blog-card-${blog._id}`}
    >
      <div className="blog-card__body">
        <div className="blog-card__meta">
          {dateStr && (
            <span className="blog-card__date">
              <FiClock size={13} />
              {dateStr}
            </span>
          )}
        </div>

        <h3 className="blog-card__title">{blog.title}</h3>
        <p className="blog-card__excerpt">{excerpt}</p>

        <div className="blog-card__footer">
          <div className="tag-group">
            {blog.tags?.slice(0, 3).map((tag) => (
              <span className="tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>

          <span className="blog-card__likes">
            <FiHeart size={14} />
            {blog.likes?.length || 0}
          </span>
        </div>
      </div>
    </Link>
  );
}
