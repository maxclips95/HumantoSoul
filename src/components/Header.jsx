import React, { useState } from "react";
import { Link } from "react-router-dom";

function Header() {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <header className="header">
      {/* LOGO */}
      <div className="logo">
        <Link to="/">
          <img src={process.env.PUBLIC_URL + "/logo512.png"} alt="Logo" />
        </Link>
      </div>

      {/* NAVIGATION MENU */}
      <nav className="nav-menu">
        <Link to="/" className="nav-item">
          Home
        </Link>

        {/* ABOUT US DROPDOWN */}
        <div
          className={`dropdown-parent nav-item ${
            dropdownVisible ? "active" : ""
          }`}
          onMouseEnter={toggleDropdown}
          onMouseLeave={toggleDropdown}
        >
          About Us
          <div className="dropdown-panel">
            <Link to="/about" className="dropdown-link">
              Santmat
            </Link>
            <Link to="/baba-umakant" className="dropdown-link">
              Baba Umakant Ji Maharaj
            </Link>
            <Link to="/baba-jaigurudev" className="dropdown-link">
              Baba Jaigurudev Ji Maharaj
            </Link>
          </div>
        </div>

        <Link to="/announcements" className="nav-item">
          Announcements
        </Link>

        <Link to="/gallery" className="nav-item">
          Gallery
        </Link>

        <Link to="/prarthana" className="nav-item">
          Prarthana
        </Link>

        <Link to="/prophecies" className="nav-item">
          Prophecies
        </Link>

        <Link to="/contact" className="nav-item">
          Contact
        </Link>
      </nav>

      {/* LANGUAGE SELECTOR */}
      <div className="language-selector">
        <select>
          <option>English</option>
          <option>Hindi</option>
        </select>
      </div>
    </header>
  );
}

export default Header;
