import React from "react";
import "../css/Footer.css";
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaGithub, FaEnvelope, FaPhone } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        
      <ul className="footer-links">
  <li><Link to="/">Home</Link></li>
  <li><Link to="/about">About</Link></li>
  <li><Link to="/home">Contact</Link></li>
</ul>

        {/* Center: Social Media */}
        <div className="footer-social">
          <a href="#"><FaFacebookF /></a>
          <a href="#"><FaTwitter /></a>
          <a href="#"><FaInstagram /></a>
          <a href="#"><FaLinkedinIn /></a>
          <a href="https://github.com/joyroybdu"><FaGithub /></a>
        </div>

        {/* Right: Contact Info */}
        <div className="footer-contact">
          <a href="mailto:jrjoy1001@gmail.com"><FaEnvelope /> jrjoy1001@gmail.com</a>
          <a href="tel:+880123456789"><FaPhone /> +880 1234-56789</a>
        </div>
      </div>

      {/* Bottom Copyright */}
      <p className="footer-text">
        © {new Date().getFullYear()} All rights reserved by Joy Roy
      </p>
    </footer>
  );
};

export default Footer;
