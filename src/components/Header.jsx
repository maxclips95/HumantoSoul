import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Header.css";
import GlobalVoiceSearch from "./common/GlobalVoiceSearch";

function Header() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // googleTranslateElementInit is handled in index.html
  }, []);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
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

        {/* ABOUT US DROPDOWN */}
        <div className="dropdown-parent" style={{ position: 'relative' }}>
          <button
            className="nav-item"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: 'bold',
              color: '#fff',
              fontSize: '16px'
            }}
            onClick={toggleDropdown}
          >
            About Us ▼
          </button>
          {dropdownVisible && (
            <div
              className="dropdown-panel"
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                backgroundColor: '#fff',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                minWidth: '200px',
                zIndex: 100,
                padding: '10px 0'
              }}
            >
              <Link to="/about" className="dropdown-link" style={{ display: 'block', padding: '8px 16px', color: '#333', textDecoration: 'none' }} onClick={closeMenu}>Santmat</Link>
              <Link to="/baba-umakant" className="dropdown-link" style={{ display: 'block', padding: '8px 16px', color: '#333', textDecoration: 'none' }} onClick={closeMenu}>Baba Umakant Ji Maharaj</Link>
              <Link to="/baba-jaigurudev" className="dropdown-link" style={{ display: 'block', padding: '8px 16px', color: '#333', textDecoration: 'none' }} onClick={closeMenu}>Baba Jaigurudev Ji Maharaj</Link>
            </div>
          )}
        </div>

        <Link to="/satvic-lifestyle" className="nav-item shine-effect" onClick={closeMenu}>Healthy Living 🌿</Link>
        <Link to="/blog" className="nav-item shine-effect" onClick={closeMenu}>Blog 📝</Link>
        <Link to="/announcements" className="nav-item shine-effect" onClick={closeMenu}>Announcements 📢</Link>
        <Link to="/gallery" className="nav-item" onClick={closeMenu}>Gallery</Link>
        <Link to="/literature" className="nav-item" onClick={closeMenu}>Literature/FAQs</Link>
        <Link to="/prarthana" className="nav-item" onClick={closeMenu}>Prarthana</Link>
        <Link to="/prophecies" className="nav-item shine-effect" onClick={closeMenu}>Prophecies 🔮</Link>
        <Link to="/downloads" className="nav-item" onClick={closeMenu}>Downloads</Link>
        <Link to="/contact" className="nav-item" onClick={closeMenu}>Contact</Link>
      </nav>

      {/* GOOGLE TRANSLATE - ONLY DROPDOWN */}
      <div className="language-selector" style={{ color: '#fff', fontSize: '14px', display: 'flex', alignItems: 'center' }}>
        <i className="fas fa-globe" style={{ marginRight: '6px', fontSize: '14px' }}></i>
        <div id="google_translate_element" style={{ display: 'inline-block' }}></div>

        {/* GLOBAL VOICE SEARCH */}
        <GlobalVoiceSearch />
      </div>
    </header>
  );
}

export default Header;
