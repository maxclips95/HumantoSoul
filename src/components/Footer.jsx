// src/components/Footer.jsx
import React from "react";
import "../styles/Footer.css";
import Newsletter from "./Newsletter";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">

        <div className="footer-col">
          <h3>Contact</h3>
          <ul>
            <li><i className="fas fa-envelope"></i> &nbsp; info@jaigurudevukm.com</li>
            <li><i className="fas fa-phone"></i> &nbsp; +91 9754700200, 9575600700</li>
            <li><i className="fas fa-map-marker-alt"></i> &nbsp; Baba Jaigurudev Dharm Vikas Sanstha, Jaigurudev Nagar, Opposite to Pingleshwar Railway Station, Maksi Road, Ujjain (M.P.), India, PIN - 456001</li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>Social Media</h3>
          <div className="social-links">
            <a href="https://www.whatsapp.com/channel/0029VaAcAA40QeadmEmp9y3c" target="_blank" rel="noopener noreferrer" className="social-link">
              <i className="fab fa-whatsapp" style={{ color: '#25D366' }}></i> WhatsApp Channel
            </a>
            <a href="https://www.youtube.com/jaigurudevukm" target="_blank" rel="noopener noreferrer" className="social-link">
              <i className="fab fa-youtube" style={{ color: '#FF0000' }}></i> YouTube Channel
            </a>
            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="social-link">
              <i className="fab fa-facebook" style={{ color: '#1877F2' }}></i> Facebook Page
            </a>
            <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="social-link">
              <i className="fab fa-twitter" style={{ color: '#1DA1F2' }}></i> Twitter / X
            </a>
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="social-link">
              <i className="fab fa-instagram" style={{ color: '#E1306C' }}></i> Instagram
            </a>
          </div>
        </div>

        <div className="footer-col">
          <h3>Feedback / Suggestions</h3>
          <p style={{ lineHeight: '1.6', color: '#ddd' }}>
            For any feedback, suggestions, or queries,<br />
            please reach out to us at: <br />
            <a href="mailto:info@jaigurudevukm.com">info@jaigurudevukm.com</a>
          </p>

          <Newsletter />
        </div>
      </div>

      <p className="footer-copyright">
        Copyright © {new Date().getFullYear()} JaiGurudev. All Rights Reserved.
      </p>
      <p className="footer-note">
        Note: The initial load may take up to 30 seconds. Thereafter, the site operates smoothly. Jai Gurudev 🙏
      </p>
    </footer >
  );
}
