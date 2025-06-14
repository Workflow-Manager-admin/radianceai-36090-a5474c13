import React from 'react';
import { useNavigate } from 'react-router-dom';

// PUBLIC_INTERFACE
/**
 * TopNavBar component - Always visible on all pages.
 * 'GlowSkin' acts as a clickable link that redirects home.
 */
function TopNavBar() {
  const navigate = useNavigate();

  const handleBrandClick = (e) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <nav
      className="navbar"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 100,
        background: 'var(--kavia-dark, #1A1A1A)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)', // subtle
      }}
    >
      <div
        className="navbar-brand title"
        role="button"
        tabIndex={0}
        style={{
          cursor: 'pointer',
          userSelect: 'none',
          color: 'var(--kavia-orange, #E87A41)',
          fontWeight: 800,
          fontSize: '2rem',
          letterSpacing: '0.04em',
        }}
        onClick={handleBrandClick}
        onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') handleBrandClick(e); }}
        aria-label="Go to homepage"
      >
        GlowSkin
      </div>
      {/* Add nav links/buttons here if needed */}
    </nav>
  );
}

export default TopNavBar;
