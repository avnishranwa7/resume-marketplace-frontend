import { useState, ChangeEvent, useEffect } from "react";
import styles from "./Profile.module.css";
import ProfileCard from "../components/ProfileCard";
import { useGetProfile, useUpdateProfile } from "../queries/profile";
import { ProfileData } from "../types";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const userId = localStorage.getItem('userId') ?? '';
    const navigate = useNavigate();
    useEffect(() => {
      if (localStorage.getItem('role') === 'recruiter') {
        navigate('/explore', { replace: true });
      }
    }, [navigate]);

    const queryClient = useQueryClient();

  const [editMode, setEditMode] = useState(false);
  const [editProfile, setEditProfile] = useState<ProfileData | undefined>();
  const [experienceErrors, setExperienceErrors] = useState<{ company?: string; role?: string; startDate?: string; endDate?: string }[]>([]);

  const { data: profile, isLoading, error } = useGetProfile(userId, "userId");
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile(() => {
    queryClient.invalidateQueries({ queryKey: ["profile", userId] });
    setEditMode(false);
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditProfile(prev => prev ? { ...prev, [name]: value } : prev);
  };

  const handleSkillsChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditProfile(prev => prev ? { ...prev, skills: e.target.value.split(",").map(s => s.trim()) } : prev);
  };

  const handleExperienceChange = (idx: number, field: string, value: string | boolean) => {
    setEditProfile(prev => prev ? {
      ...prev,
      experience: prev.experience.map((exp, i) =>
        i === idx ? { ...exp, [field]: value } : exp
      )
    } : prev);
  };

  const handleAddExperience = () => {
    setEditProfile(prev => prev ? {
      ...prev,
      experience: [
        ...prev.experience,
        { role: '', company: '', startDate: '', endDate: '', currentlyWorking: false, description: '' }
      ]
    } : prev);
  };

  const handleRemoveExperience = (idx: number) => {
    setEditProfile(prev => prev ? {
      ...prev,
      experience: prev.experience.filter((_, i) => i !== idx)
    } : prev);
  };

  const handleEdit = () => {
    setEditProfile(profile);
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditProfile(profile);
    setEditMode(false);
  };

  const handleSave = () => {
    if (!editProfile) return;
    // Local validation for required fields
    const errors = editProfile.experience.map(exp => {
      const err: { company?: string; role?: string; startDate?: string; endDate?: string } = {};
      if (!exp.company || !exp.company.trim()) err.company = 'Company name is required';
      if (!exp.role || !exp.role.trim()) err.role = 'Role is required';
      if (!exp.startDate || !exp.startDate.trim()) err.startDate = 'Start date is required';
      if (!exp.currentlyWorking && (!exp.endDate || !exp.endDate.trim())) err.endDate = 'End date is required unless currently working';
      return err;
    });
    const hasErrors = errors.some(e => e.company || e.role || e.startDate || e.endDate);
    setExperienceErrors(errors);
    if (hasErrors) return;
    updateProfile({ ...editProfile, id: userId });
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
        />
      )}
    </div>
  );
};

export default Profile; 