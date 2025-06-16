import React from "react";
import { Link, useLocation } from "react-router-dom";

// PUBLIC_INTERFACE
/**
 * TopNavBar
 * Main navigation bar, Apple-inspired minimal style.
 * Fixed at the top, features links to core app routes.
 */
function TopNavBar() {
  const location = useLocation();

  // Visibility: Hide on certain pages if needed (currently always shown)
  // You can modify this if there are routes that should hide navbar.

  return (
    <header
      className="top-navbar"
      style={{
        position: "fixed",
        top: 0,
        width: "100%",
        zIndex: 100,
        background: "rgba(255,255,255,0.73)",
        backdropFilter: "blur(7px)",
        borderBottom: "1px solid var(--border-color, rgba(0,0,0,0.05))",
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 1.5px 8px 0 rgba(71,0,71,0.04)",
        padding: "0 1.2rem",
        transition: "background 0.35s cubic-bezier(.27,1.36,.58,1)",
      }}
    >
      {/* Brand Logo/Name */}
      <Link
        to="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.7em",
          fontWeight: 700,
          color: "var( #77a6ed)",
          fontSize: "1.45rem",
          letterSpacing: "-0.03em",
          padding: "0.1em 0.5em 0.1em 0",
          textDecoration: "none",
        }}
      >
        {/* Brand Icon (skin droplet, could be replaced with SVG or img if branded) */}
        <span
          style={{
            display: "inline-block",
            width: 28,
            height: 28,
            borderRadius: "50%",
            background:
              "linear-gradient(133deg, #77a6ed 55%, #e7b3ff 100%)",
            boxShadow: "0 2px 8px #fadadd55, 0 1px #fadadd77",
            marginRight: 7,
            transform: "translateY(1px)",
          }}
        />
        GlowSkin
      </Link>

      {/* Navigation Links */}
      <nav
        style={{
          display: "flex",
          gap: "1.3rem",
          alignItems: "center",
          fontSize: "1.08rem",
        }}
      >
        <Link
          to="/quiz"
          style={{
            color: location.pathname === "/quiz" ? "#77a6ed" : "var(--kavia-dark)",
            fontWeight: location.pathname === "/quiz" ? 700 : 500,
            opacity: 0.88,
            textDecoration: "none",
            transition: "color 0.19s",
          }}
        >
          Quiz
        </Link>
        <Link
          to="/routine"
          style={{
            color: location.pathname === "/routine" ? "#77a6ed" : "var(--kavia-dark)",
            fontWeight: location.pathname === "/routine" ? 700 : 500,
            opacity: 0.88,
            textDecoration: "none",
            transition: "color 0.19s",
          }}
        >
          Routine
        </Link>
        <Link
          to="/recommendations"
          style={{
            color: location.pathname === "/recommendations" ? "#77a6ed" : "var(--kavia-dark)",
            fontWeight: location.pathname === "/recommendations" ? 700 : 500,
            opacity: 0.88,
            textDecoration: "none",
            transition: "color 0.19s",
          }}
        >
          Recommendations
        </Link>
        <Link
          to="/all-products"
          style={{
            color: location.pathname === "/all-products" ? "#77a6ed" : "var(--kavia-dark)",
            fontWeight: location.pathname === "/all-products" ? 700 : 500,
            opacity: 0.88,
            textDecoration: "none",
            transition: "color 0.19s",
          }}
        >
          Products
        </Link>
        <Link
          to="/weather"
          style={{
            color: location.pathname === "/weather" ? "#77a6ed" : "var(--kavia-dark)",
            fontWeight: location.pathname === "/weather" ? 700 : 500,
            opacity: 0.88,
            textDecoration: "none",
            transition: "color 0.19s",
          }}
        >
          Weather
        </Link>
        <Link
          to="/email"
          style={{
            color: location.pathname === "/email" ? "#77a6ed" : "var(--kavia-dark)",
            fontWeight: location.pathname === "/email" ? 700 : 500,
            opacity: 0.88,
            textDecoration: "none",
            transition: "color 0.19s",
          }}
        >
          Email
        </Link>
        <Link
          to="/chat"
          style={{
            color: location.pathname === "/chat" ? "#77a6ed" : "var(--kavia-dark)",
            fontWeight: location.pathname === "/chat" ? 700 : 500,
            opacity: 0.88,
            textDecoration: "none",
            transition: "color 0.19s",
          }}
        >
          Chatbot
        </Link>
      </nav>
    </header>
  );
}

export default TopNavBar;
