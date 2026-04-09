import { FiGithub, FiHeart } from "react-icons/fi";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer" id="main-footer">
      <div className="footer__inner container">
        <div className="footer__brand">
          <span className="footer__logo-icon">✦</span>
          <span className="footer__logo-text">Yash's Journal</span>
        </div>

        <p className="footer__tagline">
          Crafted with <FiHeart size={13} className="footer__heart" /> for curious minds
        </p>

        <div className="footer__bottom">
          <span className="footer__copy">
            © {new Date().getFullYear()} Yash's Journal. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
