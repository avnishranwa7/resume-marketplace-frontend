import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./ProfileView.module.css";
import Button from "@mui/material/Button";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import LockIcon from "@mui/icons-material/Lock";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import GoogleIcon from "@mui/icons-material/Google";
import axiosInstance from "../api/axiosInstance";
import ProfileCard from "../components/ProfileCard";
import {
  useGetAvailableContacts,
  useGetProfile,
  useHasAccess,
  useUnlockProfile,
} from "../queries/profile";
import Snackbar from "@mui/material/Snackbar";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { Alert, AlertColor, Box, Typography } from "@mui/material";

const ProfileView = () => {
  const role = localStorage.getItem("role");

  const { id } = useParams();
  const nav = useNavigate();

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
  }>({ open: false, message: "", severity: "info" });
  const [modal, setModal] = useState({
    open: false,
    message: "",
    type: "access" as "access" | "insufficient",
    unavailableData: [] as { type: string; label: string }[],
    availableData: [] as { type: string; label: string }[],
  });
  const unlockProfileMutation = useUnlockProfile();
  const [contactInfo, setContactInfo] = useState<{
    email?: string;
    phone?: string;
    driveLink?: string;
  } | null>(null);

  const { data: profile, isLoading, error } = useGetProfile(id ?? "", "id");
  const { data: availableContacts } = useGetAvailableContacts(role ?? "");
  const { data: accessData, refetch: refetchAccess } = useHasAccess(
    localStorage.getItem("userId") ?? "",
    profile?._id ?? ""
  );

  const fetchContactInfo = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId || !profile) return;
    try {
      const res = await axiosInstance.get(
        `/profile-contact?id=${userId}&profileId=${profile._id}`
      );
      setContactInfo(res.data.data);
    } catch (err) {
      setContactInfo(null);
    }
  };

  useEffect(() => {
    if (accessData?.access) {
      fetchContactInfo();
    } else {
      setContactInfo(null);
    }
    // eslint-disable-next-line
  }, [role, profile, accessData]);

  const handleBuyAccess = () => {
    if (!profile || !accessData) return;

    // Check available and unavailable data
    const unavailableData = [];
    const availableData = [];

    if (!accessData.contactData.email) {
      unavailableData.push({ type: "email", label: "Email" });
    } else {
      availableData.push({ type: "email", label: "Email" });
    }

    if (!accessData.contactData.phone) {
      unavailableData.push({ type: "phone", label: "Phone" });
    } else {
      availableData.push({ type: "phone", label: "Phone" });
    }

    if (!accessData.contactData.driveLink) {
      unavailableData.push({
        type: "drive",
        label: "Google Drive Link for Resume",
      });
    } else {
      availableData.push({
        type: "drive",
        label: "Google Drive Link for Resume",
      });
    }

    if (unavailableData.length > 0) {
      setModal({
        open: true,
        message: "",
        type: "access",
        unavailableData,
        availableData,
      });
      return;
    }

    // If all data is available, proceed directly with unlock
    const userId = localStorage.getItem("userId") || "";
    const profileId = profile._id;
    unlockProfileMutation.mutate(
      { userId, profileId },
      {
        onSuccess: (message) => {
          setSnackbar({ open: true, message, severity: "success" });
          refetchAccess();
        },
        onError: (error: any) => {
          let msg = "Something went wrong. Please try again.";
          if (
            error?.response?.data?.message === "Insufficient profile contacts"
          ) {
            msg =
              "You do not have enough contact unlocks. Would you like to buy more?";
            setModal({
              open: true,
              message: msg,
              type: "insufficient",
              unavailableData: [],
              availableData: [],
            });
            return;
          }
          setSnackbar({ open: true, message: msg, severity: "error" });
        },
      }
    );
  };

  const handleConfirmUnlock = () => {
    if (!profile) return;
    const userId = localStorage.getItem("userId") || "";
    const profileId = profile._id;
    unlockProfileMutation.mutate(
      { userId, profileId },
      {
        onSuccess: (message) => {
          setSnackbar({ open: true, message, severity: "success" });
          refetchAccess();
        },
        onError: (error: any) => {
          let msg = "Something went wrong. Please try again.";
          if (
            error?.response?.data?.message === "Insufficient profile contacts"
          ) {
            msg =
              "You do not have enough contact unlocks. Would you like to buy more?";
            setModal({
              open: true,
              message: msg,
              type: "insufficient",
              unavailableData: [],
              availableData: [],
            });
            return;
          }
          setSnackbar({ open: true, message: msg, severity: "error" });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className={styles.profileViewPage}>
        <div className={styles.loading}>Loading profile...</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className={styles.profileViewPage}>
        <div className={styles.error}>
          {error
            ? "Failed to fetch profile. Please try again later."
            : "Profile not found"}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.profileViewPage}>
      <div className={styles.profileCard}>
        <ProfileCard profile={profile} />
        {role !== "job_seeker" && (
          <div className={styles.contactSection}>
            <h2>Contact Information</h2>
            {accessData?.access ? (
              <div className={styles.contactInfo}>
                <div className={styles.contactItem}>
                  <EmailIcon
                    sx={{ color: "#4361EE", marginRight: 1, fontSize: 20 }}
                  />
                  <span className={styles.contactEmail}>
                    {contactInfo?.email}
                  </span>
                </div>
                {contactInfo?.phone && (
                  <div className={styles.contactItem}>
                    <PhoneIcon
                      sx={{ color: "#4361EE", marginRight: 1, fontSize: 20 }}
                    />
                    <span className={styles.contactEmail}>
                      {contactInfo.phone}
                    </span>
                  </div>
                )}
                {contactInfo?.driveLink && (
                  <div className={styles.contactItem}>
                    <GoogleIcon
                      sx={{ color: "#EA4335", marginRight: 1, fontSize: 20 }}
                    />
                    <a
                      href={contactInfo.driveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.contactEmail}
                      style={{ textDecoration: "underline", fontSize: 16 }}
                    >
                      View Resume (Google Drive)
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.lockedContact}>
                <div className={styles.accessBadge}>
                  <span className={styles.badgeIcon}>
                    <VpnKeyIcon sx={{ color: "#4361EE", fontSize: 22 }} />
                  </span>
                  <span className={styles.badgeText}>Contact Access Left:</span>
                  <span className={styles.badgeCount}>{availableContacts}</span>
                </div>
                <LockIcon
                  sx={{ fontSize: 48, color: "#e2e8f0", marginBottom: 1 }}
                />
                <p>Contact details are locked</p>
                <Button
                  variant="contained"
                  onClick={handleBuyAccess}
                  disabled={unlockProfileMutation.status === "pending"}
                  sx={{
                    backgroundColor: "#4361EE",
                    "&:hover": {
                      backgroundColor: "#3651d4",
                    },
                    marginTop: 2,
                  }}
                >
                  Buy Access for ₹49
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
      <Dialog
        open={modal.open}
        onClose={() =>
          setModal({
            open: false,
            message: "",
            type: "access",
            unavailableData: [],
            availableData: [],
          })
        }
        PaperProps={{
          sx: {
            borderRadius: "12px",
            padding: "1rem",
            maxWidth: "500px",
            width: "100%",
          },
        }}
      >
        <DialogTitle
          sx={{
            color: "#222b45",
            fontSize: "1.5rem",
            fontWeight: 600,
            padding: "0 1.5rem",
          }}
        >
          {modal.type === "access"
            ? "Profile Data Availability"
            : "Insufficient Contacts"}
        </DialogTitle>
        <DialogContent
          sx={{
            padding: "0 1.5rem 1rem",
            "&.MuiDialogContent-root": {
              paddingTop: "0.5rem",
            },
          }}
        >
          {modal.type === "access" ? (
            <>
              {modal.availableData && modal.availableData.length > 0 && (
                <>
                  <Typography
                    sx={{
                      color: "#4a5568",
                      fontSize: "1.1rem",
                      marginBottom: "0.3rem",
                    }}
                  >
                    The following data is available:
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.75rem",
                      marginBottom: "1.5rem",
                    }}
                  >
                    {modal.availableData.map((item, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                          color: "#4a5568",
                          fontSize: "1.1rem",
                        }}
                      >
                        {item.type === "email" && (
                          <EmailIcon sx={{ color: "#4361EE", fontSize: 20 }} />
                        )}
                        {item.type === "phone" && (
                          <PhoneIcon sx={{ color: "#4361EE", fontSize: 20 }} />
                        )}
                        {item.type === "drive" && (
                          <GoogleIcon sx={{ color: "#EA4335", fontSize: 20 }} />
                        )}
                        {item.label}
                      </Box>
                    ))}
                  </Box>
                </>
              )}
              <Typography
                sx={{
                  color: "#4a5568",
                  fontSize: "1.1rem",
                  marginBottom: "0.3rem",
                }}
              >
                The following data is not available:
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                {modal.unavailableData?.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      color: "#4a5568",
                      fontSize: "1.1rem",
                    }}
                  >
                    {item.type === "email" && (
                      <EmailIcon sx={{ color: "#4361EE", fontSize: 20 }} />
                    )}
                    {item.type === "phone" && (
                      <PhoneIcon sx={{ color: "#4361EE", fontSize: 20 }} />
                    )}
                    {item.type === "drive" && (
                      <GoogleIcon sx={{ color: "#EA4335", fontSize: 20 }} />
                    )}
                    {item.label}
                  </Box>
                ))}
              </Box>
              <Typography
                sx={{
                  color: "#4a5568",
                  fontSize: "1.1rem",
                  marginTop: "1.5rem",
                }}
              >
                Do you still want to unlock the profile?
              </Typography>
            </>
          ) : (
            <Typography sx={{ color: "#4a5568", fontSize: "1.1rem" }}>
              {modal.message}
            </Typography>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            padding: "0 0.5rem",
            gap: "0.75rem",
          }}
        >
          <Button
            onClick={() =>
              setModal({
                open: false,
                message: "",
                type: "access",
                unavailableData: [],
                availableData: [],
              })
            }
            variant="outlined"
            sx={{
              color: "#4361EE",
              borderColor: "#4361EE",
              "&:hover": {
                borderColor: "#3651d4",
                backgroundColor: "rgba(67, 97, 238, 0.04)",
              },
            }}
          >
            Cancel
          </Button>
          {modal.type === "access" ? (
            <Button
              onClick={() => {
                setModal({
                  open: false,
                  message: "",
                  type: "access",
                  unavailableData: [],
                  availableData: [],
                });
                handleConfirmUnlock();
              }}
              variant="contained"
              sx={{
                backgroundColor: "#4361EE",
                "&:hover": {
                  backgroundColor: "#3651d4",
                },
              }}
            >
              Unlock Profile
            </Button>
          ) : (
            <Button
              onClick={() => {
                setModal({
                  open: false,
                  message: "",
                  type: "access",
                  unavailableData: [],
                  availableData: [],
                });
                nav("/buy-contacts", { state: { id } });
              }}
              variant="contained"
              sx={{
                backgroundColor: "#4361EE",
                "&:hover": {
                  backgroundColor: "#3651d4",
                },
              }}
            >
              Buy More
            </Button>
          )}
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ProfileView;
