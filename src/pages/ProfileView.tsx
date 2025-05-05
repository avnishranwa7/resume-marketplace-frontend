import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./ProfileView.module.css";
import Button from "@mui/material/Button";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import LockIcon from "@mui/icons-material/Lock";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import axiosInstance from "../api/axiosInstance";
import ProfileCard from "../components/ProfileCard";
import {
  useGetAvailableContacts,
  useGetProfile,
  useUnlockProfile,
} from "../queries/profile";
import Snackbar from "@mui/material/Snackbar";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

const ProfileView = () => {
  const role = localStorage.getItem("role");

  const { id } = useParams();
  const nav = useNavigate();

  const [hasAccess, setHasAccess] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [modal, setModal] = useState({ open: false, message: "" });
  const unlockProfileMutation = useUnlockProfile();
  const [contactInfo, setContactInfo] = useState<{
    email?: string;
    phone?: string;
  } | null>(null);

  const { data: profile, isLoading, error } = useGetProfile(id ?? "", "id");
  const { data: availableContacts } = useGetAvailableContacts(role ?? "");

  const fetchProfileAccess = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId || !profile) return;
    try {
      const res = await axiosInstance.get(
        `/profile-access?id=${userId}&profileId=${profile._id}`
      );
      setHasAccess(res.data.data ?? false);
    } catch (err) {
      setHasAccess(false);
    }
  };

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
    if (role && role !== "job_seeker" && profile) {
      fetchProfileAccess();
    }
    if (hasAccess) {
      fetchContactInfo();
    } else {
      setContactInfo(null);
    }
    // eslint-disable-next-line
  }, [role, profile, hasAccess]);

  const handleBuyAccess = () => {
    if (!profile) return;
    const userId = localStorage.getItem("userId") || "";
    const profileId = profile._id;
    unlockProfileMutation.mutate(
      { userId, profileId },
      {
        onSuccess: (message) => {
          setSnackbar({ open: true, message });
          fetchProfileAccess();
        },
        onError: (error: any) => {
          let msg = "Something went wrong. Please try again.";
          if (
            error?.response?.data?.message === "Insufficient profile contacts"
          ) {
            msg =
              "You do not have enough contact unlocks. Would you like to buy more?";
            setModal({ open: true, message: msg });
            return;
          }
          setSnackbar({ open: true, message: msg });
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
            {hasAccess ? (
              <div className={styles.contactInfo}>
                <div className={styles.contactItem}>
                  <EmailIcon
                    sx={{ color: "#4361EE", marginRight: 1, fontSize: 18 }}
                  />
                  <span className={styles.contactEmail}>
                    {contactInfo?.email}
                  </span>
                </div>
                {contactInfo?.phone && (
                  <div className={styles.contactItem}>
                    <PhoneIcon sx={{ color: "#4361EE", marginRight: 1 }} />
                    <span>{contactInfo.phone}</span>
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
        onClose={() => setModal({ open: false, message: "" })}
      >
        <DialogTitle>Insufficient Contacts</DialogTitle>
        <DialogContent sx={{ marginTop: "-16px" }}>
          <p>{modal.message}</p>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setModal({ open: false, message: "" })}
            color="primary"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setModal({ open: false, message: "" });
              nav("/buy-contacts", { state: { id } });
            }}
            color="primary"
            variant="contained"
          >
            Buy More
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </div>
  );
};

export default ProfileView;
