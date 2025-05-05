import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import { useAuth } from "../context/AuthContext";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutModal(false);
    navigate("/");
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const isRecruiter = localStorage.getItem("role") === "recruiter";

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">RESUME</span>
          <span className="logo-text marketplace">MARKETPLACE</span>
        </Link>

        <div className={`navbar-menu ${isMenuOpen ? "active" : ""}`}>
          <Link
            to="/explore"
            className="navbar-item"
            onClick={() => setIsMenuOpen(false)}
          >
            Explore
          </Link>
          <Link
            to="/pricing"
            className="navbar-item"
            onClick={() => setIsMenuOpen(false)}
          >
            Pricing
          </Link>
          {isLoggedIn && isRecruiter && (
            <button
              className="navbar-item buy-contacts-btn"
              onClick={() => {
                setIsMenuOpen(false);
                navigate("/buy-contacts");
              }}
            >
              Buy Contacts
            </button>
          )}
          {isLoggedIn && !isRecruiter && (
            <Link
              to="/profile"
              className="navbar-item"
              onClick={() => setIsMenuOpen(false)}
            >
              Profile
            </Link>
          )}
          {!isLoggedIn ? (
            <button
              className="navbar-item login-btn"
              onClick={() => {
                setIsMenuOpen(false);
                navigate("/login");
              }}
            >
              Login
            </button>
          ) : (
            <button
              className="navbar-item logout-btn"
              onClick={() => {
                setIsMenuOpen(false);
                handleLogout();
              }}
            >
              Logout
            </button>
          )}
        </div>

        <div
          className={`navbar-toggle ${isMenuOpen ? "active" : ""}`}
          onClick={toggleMenu}
        >
          <span className="navbar-toggle-icon"></span>
        </div>
      </div>
      {showLogoutModal && (
        <div className="logout-modal-overlay">
          <div className="logout-modal">
            <h3 className="logout-modal-title">Confirm Logout</h3>
            <p className="logout-modal-message">
              Are you sure you want to logout?
            </p>
            <div className="logout-modal-actions">
              <button className="logout-btn" onClick={confirmLogout}>
                Logout
              </button>
              <button className="cancel-btn" onClick={cancelLogout}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
