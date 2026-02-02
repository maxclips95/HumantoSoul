import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Header.css";

function Header() {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    // 1. Define the callback function globally (required by Google)
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement({
        pageLanguage: 'en',
        autoDisplay: false,
      }, 'google_translate_element');
    };

    // 2. Load the script strictly if not already loaded
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.type = 'text/javascript';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <header className="header">



      {/* HAMBURGER ICON (MOBILE) */}
      <div className="hamburger" onClick={() => document.querySelector('.nav-menu').classList.toggle('active')}>
        <div></div>
        <div></div>
        <div></div>
      </div>

      {/* NAVIGATION MENU */}
      <nav className="nav-menu">
        <Link to="/" className="nav-item">Home</Link>

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
              <Link to="/about" className="dropdown-link" style={{ display: 'block', padding: '8px 16px', color: '#333', textDecoration: 'none' }}>Santmat</Link>
              <Link to="/baba-umakant" className="dropdown-link" style={{ display: 'block', padding: '8px 16px', color: '#333', textDecoration: 'none' }}>Baba Umakant Ji Maharaj</Link>
              <Link to="/baba-jaigurudev" className="dropdown-link" style={{ display: 'block', padding: '8px 16px', color: '#333', textDecoration: 'none' }}>Baba Jaigurudev Ji Maharaj</Link>
            </div>
          )}
        </div>

        <Link to="/satvic-lifestyle" className="nav-item shine-effect">Healthy Living 🌿</Link>
        <Link to="/blog" className="nav-item shine-effect">Blog 📝</Link>
        <Link to="/announcements" className="nav-item shine-effect">Announcements 📢</Link>
        <Link to="/gallery" className="nav-item">Gallery</Link>
        <Link to="/literature" className="nav-item">Literature/FAQs</Link>
        <Link to="/prarthana" className="nav-item">Prarthana</Link>
        <Link to="/prophecies" className="nav-item shine-effect">Prophecies 🔮</Link>
        <Link to="/downloads" className="nav-item">Downloads</Link>
        <Link to="/contact" className="nav-item">Contact</Link>
      </nav>

      {/* GOOGLE TRANSLATE - ONLY DROPDOWN */}
      <div className="language-selector" style={{ color: '#fff', fontSize: '18px', minWidth: '130px' }}>
        <i className="fas fa-globe" style={{ marginRight: '8px' }}></i>
        <div id="google_translate_element" style={{ display: 'inline-block' }}></div>
      </div>
    </header>
  );
}

export default Header;
