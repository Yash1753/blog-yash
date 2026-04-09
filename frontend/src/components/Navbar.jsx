import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { FiLogOut, FiUser, FiChevronDown } from "react-icons/fi";
import AuthModal from "./AuthModal";
import "./Navbar.css";

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState("login");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openLogin = () => {
    setAuthTab("login");
    setShowAuthModal(true);
  };

  const openSignup = () => {
    setAuthTab("signup");
    setShowAuthModal(true);
  };

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    navigate("/");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`} id="main-navbar">
        <div className="navbar__inner container">
          <Link to="/" className="navbar__logo" id="logo-link">
            <span className="navbar__logo-icon">✦</span>
            <span className="navbar__logo-text">Yash's Journal</span>
          </Link>

          <div className="navbar__actions">
            {isAdmin && (
              <Link to="/write" className="btn btn-primary btn-sm navbar__write-btn" id="write-blog-btn">
                <HiOutlinePencilSquare size={16} />
                <span>Write</span>
              </Link>
            )}

            {isAuthenticated ? (
              <div className="navbar__user" ref={dropdownRef}>
                <button
                  className="navbar__avatar-btn"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  id="user-avatar-btn"
                >
                  <span className="navbar__avatar">{getInitials(user?.name)}</span>
                  <FiChevronDown
                    size={14}
                    className={`navbar__chevron ${dropdownOpen ? "navbar__chevron--open" : ""}`}
                  />
                </button>

                {dropdownOpen && (
                  <div className="navbar__dropdown animate-slide-down" id="user-dropdown">
                    <div className="navbar__dropdown-header">
                      <span className="navbar__dropdown-name">{user?.name}</span>
                      <span className="navbar__dropdown-role">{user?.role}</span>
                    </div>
                    <div className="navbar__dropdown-divider" />
                    <button className="navbar__dropdown-item" onClick={handleLogout} id="logout-btn">
                      <FiLogOut size={15} />
                      <span>Log out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="navbar__auth-btns">
                <button className="btn btn-ghost btn-sm" onClick={openLogin} id="login-btn">
                  Log in
                </button>
                <button className="btn btn-primary btn-sm" onClick={openSignup} id="signup-btn">
                  Sign up
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {showAuthModal && (
        <AuthModal
          initialTab={authTab}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </>
  );
}
