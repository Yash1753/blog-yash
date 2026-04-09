import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FiX, FiMail, FiLock, FiUser } from "react-icons/fi";
import toast from "react-hot-toast";
import "./AuthModal.css";

export default function AuthModal({ initialTab = "login", onClose }) {
  const [tab, setTab] = useState(initialTab);
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (tab === "login") {
        await login(form.email, form.password);
      } else {
        await signup(form.name, form.email, form.password);
      }
      onClose();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} id="auth-modal-overlay">
      <div
        className="modal-content auth-modal"
        onClick={(e) => e.stopPropagation()}
        id="auth-modal"
      >
        <button className="auth-modal__close" onClick={onClose} id="auth-modal-close">
          <FiX size={20} />
        </button>

        <div className="auth-modal__header">
          <h2 className="auth-modal__title">
            {tab === "login" ? "Welcome back" : "Join us"}
          </h2>
          <p className="auth-modal__subtitle">
            {tab === "login"
              ? "Enter your credentials to continue"
              : "Create an account to get started"}
          </p>
        </div>

        <div className="auth-modal__tabs">
          <button
            className={`auth-modal__tab ${tab === "login" ? "auth-modal__tab--active" : ""}`}
            onClick={() => setTab("login")}
            id="auth-tab-login"
          >
            Log in
          </button>
          <button
            className={`auth-modal__tab ${tab === "signup" ? "auth-modal__tab--active" : ""}`}
            onClick={() => setTab("signup")}
            id="auth-tab-signup"
          >
            Sign up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-modal__form">
          {tab === "signup" && (
            <div className="auth-modal__field animate-fade-in">
              <FiUser size={16} className="auth-modal__field-icon" />
              <input
                type="text"
                name="name"
                placeholder="Full name"
                value={form.name}
                onChange={onChange}
                required
                id="auth-name-input"
              />
            </div>
          )}

          <div className="auth-modal__field">
            <FiMail size={16} className="auth-modal__field-icon" />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              onChange={onChange}
              required
              id="auth-email-input"
            />
          </div>

          <div className="auth-modal__field">
            <FiLock size={16} className="auth-modal__field-icon" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={onChange}
              required
              minLength={6}
              id="auth-password-input"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary auth-modal__submit"
            disabled={loading}
            id="auth-submit-btn"
          >
            {loading
              ? "Please wait…"
              : tab === "login"
              ? "Log in"
              : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}
