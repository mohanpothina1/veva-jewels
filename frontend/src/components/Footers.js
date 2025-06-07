import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand Section */}
        <div className="footer-brand">
          <h2>Veva Jewels</h2>
          <p>Elegance. Forever.</p>
        </div>

        {/* Quick Links */}
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#products">Products</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>

        {/* Contact Information */}
        <div className="footer-contact">
          <h4>Contact Us</h4>
          <p>Email: support@vevajewels.com</p>
          <p>Phone: +1 234 567 890</p>
          <p>Location: New York, USA</p>
        </div>

        {/* Social Media Icons */}
        <div className="footer-social">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://pinterest.com" target="_blank" rel="noreferrer">
              <i className="fab fa-pinterest"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Veva Jewels. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
