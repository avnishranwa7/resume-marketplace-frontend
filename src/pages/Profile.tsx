import React from 'react';
import { useState, ChangeEvent, useEffect } from "react";
import styles from "./Profile.module.css";
import ProfileCard from "../components/ProfileCard";
import { useGetProfile, useUpdateProfile } from "../queries/profile";
import { ProfileData } from "../types";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import useDocumentTitle from '../hooks/useDocumentTitle';
import { ParsedResume } from '../types/responses';

const Profile: React.FC = () => {
  useDocumentTitle('My Profile');

  const userId = localStorage.getItem("userId") ?? "";
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("role") === "recruiter") {
      navigate("/explore", { replace: true });
    }
  }, [navigate]);

  const queryClient = useQueryClient();

  const [editMode, setEditMode] = useState(false);
  const [editProfile, setEditProfile] = useState<ProfileData | undefined>();
  const [experienceErrors, setExperienceErrors] = useState<
    { company?: string; role?: string; startDate?: string; endDate?: string }[]
  >([]);
  const [educationErrors, setEducationErrors] = useState<
    { college?: string; degree?: string; startDate?: string; endDate?: string }[]
  >([]);

  const { data: profile, isLoading, error } = useGetProfile(userId, "userId");
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile(
    () => {
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
      setEditMode(false);
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
    setEditProfile((prev) =>
      prev
        ? { ...prev, skills: e.target.value.split(",").map((s) => s.trim()) }
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
            experience: prev.experience.map((exp, i) =>
              i === idx ? { ...exp, [field]: value } : exp
            ),
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
      education: profile.education || []
    });
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditProfile(profile);
    setEditMode(false);
  };

  const handleSave = () => {
    if (!editProfile) return;
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
      if (!edu.degree || !edu.degree.trim())
        err.degree = "Degree is required";
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
    const educationWithCurrentlyStudying = editProfile.education.map(({ ongoing, ...rest }) => ({
      ...rest,
      ...(ongoing !== undefined ? { currentlyStudying: ongoing } : {}),
    }));
    updateProfile({ ...editProfile, id: userId, education: educationWithCurrentlyStudying });
  };

  const handleAutofill = (parsed: ParsedResume) => {
    setEditProfile((prev) => {
      if (!prev) return prev;
      // Helper to parse duration like 'Aug 2019 – May 2023' or 'Aug 2019 – Present'
      function parseDuration(duration: string) {
        const match = duration.match(/([A-Za-z]{3,9} \d{4})\s*[–-]\s*([A-Za-z]{3,9} \d{4}|Present)/);
        if (!match) return { startDate: '', endDate: '', currentlyStudying: false };
        const [_, start, end] = match;
        const startDate = start ? new Date(start).toISOString().slice(0, 10) : '';
        let endDate = '';
        let currentlyStudying = false;
        if (end === 'Present') {
          currentlyStudying = true;
        } else if (end) {
          endDate = new Date(end).toISOString().slice(0, 10);
        }
        return { startDate, endDate, currentlyStudying };
      }
      const education = (parsed.education || []).map(edu => {
        const { startDate, endDate, currentlyStudying } = parseDuration(edu.duration || '');
        return {
          college: edu.institute || '',
          degree: edu.degree || '',
          startDate,
          endDate,
          currentlyStudying,
          ongoing: currentlyStudying,
          grade: edu.grade || '',
        };
      });
      return {
        ...prev,
        // name: parsed.name || prev.name,
        // email: parsed.email || prev.email,
        // role: parsed.role || prev.role,
        // about: parsed.about || prev.about,
        skills: parsed.skills ? [...parsed.skills.languages, ...parsed.skills.technologies] : prev.skills,
        experience: parsed.experience.map(exp => ({...exp, role: exp.title, startDate: ""})) || prev.experience,
        education: education ?? prev.education,
        name: parsed.name ?? prev.name,
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
    </div>
  );
};

export default Profile;
