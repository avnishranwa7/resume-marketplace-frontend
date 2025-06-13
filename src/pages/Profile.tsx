import React from "react";
import { useState, ChangeEvent, useEffect } from "react";
import styles from "./Profile.module.css";
import ProfileCard from "../components/ProfileCard";
import { useGetProfile, useUpdateProfile } from "../queries/profile";
import { ProfileData } from "../types";
import { useNavigate } from "react-router-dom";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { ParsedResume } from "../types/responses";
import { Alert, AlertColor, Snackbar } from "@mui/material";
import useAppSelector from "../hooks/useAppSelector";

const Profile: React.FC = () => {
  useDocumentTitle("My Profile");
  const auth = useAppSelector((state) => state.auth);

  const userId = auth.userId ?? "";
  const navigate = useNavigate();
  useEffect(() => {
    if (auth.role === "recruiter") {
      navigate("/explore", { replace: true });
    }
  }, [navigate]);

  const [editMode, setEditMode] = useState(false);
  const [editProfile, setEditProfile] = useState<ProfileData | undefined>();
  const [skillsInput, setSkillsInput] = useState("");
  const [experienceErrors, setExperienceErrors] = useState<
    { company?: string; role?: string; startDate?: string; endDate?: string }[]
  >([]);
  const [educationErrors, setEducationErrors] = useState<
    {
      college?: string;
      degree?: string;
      startDate?: string;
      endDate?: string;
    }[]
  >([]);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
  }>({ open: false, message: "", severity: "info" });

  const {
    data: profile,
    isLoading,
    error,
    refetch: refetchProfile,
  } = useGetProfile(userId, "userId");
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile(
    () => {
      refetchProfile();
      setEditMode(false);
      setSnackbar({
        open: true,
        message: "Profile updated successfully.",
        severity: "success",
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  );

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setEditProfile((prev) =>
      prev
        ? {
            ...prev,
            [name]:
              type === "checkbox"
                ? (e.target as HTMLInputElement).checked
                : name === "immediatelyAvailable"
                ? value === "true"
                  ? true
                  : false
                : value,
          }
        : prev
    );
  };

  const handleSkillsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSkillsInput(value);
    
    setEditProfile((prev) =>
      prev
        ? {
            ...prev,
            skills: value
              .split(",")
              .map((s) => s.trim())
              .filter((s) => s !== ""),
          }
        : prev
    );
  };

  const handleExperienceChange = (
    idx: number,
    field: string,
    value: string | boolean
  ) => {
    setEditProfile((prev) =>
      prev
        ? {
            ...prev,
            experience: prev.experience.map((exp, i) => {
              if (i !== idx) return exp;
              if (field === "startDate" || field === "endDate") {
                // Convert MM/YYYY to YYYY-MM-DD for storage
                const [month, year] = value.toString().split("/");
                if (month && year) {
                  const date = new Date(parseInt(year), parseInt(month) - 1);
                  return { ...exp, [field]: date.toISOString().slice(0, 10) };
                }
              }
              return { ...exp, [field]: value };
            }),
          }
        : prev
    );
  };

  const handleAddExperience = () => {
    setEditProfile((prev) =>
      prev
        ? {
            ...prev,
            experience: [
              ...prev.experience,
              {
                role: "",
                company: "",
                startDate: "",
                endDate: "",
                currentlyWorking: false,
                description: "",
              },
            ],
          }
        : prev
    );
  };

  const handleRemoveExperience = (idx: number) => {
    setEditProfile((prev) =>
      prev
        ? {
            ...prev,
            experience: prev.experience.filter((_, i) => i !== idx),
          }
        : prev
    );
  };

  const handleEducationChange = (
    idx: number,
    field: string,
    value: string | boolean
  ) => {
    setEditProfile((prev) =>
      prev
        ? {
            ...prev,
            education: prev.education.map((edu, i) => {
              if (i !== idx) return edu;
              if (field === "startDate" || field === "endDate") {
                // Convert MM/YYYY to YYYY-MM-DD for storage
                const [month, year] = value.toString().split("/");
                if (month && year) {
                  const date = new Date(parseInt(year), parseInt(month) - 1);
                  return { ...edu, [field]: date.toISOString().slice(0, 10) };
                }
              }
              if (field === "ongoing" && value === true) {
                return { ...edu, ongoing: true, endDate: "" };
              }
              if (field === "ongoing" && value === false) {
                return { ...edu, ongoing: false };
              }
              return { ...edu, [field]: value };
            }),
          }
        : prev
    );
  };

  const handleAddEducation = () => {
    setEditProfile((prev) =>
      prev
        ? {
            ...prev,
            education: [
              ...prev.education,
              {
                college: "",
                degree: "",
                startDate: "",
                endDate: "",
                ongoing: false,
                grade: "",
              },
            ],
          }
        : prev
    );
  };

  const handleRemoveEducation = (idx: number) => {
    setEditProfile((prev) =>
      prev
        ? {
            ...prev,
            education: prev.education.filter((_, i) => i !== idx),
          }
        : prev
    );
  };

  const handleEdit = () => {
    if (!profile) return;
    setEditProfile({
      ...profile,
      education: profile.education || [],
    });
    setSkillsInput(profile.skills.join(", "));
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditProfile(profile);
    setSkillsInput("");
    setEditMode(false);
  };

  const handleSave = () => {
    if (!editProfile) return;

    // Name validation
    if (!editProfile.name || !editProfile.name.trim()) {
      setSnackbar({
        open: true,
        message: "Name is required",
        severity: "error",
      });
      return;
    }

    // Role validation
    if (!editProfile.role || !editProfile.role.trim()) {
      setSnackbar({
        open: true,
        message: "Please select a role",
        severity: "error",
      });
      return;
    }

    // Phone number validation
    if (!editProfile.phone || !editProfile.phone.toString().trim()) {
      setSnackbar({
        open: true,
        message: "Phone number is required",
        severity: "error",
      });
      return;
    }

    // Validate phone number format
    if (!/^[0-9]{10}$/.test(editProfile.phone.toString())) {
      setSnackbar({
        open: true,
        message: "Please enter a valid 10-digit phone number",
        severity: "error",
      });
      return;
    }

    // Local validation for required fields
    const errors = editProfile.experience.map((exp) => {
      const err: {
        company?: string;
        role?: string;
        startDate?: string;
        endDate?: string;
      } = {};
      if (!exp.company || !exp.company.trim())
        err.company = "Company name is required";
      if (!exp.role || !exp.role.trim()) err.role = "Role is required";
      if (!exp.startDate || !exp.startDate.trim())
        err.startDate = "Start date is required";
      if (!exp.currentlyWorking && (!exp.endDate || !exp.endDate.trim()))
        err.endDate = "End date is required unless currently working";
      return err;
    });
    const hasErrors = errors.some(
      (e) => e.company || e.role || e.startDate || e.endDate
    );
    setExperienceErrors(errors);

    // Education validation
    const educationErrors = editProfile.education.map((edu) => {
      const err: {
        college?: string;
        degree?: string;
        startDate?: string;
        endDate?: string;
      } = {};
      if (!edu.college || !edu.college.trim())
        err.college = "College name is required";
      if (!edu.degree || !edu.degree.trim()) err.degree = "Degree is required";
      if (!edu.startDate || !edu.startDate.trim())
        err.startDate = "Start date is required";
      if (!edu.ongoing && (!edu.endDate || !edu.endDate.trim()))
        err.endDate = "End date is required unless currently studying";
      return err;
    });
    const hasEducationErrors = educationErrors.some(
      (e) => e.college || e.degree || e.startDate || e.endDate
    );
    setEducationErrors(educationErrors);

    if (hasErrors || hasEducationErrors) return;
    // Map ongoing to currentlyStudying in the payload
    const educationWithCurrentlyStudying = editProfile.education.map(
      ({ ongoing, ...rest }) => ({
        ...rest,
        ...(ongoing !== undefined ? { currentlyStudying: ongoing } : {}),
      })
    );
    updateProfile({
      id: userId,
      name: editProfile.name,
      role: editProfile.role,
      email: editProfile.email,
      about: editProfile.about,
      experience: editProfile.experience,
      skills: editProfile.skills,
      education: educationWithCurrentlyStudying,
      projects: editProfile.projects,
      driveLink: editProfile.driveLink,
      phone: editProfile.phone?.toString(),
      immediatelyAvailable: editProfile.immediatelyAvailable,
      noticePeriod: editProfile.noticePeriod,
    });
  };

  const handleAutofill = (parsed: ParsedResume) => {
    setEditProfile((prev) => {
      if (!prev) return prev;
      // Helper to parse duration like 'MM/YYYY - MM/YYYY' or 'MM/YYYY - Present'
      function parseDuration(duration: string) {
        const match = duration.match(
          /(\d{2}\/\d{4})\s*[–-]\s*(\d{2}\/\d{4}|Present)/
        );
        if (!match)
          return { startDate: "", endDate: "", currentlyStudying: false };
        const [_, start, end] = match;
        const [startMonth, startYear] = start.split("/");
        const startDate = new Date(
          parseInt(startYear),
          parseInt(startMonth) - 1
        )
          .toISOString()
          .slice(0, 10);
        let endDate = "";
        let currentlyStudying = false;
        if (end === "Present") {
          currentlyStudying = true;
        } else {
          const [endMonth, endYear] = end.split("/");
          endDate = new Date(parseInt(endYear), parseInt(endMonth) - 1)
            .toISOString()
            .slice(0, 10);
        }
        return { startDate, endDate, currentlyStudying };
      }
      const education = (parsed.education || []).map((edu) => {
        const { startDate, endDate, currentlyStudying } = parseDuration(
          edu.duration || ""
        );
        return {
          college: edu.university || "",
          degree: edu.degree || "",
          startDate,
          endDate,
          currentlyStudying,
          ongoing: currentlyStudying,
          grade: edu.grade || "",
        };
      });
      const experience = (parsed.experience || []).map((exp) => {
        const { startDate, endDate, currentlyStudying } = parseDuration(
          exp.duration || ""
        );
        return {
          company: exp.company || "",
          role: exp.title || "",
          startDate,
          endDate,
          currentlyWorking: currentlyStudying,
          description: exp.details.join("\n") || "",
        };
      });

      const projects = (parsed.projects || []).map((project) => ({
        name: project.title || "",
        description: project.details.join("\n") || "",
      }));

      return {
        ...prev,
        about: parsed.about.join("\n") || prev.about,
        skills: parsed.skills ?? prev.skills,
        experience: experience ?? prev.experience,
        education: education ?? prev.education,
        name: parsed.name ?? prev.name,
        keywords: parsed.keywords ?? [],
        projects: projects ?? prev.projects,
      };
    });
  };

  if (isLoading) {
    return (
      <div className={styles.profilePage}>
        <div className={styles.loading}>Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.profilePage}>
        <div className={styles.error}>{error.message}</div>
      </div>
    );
  }

  return (
    <div className={styles.profilePage}>
      {profile && (
        <ProfileCard
          profile={profile}
          isUpdating={isUpdating}
          editMode={editMode}
          editProfile={editProfile}
          onEdit={handleEdit}
          onCancel={handleCancel}
          onSave={handleSave}
          onChange={handleChange}
          onSkillsChange={handleSkillsChange}
          skillsInput={skillsInput}
          onExperienceChange={handleExperienceChange}
          onAddExperience={handleAddExperience}
          onRemoveExperience={handleRemoveExperience}
          experienceErrors={experienceErrors}
          educationErrors={educationErrors}
          onAutofill={handleAutofill}
          onEducationChange={handleEducationChange}
          onAddEducation={handleAddEducation}
          onRemoveEducation={handleRemoveEducation}
        />
      )}
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

export default Profile;
