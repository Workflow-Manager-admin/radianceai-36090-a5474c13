import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * PUBLIC_INTERFACE
 * Top navigation bar with Apple-like styling.
 */
const TopNavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Soft background + blurred, semi-transparent Apple-style effect
  return (
    <nav
      className="top-navbar"
      style={{
        background: "rgba(10,18,42,0.98)",
        backdropFilter: "blur(12px)",
        borderRadius: "0 0 22px 22px",
        boxShadow: "0 8px 24px 0 rgba(0,0,0,0.12)",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        zIndex: 101,
        height: 62,
        display: "flex",
        alignItems: "center",
        transition: "box-shadow 0.25s cubic-bezier(.27,1.36,.48,1), background 0.3s",
      }}
      aria-label="Top navigation"
    >
      <div style={{
        width: "100%",
        maxWidth: 1000,
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 22px",
      }}>
        <div
          onClick={() => navigate("/")}
          className="logo"
          style={{
            fontWeight: 700,
            fontSize: 20,
            display: "flex",
            alignItems: "center",
            gap: 10,
            letterSpacing: ".05em",
            color: "var(--base-light, #00ffff)",
            cursor: "pointer",
            userSelect: "none"
          }}
        >
          <span className="logo-symbol" style={{fontSize:28, color:'var(--base-light, #00ffff)'}}>⦿</span>
          RadianceAI
        </div>
        <div>
          <button
            className="btn btn-large"
            style={{
              background: "linear-gradient(93deg,#fadadd 20%,#e7b3ff 100%)",
              color: "#27174e",
              borderRadius: 14,
              fontWeight: 600,
              fontSize: "1rem",
              padding: "10px 24px",
              boxShadow: "0 1px 10px 0 rgba(0,0,0,0.07)",
              transition: "background 0.18s, box-shadow 0.2s",
              outline: location.pathname === "/quiz" ? "2px solid #e7b3ff" : "none"
            }}
            onClick={() => navigate("/quiz")}
          >
            Start Quiz
          </button>
        </div>
      </div>
    </nav>
  );
};

export default TopNavBar;
