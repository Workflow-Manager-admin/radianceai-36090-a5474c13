import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * PUBLIC_INTERFACE
 * Modernized top navigation bar with premium gradients, app branding, and primary navigation items.
 */
const NAV_ITEMS = [
  {
    key: "home",
    label: "Home",
    to: "/"
  },
  {
    key: "quiz",
    label: "Quiz",
    to: "/quiz"
  },
  {
    key: "routine",
    label: "Routine",
    to: "/routine"
  },
  {
    key: "products",
    label: "Products",
    to: "/products"
  },
  {
    key: "progress",
    label: "Progress",
    to: "/progress"
  }
];

const TopNavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Render navigation buttons in visually cohesive layout with logo
  return (
    <nav className="top-navbar" aria-label="Top navigation">
      <div className="top-navbar-inner" style={{
        width: "100%",
        maxWidth: 1060,
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 22px"
      }}>
        {/* Logo + Brand */}
        <div
          className="logo"
          onClick={() => navigate("/")}
          style={{
            cursor: "pointer",
            userSelect: "none",
            letterSpacing: ".03em",
            display: "flex",
            alignItems: "center"
          }}
          tabIndex={0}
          aria-label="RadianceAI Home"
        >
          <span className="logo-symbol" style={{
            fontSize: 32,
            marginRight: 7,
            color: "var(--radiance-ai-accent)"
          }}>✦</span>
          <span style={{
            fontWeight: 900,
            fontSize: "1.38rem",
            background: "linear-gradient(92deg, var(--pink), var(--lilac))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textFillColor: "transparent"
          }}>
            RadianceAI
          </span>
        </div>
        
        {/* Main Navigation Buttons */}
        <div className="top-navbar-actions" style={{
          display: "flex",
          alignItems: "center",
          gap: 10
        }}>
          {NAV_ITEMS.map(item => {
            const active = location.pathname === item.to;
            return (
              <button
                key={item.key}
                className={`nav-action-btn${active ? " nav-action-btn--active" : ""}`}
                tabIndex={0}
                aria-label={item.label}
                onClick={() => navigate(item.to)}
                style={{
                  border: "none",
                  outline: active ? `2.5px solid var(--accent)` : "none",
                  background: "none",
                  position: "relative",
                  color: active ? "var(--accent)" : "var(--text-color)",
                  fontSize: "1.11rem",
                  fontWeight: 700,
                  letterSpacing: ".01em",
                  padding: "8px 15px",
                  borderRadius: "17px",
                  boxShadow: active ? "0 2px 16px #fadadd44" : "none",
                  transition: "all 0.16s var(--motion-snappy)",
                  backgroundImage: active ? "linear-gradient(93deg,#fadadd 40%,#e7b3ff 98%)" : "none",
                  zIndex: active ? 2 : 1
                }}
              >
                {item.label}
                {/* Soft active shadow & animated glow (for active) */}
                {active && (
                  <span
                    style={{
                      position: "absolute",
                      left: 7,
                      right: 7,
                      bottom: 3,
                      height: 3,
                      borderRadius: 4,
                      background: "linear-gradient(90deg, var(--accent) 60%, var(--lilac))",
                      boxShadow: "0 2px 14px #fadadd77",
                      opacity: 0.38,
                      transition: "background 0.18s"
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>

      </div>
    </nav>
  );
};

export default TopNavBar;
