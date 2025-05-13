import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { logout } from "../store/slices/authSlice";
import {
  selectNotifications,
  selectUnreadCount,
  markAsRead,
  markAllAsRead,
} from "../store/slices/notificationsSlice";
import "../styles/Navbar.css";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Badge, Menu, MenuItem, Typography, Box, Divider } from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import EmailIcon from "@mui/icons-material/Email";
import WorkIcon from "@mui/icons-material/Work";
import PersonIcon from "@mui/icons-material/Person";
import InfoIcon from "@mui/icons-material/Info";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get state from Redux
  const { token, role } = useSelector((state: RootState) => state.auth);
  const notifications = useSelector(selectNotifications);
  const unreadCount = useSelector(selectUnreadCount);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [notificationAnchorEl, setNotificationAnchorEl] =
    useState<null | HTMLElement>(null);
  const notificationButtonRef = useRef<HTMLButtonElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    dispatch(logout());
    setShowLogoutModal(false);
    navigate("/");
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const isRecruiter = role === "recruiter";
  const isJobSeeker = role === "job_seeker";

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleNotificationItemClick = (id: string) => {
    dispatch(markAsRead(id));
    // Add navigation logic based on notification type
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  // Close notification menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationButtonRef.current &&
        !notificationButtonRef.current.contains(event.target as Node)
      ) {
        setNotificationAnchorEl(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img
            src="/favicon.svg"
            alt="Resume Marketplace Logo"
            className="navbar-logo-img"
          />
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
          {(isRecruiter || !token) && (
            <Link
              to="/pricing"
              className="navbar-item"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
          )}
          {!!token && isRecruiter && (
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
          {!!token && !isRecruiter && (
            <Link
              to="/profile"
              className="navbar-item"
              onClick={() => setIsMenuOpen(false)}
            >
              Profile
            </Link>
          )}
          {!!token && isJobSeeker && (
            <button
              ref={notificationButtonRef}
              className="navbar-item notification-btn"
              onClick={handleNotificationClick}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s ease",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
              }}
            >
              <Badge
                badgeContent={unreadCount}
                color="error"
                sx={{
                  "& .MuiBadge-badge": {
                    backgroundColor: "#4361ee",
                    color: "white",
                    fontSize: "0.65rem",
                    fontWeight: "bold",
                    minWidth: "16px",
                    height: "16px",
                    borderRadius: "8px",
                    padding: "0 4px",
                    right: 2,
                    top: 2,
                  },
                }}
              >
                <NotificationsIcon
                  sx={{
                    color: "#4361ee",
                    fontSize: "1.35rem",
                    transition: "transform 0.2s ease",
                    "&:hover": {
                      transform: "scale(1.1)",
                    },
                  }}
                />
              </Badge>
            </button>
          )}
          {!token ? (
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

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationAnchorEl}
        open={Boolean(notificationAnchorEl)}
        onClose={handleNotificationClose}
        PaperProps={{
          style: {
            maxHeight: 400,
            width: 360,
            marginTop: "0.5rem",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box
          sx={{
            p: 2,
            py: 1.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <Typography variant="h6" sx={{ fontSize: "1.1rem", fontWeight: 600 }}>
            Notifications
          </Typography>
          {unreadCount > 0 && (
            <Typography
              variant="body2"
              sx={{
                color: "#4361ee",
                cursor: "pointer",
                fontWeight: 500,
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
              onClick={handleMarkAllAsRead}
            >
              Mark all as read
            </Typography>
          )}
        </Box>
        <Divider />
        {notifications.length === 0 ? (
          <MenuItem
            disabled
            sx={{
              justifyContent: "center",
              py: 3,
              color: "#666",
            }}
          >
            <Typography variant="body1">No notifications</Typography>
          </MenuItem>
        ) : (
          notifications.map((notification) => {
            // Determine icon and color based on notification type
            let icon = <InfoIcon />;
            let iconColor = "#4361ee";

            if (notification.type === "message") {
              icon = <EmailIcon />;
              iconColor = "#2ecc71";
            } else if (notification.type === "contact_access") {
              icon = <WorkIcon />;
              iconColor = "#e74c3c";
            } else if (notification.type === "profile_view") {
              icon = <PersonIcon />;
              iconColor = "#9b59b6";
            }

            return (
              <MenuItem
                key={notification.id}
                onClick={() => handleNotificationItemClick(notification.id)}
                sx={{
                  backgroundColor: notification.read ? "inherit" : "#f8f9ff",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1,
                  whiteSpace: "normal",
                  py: 1.5,
                  px: 2,
                  borderBottom: "1px solid #f0f0f0",
                  "&:hover": {
                    backgroundColor: "#f0f4ff",
                  },
                  "&:last-child": {
                    borderBottom: "none",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    backgroundColor: `${iconColor}15`,
                    color: iconColor,
                    mt: 0.5,
                  }}
                >
                  {icon}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 0.5,
                      color: notification.read ? "#666" : "#333",
                      fontWeight: notification.read ? 400 : 500,
                    }}
                  >
                    {notification.message}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#999",
                      fontSize: "0.75rem",
                    }}
                  >
                    {formatDistanceToNow(new Date(notification.createdAt), {
                      addSuffix: true,
                    })}
                  </Typography>
                </Box>
                {!notification.read && (
                  <Box
                    sx={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: "#4361ee",
                      mt: 0.5,
                    }}
                  />
                )}
              </MenuItem>
            );
          })
        )}
      </Menu>

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
