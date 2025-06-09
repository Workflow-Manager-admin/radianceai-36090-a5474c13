import React from "react";
import { Link, useLocation } from "react-router-dom";
// Optionally add motion for entrance/hover effects
import { motion } from "framer-motion";

/**
 * TopNavBar: Modern premium RadianceAI branded headerbar.
 * Key features: subtle glass/pastel gradients, soft drop shadows, logo+brand lockup,
 * high contrast for nav actions, improved accessibility, Apple-like visual weight.
 */

// Brand logo SVG (customizable, but pastel/gradient circle + text is on-theme)
function BrandLogo() {
  // PUBLIC_INTERFACE
  // Main logo: pastel gradient orb with "RadianceAI" wordmark
  return (
    <Link to="/" className="logo-link" aria-label="Go home">
      <span className="logo-mark">
        <svg width="34" height="34" viewBox="0 0 34 34">
          <defs>
            <radialGradient id="glow" cx="70%" cy="45%" r="73%">
              <stop offset="0%" stopColor="#fecbf7" />
              <stop offset="65%" stopColor="#fadadd" />
              <stop offset="78%" stopColor="#e7b3ff" />
            </radialGradient>
            <linearGradient id="stroke" x1="0%" y1="65%" x2="80%" y2="40%">
              <stop offset="0%" stopColor="#f339db" />
              <stop offset="100%" stopColor="#e7b3ff" />
            </linearGradient>
          </defs>
          <circle cx="17" cy="17" r="16"
            fill="url(#glow)"
            stroke="url(#stroke)"
            strokeWidth="2.5"
            filter="url(#dropshadow)"
          />
        </svg>
      </span>
      <span className="logo-word">
        <span className="logo-symbol">Radiance</span>
        <span className="logo-accent">AI</span>
      </span>
    </Link>
  );
}

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/quiz", label: "Quiz" },
  { to: "/recommendations", label: "Discover" },
  { to: "/routine", label: "Routine" },
  { to: "/progress", label: "Progress" },
  { to: "/weather", label: "Weather" },
  { to: "/chat", label: "AI Chat" },
  { to: "/email", label: "Email" },
];

function TopNavBar() {
  // PUBLIC_INTERFACE
  // Visually striking, gradient, animated, and responsive top nav bar
  const location = useLocation();

  return (
    <motion.header
      className="top-navbar"
      initial={{ y: -36, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 44, damping: 22 }}
      style={{
        background: "var(--navbar-gradient)",
        boxShadow:
          "0 2.5px 32px 0 #fadadd44, 0 8px 32px #e7b3ff22, var(--shadow-1)",
        borderBottom: "1.5px solid var(--border-color)",
        backdropFilter: "blur(24px)",
      }}
    >
      <div className="top-navbar-inner">
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <BrandLogo />
          {/* Optional: Add theme/brand tagline */}
          <span
            className="brand-tagline"
            style={{
              color: "var(--accent)",
              fontWeight: 500,
              marginLeft: 10,
              fontSize: 15.7,
              letterSpacing: ".03em",
              opacity: 0.7,
              display: window.innerWidth >= 650 ? "block" : "none",
            }}
          >
            Glow. Routine. Results.
          </span>
        </div>
        <nav className="top-navbar-actions" aria-label="Main">
          {navLinks.map((nav) => {
            // Apply strong highlight for current section
            const isActive =
              location.pathname === nav.to ||
              (nav.to !== "/" &&
                location.pathname.startsWith(nav.to));
            return (
              <Link
                key={nav.to}
                to={nav.to}
                className={
                  "nav-action-btn topbar-nav-btn" +
                  (isActive ? " nav-action-btn--active" : "")
                }
                style={{
                  background: isActive
                    ? "linear-gradient(98deg,#fadaddbb 60%, #f339db33 110%)"
                    : "none",
                  color: isActive ? "#d2195b" : "var(--text-color)",
                  fontWeight: isActive ? 800 : 600,
                  fontSize: 16.4,
                  borderRadius: "var(--radius-s)",
                  padding: "7px 13px",
                  boxShadow: isActive
                    ? "0 1.5px 14px #fadadd29, 0 0.5px 6px #f339db1a"
                    : "none",
                  margin: "0 4px",
                  transition:
                    "background .18s, color .15s, box-shadow .18s, transform .13s",
                  display: window.innerWidth >= 650 ? "inline-flex" : "none",
                }}
                aria-current={isActive ? "page" : undefined}
                tabIndex={0}
              >
                {nav.label}
              </Link>
            );
          })}
          {/* Responsive menu: truncate nav to 2-3 key items and show overflow as icon on mobile if wanted */}
        </nav>
        <div
          className="navbar-glow"
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            opacity: 0.15,
            pointerEvents: "none",
            zIndex: 0,
            background: "radial-gradient(ellipse at 60% 12%, #f339db33 0px, #e7b3ff11 80%, transparent 100%)",
            mixBlendMode: "lighten",
          }}
        />
      </div>
    </motion.header>
  );
}

export default TopNavBar;
