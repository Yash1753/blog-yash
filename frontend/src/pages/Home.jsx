import { useState, useEffect, useCallback } from "react";
import { getAllBlogs } from "../api/blog";
import BlogCard from "../components/BlogCard";
import SearchBar from "../components/SearchBar";
import Loader from "../components/Loader";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "./Home.css";

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [activeTags, setActiveTags] = useState([]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const tagParam = activeTags.join(",");
      const { data } = await getAllBlogs(page, 9, search, tagParam);
      setBlogs(data.results);
      setTotalPages(data.totalPages);
    } catch {
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [page, search, activeTags]);

  const handleSearch = useCallback((q) => {
    setSearch(q);
    setPage(1);
  }, []);

  const handleTagFilter = useCallback((tag) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    setPage(1);
  }, []);

  return (
    <main className="home" id="home-page">
      {/* Hero Section */}
      <section className="hero animate-fade-in" id="hero-section">
        <div className="hero__inner container">
          <span className="hero__badge">✦ Building with AI, one idea at a time</span>
          <h1 className="hero__title">
            Code, Ideas &<br />
            <span className="hero__title-accent">Systems</span>
          </h1>
          <p className="hero__subtitle">
            Exploring LLMs, RAG pipelines, AI agents, and scalable backend systems through hands-on tutorials and breakdowns.
          </p>
        </div>
        <div className="hero__decoration" />
      </section>

      {/* Content */}
      <section className="home__content container">
        <SearchBar
          onSearch={handleSearch}
          onTagFilter={handleTagFilter}
          activeTags={activeTags}
        />

        {loading ? (
          <Loader text="Loading articles…" />
        ) : blogs.length === 0 ? (
          <div className="home__empty animate-fade-in">
            <span className="home__empty-icon">📝</span>
            <h3>No articles found</h3>
            <p>
              {search || activeTags.length > 0
                ? "Try adjusting your search or filters"
                : "Be the first to write something amazing"}
            </p>
          </div>
        ) : (
          <>
            <div className="home__grid">
              {blogs.map((blog, i) => (
                <BlogCard key={blog._id} blog={blog} index={i} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="home__pagination" id="pagination">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  id="page-prev-btn"
                >
                  <FiChevronLeft size={16} />
                  Previous
                </button>

                <span className="home__page-info">
                  {page} / {totalPages}
                </span>

                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  id="page-next-btn"
                >
                  Next
                  <FiChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
