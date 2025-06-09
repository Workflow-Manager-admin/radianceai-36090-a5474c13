import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * PUBLIC_INTERFACE
 * Persistent animated bottom navigation bar.
 */
const NAV_ITEMS = [
  {
    key: "home",
    icon: (
      <svg width="26" height="26" fill="none" viewBox="0 0 24 24">
        <path d="M4 10.7V20h5.3v-4.1h5.4V20H20V10.7l-8-6.4-8 6.4Z" stroke="#FFF" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
    label: "Home",
    to: "/"
  },
  {
    key: "quiz",
    icon: (
      <svg width="26" height="26" fill="none" viewBox="0 0 24 24">
        <rect x="4" y="5" width="16" height="15" rx="4" stroke="#FFF" strokeWidth="1.5"/>
        <circle cx="9" cy="11" r="1" fill="#FFF"/>
        <circle cx="15" cy="11" r="1" fill="#FFF"/>
        <rect x="8" y="15" width="8" height="1.2" rx="0.6" fill="#FFF"/>
      </svg>
    ),
    label: "Quiz",
    to: "/quiz"
  },
  {
    key: "routine",
    icon: (
      <svg width="26" height="26" fill="none" viewBox="0 0 24 24">
        <rect x="4" y="4" width="16" height="16" rx="5" stroke="#FFF" strokeWidth="1.5"/>
        <rect x="8" y="9" width="8" height="1.5" rx=".75" fill="#FFF"/>
        <rect x="8" y="13" width="5" height="1.5" rx=".75" fill="#FFF"/>
      </svg>
    ),
    label: "Routine",
    to: "/routine"
  },
  {
    key: "products",
    icon: (
      <svg width="26" height="26" fill="none" viewBox="0 0 24 24">
        <rect x="6" y="6" width="12" height="12" rx="3" stroke="#FFF" strokeWidth="1.5"/>
        <rect x="9.5" y="9.5" width="5" height="5" rx="2.5" fill="#FFF"/>
      </svg>
    ),
    label: "Products",
    to: "/products"
  },
  {
    key: "progress",
    icon: (
      <svg width="26" height="26" fill="none" viewBox="0 0 24 24">
        <rect x="4" y="11" width="3.5" height="7" rx="1.5" fill="#FFF" opacity=".6"/>
        <rect x="9.25" y="6.5" width="3.5" height="11.5" rx="1.5" fill="#FFF" opacity=".8"/>
        <rect x="14.5" y="9.5" width="3.5" height="8.5" rx="1.5" fill="#FFF"/>
      </svg>
    ),
    label: "Progress",
    to: "/progress"
  }
];

const BottomNavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav
      className="bottom-navbar"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100vw",
        zIndex: 120,
        background: "rgba(37,23,78,0.93)",
        backdropFilter: "blur(8px)",
        borderRadius: "22px 22px 0 0",
        padding: "8px 0 4px 0",
        boxShadow: "0 -4px 18px 0 rgba(70, 40, 120, 0.12)",
        display: "flex",
        justifyContent: "center",
        transition: "box-shadow 0.22s cubic-bezier(.27,1.36,.48,1), background 0.22s",
      }}
      aria-label="Bottom navigation"
    >
      <div style={{
        width: "100%",
        maxWidth: 560,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 0,
        padding: "0 25px",
      }}>
        {NAV_ITEMS.map(item => {
          const active = location.pathname === item.to;
          return (
            <button
              key={item.key}
              onClick={() => navigate(item.to)}
              aria-label={item.label}
              className="nav-action-btn"
              style={{
                flex: 1,
                background: "none",
                border: "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 0,
                padding: "9px 2px 5px 2px",
                opacity: active ? 1 : 0.72,
                transform: active ? "translateY(-4px) scale(1.1)" : "none",
                transition: "all .19s cubic-bezier(.36,1.94,.48,1)",
                borderRadius: 16,
                outline: active ? "2.5px solid #fadadd" : "none"
              }}
            >
              {item.icon}
              <div style={{
                fontSize: 12.2,
                marginTop: 1,
                color: "#fff",
                letterSpacing: ".01em",
                fontWeight: active ? 700 : 500,
                textShadow: active ? "0 1px 8px #fadadd70" : undefined
              }}>
                {item.label}
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavBar;
