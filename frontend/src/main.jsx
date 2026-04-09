import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.9rem",
              borderRadius: "10px",
              background: "#fff",
              color: "#1A1A1A",
              boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
