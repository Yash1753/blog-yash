import { useState, useEffect } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import "./SearchBar.css";

export default function SearchBar({ onSearch, onTagFilter, activeTags = [] }) {
  const [query, setQuery] = useState("");

  // Debounced search
  useEffect(() => {
    const timeout = setTimeout(() => {
      onSearch(query);
    }, 400);
    return () => clearTimeout(timeout);
  }, [query, onSearch]);

  const popularTags = ["tech", "design", "life", "coding", "react", "node"];

  return (
    <div className="search-bar" id="search-bar">
      <div className="search-bar__input-wrapper">
        <FiSearch size={18} className="search-bar__icon" />
        <input
          type="text"
          placeholder="Search articles…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-bar__input"
          id="search-input"
        />
        {query && (
          <button
            className="search-bar__clear"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            id="search-clear-btn"
          >
            <FiX size={16} />
          </button>
        )}
      </div>

      <div className="search-bar__tags">
        {popularTags.map((tag) => (
          <button
            key={tag}
            className={`tag ${activeTags.includes(tag) ? "tag--active" : ""}`}
            onClick={() => onTagFilter(tag)}
            id={`tag-filter-${tag}`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
