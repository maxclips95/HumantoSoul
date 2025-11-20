// src/components/Footer.jsx
import React from "react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-links">
        <div className="footer-column">
          <h3>Quick Links</h3>
          <ul>
            <li>Home</li>
            <li>About Us</li>
            <li>Downloads</li>
            <li>Gallery</li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Pages</h3>
          <ul>
            <li>Santmat</li>
            <li>Baba Jaigurudev Ji Maharaj</li>
            <li>Baba Umakant Ji Maharaj</li>
            <li>Prarthana</li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Contact</h3>
          <ul>
            <li>Email: info@example.com</li>
            <li>Phone: +91 1234567890</li>
          </ul>
        </div>
      </div>

      <p className="copyright">
        Copyright © {new Date().getFullYear()} JaiGurudev. All Rights Reserved.
      </p>
    </footer>
  );
}
