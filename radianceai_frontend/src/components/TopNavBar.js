import React from "react";
import { NavLink } from "react-router-dom";

/**
 * PUBLIC_INTERFACE
 * TopNavBar provides primary navigation for the app.
 * Renders links for: Home, Quiz, Discover, Routine, Progress, Weather, AI Chat, and Email,
 * and ensures accessible semantic HTML and active styling.
 */
const navItems = [
  { label: "Home", path: "/" },
  { label: "Quiz", path: "/quiz" },
  { label: "Discover", path: "/recommendations" },
  { label: "Routine", path: "/routine" },
  { label: "Progress", path: "/progress" },
  { label: "Weather", path: "/weather" },
  { label: "AI Chat", path: "/chat" },
  { label: "Email", path: "/email" },
];

const TopNavBar = () => {
  return (
    <nav
      aria-label="Main"
      className="navbar"
      style={{
        width: "100%",
        position: "fixed",
        top: 0,
        left: 0,
        height: 62,
        zIndex: 999,
        background: "rgba(255,255,255,0.98)",
        borderBottom: "1.5px solid var(--border-color, #f1f1f1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 2px 14px 0 rgba(120,41,148,0.03)",
        fontWeight: 500,
        fontSize: 18,
      }}
    >
      <div className="navbar-container" style={{ width: "100%", maxWidth: 1200, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px" }}>
        <span className="navbar-brand" style={{ fontFamily: "inherit", fontWeight: 700, fontSize: 22, color: "var(--kavia-orange, #E87A41)", letterSpacing: 1, marginRight: 20 }}>
          GlowSkin
        </span>
        <ul
          className="navbar-links"
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 18,
            margin: 0,
            padding: 0,
            listStyle: "none",
            alignItems: "center"
          }}
        >
          {navItems.map((item) => (
            <li key={item.label}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  isActive
                    ? "navbar-link active"
                    : "navbar-link"
                }
                aria-label={item.label}
                style={({ isActive }) => ({
                  textDecoration: "none",
                  color: isActive ? "var(--kavia-orange, #E87A41)" : "var(--kavia-dark, #1A1A1A)",
                  paddingBottom: 3,
                  borderBottom: isActive ? "2px solid var(--kavia-orange, #E87A41)" : "2px solid transparent",
                  fontWeight: isActive ? 700 : 500,
                  transition: "all 0.2s cubic-bezier(.42,0,1,1.38)",
                  background: "none",
                  fontSize: "1em"
                })}
                end={item.path === "/"}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default TopNavBar;
