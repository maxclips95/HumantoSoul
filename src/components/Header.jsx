import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Header.css";
import GlobalVoiceSearch from "./common/GlobalVoiceSearch";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMissionOpen, setIsMissionOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsMissionOpen(false);
    setIsResourcesOpen(false);
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
          </div>
        </div>

        <Link to="/announcements" className="nav-item" onClick={closeMenu}>Announcements</Link>
        <Link to="/satvic-lifestyle" className="nav-item" onClick={closeMenu}>Vegetarian Living</Link>
        <Link to="/prophecies" className="nav-item shine-effect" onClick={closeMenu}>Prophecies</Link>
        <Link to="/blog" className="nav-item" onClick={closeMenu}>Teachings</Link>
        <Link to="/gallery" className="nav-item" onClick={closeMenu}>Media</Link>
        <Link to="/downloads" className="nav-item" onClick={closeMenu}>Programmes</Link>

        {/* RESOURCES DROPDOWN */}
        <div
          className="dropdown-parent"
          onMouseEnter={() => setIsResourcesOpen(true)}
          onMouseLeave={() => setIsResourcesOpen(false)}
        >
          <button
            className="nav-item dropdown-btn"
            onClick={() => setIsResourcesOpen(!isResourcesOpen)}
            aria-expanded={isResourcesOpen}
          >
            Resources {isResourcesOpen ? '▲' : '▼'}
          </button>
          <div className={`dropdown-panel ${isResourcesOpen ? 'show' : ''}`}>
            <Link to="/literature" className="dropdown-link" onClick={() => { closeMenu(); setIsResourcesOpen(false); }}>Literature &amp; Downloads</Link>
            <Link to="/glossary" className="dropdown-link" onClick={() => { closeMenu(); setIsResourcesOpen(false); }}>📖 Spiritual Glossary</Link>
          </div>
        </div>

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
