import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Header.css";
import GlobalVoiceSearch from "./common/GlobalVoiceSearch";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMissionOpen, setIsMissionOpen] = useState(false);

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsMissionOpen(false);
  };

  return (
    <header className="header">

      {/* HAMBURGER ICON (MOBILE) */}
      <div className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <div></div>
        <div></div>
        <div></div>
      </div>

      {/* NAVIGATION MENU */}
      <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
        <Link to="/" className="nav-item" onClick={closeMenu}>Home</Link>

        {/* MISSION DROPDOWN — React state + CSS hover */}
        <div 
          className="dropdown-parent"
          onMouseEnter={() => setIsMissionOpen(true)}
          onMouseLeave={() => setIsMissionOpen(false)}
        >
          <button 
            className="nav-item dropdown-btn" 
            onClick={() => setIsMissionOpen(!isMissionOpen)}
            aria-expanded={isMissionOpen}
          >
            Mission {isMissionOpen ? '▲' : '▼'}
          </button>
          <div className={`dropdown-panel ${isMissionOpen ? 'show' : ''}`}>
            <Link to="/about" className="dropdown-link" onClick={() => { closeMenu(); setIsMissionOpen(false); }}>Our Mission &amp; Santmat</Link>
            <Link to="/baba-jaigurudev" className="dropdown-link" onClick={() => { closeMenu(); setIsMissionOpen(false); }}>Baba Jaigurudev Ji Maharaj</Link>
            <Link to="/baba-umakant" className="dropdown-link" onClick={() => { closeMenu(); setIsMissionOpen(false); }}>Baba Umakant Ji Maharaj</Link>
            <Link to="/announcements" className="dropdown-link" onClick={() => { closeMenu(); setIsMissionOpen(false); }}>Announcements</Link>
          </div>
        </div>

        <Link to="/prarthana" className="nav-item" onClick={closeMenu}>Meditation</Link>
        <Link to="/satvic-lifestyle" className="nav-item" onClick={closeMenu}>Vegetarian Living</Link>
        <Link to="/prophecies" className="nav-item shine-effect" onClick={closeMenu}>Prophecies</Link>
        <Link to="/blog" className="nav-item" onClick={closeMenu}>Teachings</Link>
        <Link to="/gallery" className="nav-item" onClick={closeMenu}>Media</Link>
        <Link to="/literature" className="nav-item" onClick={closeMenu}>Resources</Link>
        <Link to="/downloads" className="nav-item" onClick={closeMenu}>Programmes</Link>
        <Link to="/contact" className="nav-item" onClick={closeMenu}>Contact</Link>
      </nav>

      {/* GOOGLE TRANSLATE */}
      <div className="language-selector" style={{ color: '#fff', fontSize: '14px', display: 'flex', alignItems: 'center' }}>
        <i className="fas fa-globe" style={{ marginRight: '6px', fontSize: '14px' }}></i>
        <div id="google_translate_element" style={{ display: 'inline-block' }}></div>
        <GlobalVoiceSearch />
      </div>
    </header>
  );
}

export default Header;
