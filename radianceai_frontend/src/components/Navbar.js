import React from "react";

// PUBLIC_INTERFACE
/**
 * Main navigation bar for RadianceAI.
 */
const Navbar = () => (
  <nav className="navbar">
    <div className="container" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
      <div className="logo">
        <span className="logo-symbol">*</span> RadianceAI
      </div>
      <div>
        {/* Navigation placeholder: update with links as features are implemented */}
        <button className="btn btn-large" style={{ marginLeft: 10 }}>Start Quiz</button>
      </div>
    </div>
  </nav>
);

export default Navbar;
