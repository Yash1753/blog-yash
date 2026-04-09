import "./Loader.css";

export default function Loader({ text = "Loading…" }) {
  return (
    <div className="loader" id="page-loader">
      <div className="loader__spinner" />
      <span className="loader__text">{text}</span>
    </div>
  );
}
