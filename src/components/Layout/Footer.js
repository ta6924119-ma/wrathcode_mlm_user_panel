import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaInstagram, 
  FaTwitter, 
  FaFacebook, 
  FaTelegram, 
  FaYoutube,
  FaEnvelope
} from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const aboutLinks = [
    { label: 'Terms of Use', path: '/terms' },
    { label: 'Risk Disclosure', path: '/risk' },
    { label: 'Privacy and Data Protection Policy', path: '/privacy' }
  ];

  const servicesLinks = [
    { label: 'Buy Crypto', path: '/buy-crypto' },
    { label: 'Fees', path: '/fees' },
    { label: 'Referral Program', path: '/referrals' },
    { label: 'Listing Application', path: '/listing' },
    { label: 'Arbitrage Trading Bot', path: '/arbitrage' },
    { label: 'Crypto Calculator', path: '/calculator' }
  ];

  const supportLinks = [
    { label: 'Help Center / FAQ', path: '/help' },
    { label: 'Career', path: '/career' },
    { label: 'Submit a Request', path: '/request' }
  ];

  const legalLinks = [
    { label: 'AML/KYC Policy', path: '/aml-kyc' },
    { label: 'Complaints Handling Procedure', path: '/complaints' },
    { label: 'General Disclaimer', path: '/disclaimer' }
  ];

  const socialLinks = [
    { icon: <FaInstagram />, url: 'https://instagram.com', label: 'Instagram' },
    { icon: <FaTwitter />, url: 'https://twitter.com', label: 'Twitter' },
    { icon: <FaFacebook />, url: 'https://facebook.com', label: 'Facebook' },
    { icon: <FaTelegram />, url: 'https://telegram.org', label: 'Telegram' },
    { icon: <FaYoutube />, url: 'https://youtube.com', label: 'YouTube' }
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-grid">
            {/* Left Column - Branding & Socials */}
            <div className="footer-column footer-brand">
              <div className="footer-logo">
                <span className="logo-icon">🚀</span>
                <span className="logo-text">WRATHCODE</span>
              </div>
              <p className="footer-tagline">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit nulla at ultrices urna adipiscing penatibus duis elementum ante.
              </p>
              <div className="footer-socials">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Middle Columns - Head Office & Contact */}
            <div className="footer-column">
              <h3 className="footer-heading">Head Office</h3>
              <div className="footer-content">
                <span className="flag-icon">🇮🇳</span>
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
              </div>
            </div>

            <div className="footer-column">
              <h3 className="footer-heading">Contact Us</h3>
              <div className="footer-content">
                <div className="contact-item">
                  <FaEnvelope className="contact-icon" />
                  <a href="mailto:support@qwerty.com" className="contact-link">support@qwerty.com</a>
                </div>
                <div className="contact-item">
                  <FaEnvelope className="contact-icon" />
                  <a href="mailto:admin@qwerty.com" className="contact-link">admin@qwerty.com</a>
                </div>
              </div>
            </div>
          </div>

          {/* Link Categories */}
          <div className="footer-links-grid">
            <div className="footer-links-column">
              <h4 className="footer-links-heading">About Us</h4>
              <ul className="footer-links-list">
                {aboutLinks.map((link, index) => (
                  <li key={index}>
                    <Link to={link.path} className="footer-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-links-column">
              <h4 className="footer-links-heading">Services</h4>
              <ul className="footer-links-list">
                {servicesLinks.map((link, index) => (
                  <li key={index}>
                    <Link to={link.path} className="footer-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-links-column">
              <h4 className="footer-links-heading">Support</h4>
              <ul className="footer-links-list">
                {supportLinks.map((link, index) => (
                  <li key={index}>
                    <Link to={link.path} className="footer-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-links-column">
              <h4 className="footer-links-heading">Legal</h4>
              <ul className="footer-links-list">
                {legalLinks.map((link, index) => (
                  <li key={index}>
                    <Link to={link.path} className="footer-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section - Copyright */}
        <div className="footer-bottom">
          <div className="footer-divider"></div>
          <p className="footer-copyright">
            Copyright © {currentYear} WRATHCODE. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
