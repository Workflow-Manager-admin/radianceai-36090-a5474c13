import React from "react";

/**
 * TopNavBar: Uses only the approved palette colors.
 */
function TopNavBar() {
  return (
    <nav
      className="top-navbar"
      style={{
        width: "100%",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 101,
        background: "linear-gradient(91deg,#dde9ff 65%,#FFF8EB 100%)",
        boxShadow: "0 4px 26px #abd4fc13, 0 1.2px 0 #dde9ff44",
        height: 65,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderBottom: "2.5px solid #dde9ff",
        padding: 0,
        transition: "background .28s",
      }}
    >
      <span
        style={{
          color: "#2050aa",
          fontWeight: 900,
          fontSize: "2.11em",
          letterSpacing: ".03em",
        }}
      >
        GlowSkin
      </span>
    </nav>
  );
}

export default TopNavBar;
