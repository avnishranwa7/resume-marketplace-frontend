import React, { useEffect, useState } from 'react';
import styles from '../pages/Profile.module.css';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CircularProgress from '@mui/material/CircularProgress';
import EditIcon from '@mui/icons-material/Edit';
import { ProfileData } from '../types';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import GoogleIcon from '@mui/icons-material/Google';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { useParseResume } from '../queries/profile';
import { Alert, AlertColor, Snackbar } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';

interface ProfileCardProps {
  profile: ProfileData;
  editMode?: boolean;
  editProfile?: ProfileData;
  onEdit?: () => void;
  onCancel?: () => void;
  onSave?: () => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSkillsChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onExperienceChange?: (idx: number, field: string, value: string | boolean) => void;
  onAddExperience?: () => void;
  onRemoveExperience?: (idx: number) => void;
  isUpdating?: boolean;
  experienceErrors?: { company?: string; role?: string; startDate?: string; endDate?: string }[];
  educationErrors?: { college?: string; degree?: string; startDate?: string; endDate?: string }[];
  onAutofill?: (parsed: any) => void;
  onEducationChange?: (idx: number, field: string, value: string | boolean) => void;
  onAddEducation?: () => void;
  onRemoveEducation?: (idx: number) => void;
}

function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ('00' + value.toString(16)).slice(-2);
  }
  return color;
}

function extractGoogleDriveFileId(url: string) {
  const regex = /\/d\/([^\/]+)|[?&]id=([^&]+)/;
  const match = url.match(regex);
  
  return match ? (match[1] || match[2]) : null;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  editMode = false,
  editProfile,
  onEdit,
  onCancel,
  onSave,
  onChange,
  onSkillsChange,
  onExperienceChange,
  onAddExperience,
  onRemoveExperience,
  isUpdating,
  experienceErrors,
  educationErrors,
  onAutofill,
  onEducationChange,
  onAddEducation,
  onRemoveEducation,
}) => {
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
  }>({ open: false, message: "", severity: "info" });

  const {mutate: parse, isPending: parsing} = useParseResume((data) => {
    if (data) {
      if (onAutofill) onAutofill(data);
      setSnackbar({open: true, message: "Resume parsed successfully", severity: "success"})
    }
  }, (err) => {
    setSnackbar({open: true, message: err, severity: "error"})
  });

  useEffect(() => {
    if (editMode) {
      const textareas = document.querySelectorAll<HTMLTextAreaElement>(`.${styles.editTextarea}`);
      textareas.forEach(textarea => {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
      });
    }
  }, [editMode]);

  // Dedicated handler for notice period select
  const handleNoticePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange({
        ...e,
        target: {
          ...e.target,
          name: "noticePeriod",
          value: e.target.value
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <div className={styles.profileCard}>
      <div className={styles.editProfileTopRight}>
        {!editMode && onEdit && (
          <IconButton 
            aria-label="edit profile" 
            className={styles.editBtn} 
            onClick={onEdit}
            sx={{
              backgroundColor: '#4361EE',
              color: '#fff',
              borderRadius: '50%',
              border: '2px solid #4361EE',
              boxShadow: '0 2px 8px 0 rgba(67, 97, 238, 0.12)',
              '&:hover': {
                backgroundColor: '#2336a7',
                borderColor: '#2336a7',
              },
              width: 44,
              height: 44,
              transition: 'background 0.2s, border 0.2s',
            }}
          >
            <EditIcon sx={{ color: '#fff' }} />
          </IconButton>
        )}
      </div>
      <div className={styles.avatarTop}>
        <Avatar sx={{ bgcolor: stringToColor(profile.name), width: 120, height: 120, fontSize: 64 }}>
          {profile.name[0]}
        </Avatar>
      </div>
      <div className={styles.profileInfo}>
        {editMode && editProfile && onChange ? (
          <>
            <input
              className={styles.editInput}
              name="name"
              value={editProfile.name}
              onChange={onChange}
              placeholder="Name"
            />
            <select
              className={styles.editInput}
              name="role"
              value={editProfile.role}
              onChange={e => onChange(e as unknown as React.ChangeEvent<HTMLInputElement>)}
              style={{ marginBottom: '0.5rem', maxWidth: 340, width: '100%', display: 'block' }}
            >
              <option value="">Select role</option>
              <option value="Frontend Developer">Frontend Developer</option>
              <option value="Backend Developer">Backend Developer</option>
              <option value="Full Stack Developer">Full Stack Developer</option>
              <option value="Data Scientist">Data Scientist</option>
              <option value="Product Manager">Product Manager</option>
              <option value="UI/UX Designer">UI/UX Designer</option>
              <option value="DevOps Engineer">DevOps Engineer</option>
              <option value="QA Engineer">QA Engineer</option>
              <option value="Mobile Developer">Mobile Developer</option>
              <option value="Project Manager">Project Manager</option>
              <option value="Business Analyst">Business Analyst</option>
              <option value="Software Developer">Software Developer</option>
            </select>
            {/* Notice Period Select */}
            <div className={styles.editRow}>
              <select
                id="noticePeriod"
                name="noticePeriod"
                value={editProfile.noticePeriod?.toString() || ""}
                onChange={handleNoticePeriodChange}
                className={styles.editInput + ' ' + styles.noticePeriodInput}
                style={{ maxWidth: 340, width: '100%' }}
              >
                <option value="">Select notice period</option>
                <option value="15">15 days</option>
                <option value="30">30 days</option>
                <option value="60">60 days</option>
                <option value="90">90 days</option>
              </select>
            </div>
            {/* Immediately Available Checkbox */}
            <div className={styles.editRow} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '0.5rem' }}>
              <label className={styles.editLabel} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <input
                  type="checkbox"
                  name="immediatelyAvailable"
                  checked={!!editProfile.immediatelyAvailable}
                  onChange={e => onChange({
                    ...e,
                    target: {
                      ...e.target,
                      name: "immediatelyAvailable",
                      value: (e.target as HTMLInputElement).checked ? "true" : ""
                    }
                  })}
                  style={{ marginRight: '0.5rem', height: '1rem', width: '1rem' }}
                />
                Immediately Available
              </label>
            </div>
          </>
        ) : (
          <h2>{profile.name}</h2>
        )}
        {!editMode && profile.email && <p className={styles.email}><EmailIcon sx={{ color: '#4361EE', fontSize: 18, verticalAlign: 'middle', marginRight: 0.5 }} />{profile.email}</p>}
        {!editMode && profile.role && <p className={styles.email}><BusinessCenterIcon sx={{ color: '#6c7a89', fontSize: 18, verticalAlign: 'middle', marginRight: 0.5 }} />{profile.role}</p>}
        {/* Resume Link Input - Improved UI */}
        {editMode && editProfile && onChange && (
          <div style={{ marginBottom: '2rem', marginTop: '2.5rem', maxWidth: 340, width: '100%', marginLeft: 'auto', marginRight: 'auto' }}>
            <label style={{ display: 'flex', alignItems: 'center', fontWeight: 500, color: '#4361EE', marginBottom: 2 }}>
              <InsertDriveFileIcon sx={{ color: '#4361EE', fontSize: 20, marginRight: 1 }} />
              Google Drive Resume Link
            </label>
            <div style={{ position: 'relative', marginBottom: 2 }}>
              <GoogleIcon sx={{ color: '#EA4335', fontSize: 22, position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', zIndex: 2 }} />
              <input
                className={styles.editInput}
                name="resumeLink"
                value={editProfile.resumeLink || ''}
                onChange={onChange}
                placeholder="Paste your Google Drive link"
                type="url"
                pattern="https://.*"
                style={{ width: '100%', paddingLeft: 40 }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={()=>parse(extractGoogleDriveFileId(editProfile.resumeLink ?? "") ?? "")}
                disabled={parsing || !editProfile.resumeLink || !/^https:\/\/.+/.test(editProfile.resumeLink)}
                style={{
                  background: '#4361EE',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '0.5rem 1rem',
                  fontWeight: 600,
                  cursor: parsing ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: '0.98rem',
                  minWidth: 120,
                  marginTop: 10
                }}
              >
                {parsing ? <CircularProgress size={18} color="inherit" /> : <AutoFixHighIcon sx={{ fontSize: 18, marginRight: 1 }} />}
                {parsing ? 'Parsing...' : 'Parse Resume'}
              </button>
            </div>
            <div style={{ fontSize: '0.92rem', color: '#6c7a89', marginTop: 2 }}>
              Make sure your Drive link is set to "Anyone with the link can view".
              <div style={{ color: '#d32f2f', fontWeight: 500, marginTop: 4 }}>Only PDF files are allowed.</div>
            </div>
          </div>
        )}
        {/* Resume Link Display - Improved UI */}
        {!editMode && profile.resumeLink && (
          <div style={{ margin: '0.5rem 0 0.5rem 0', textAlign: 'center' }}>
            <a href={profile.resumeLink} target="_blank" rel="noopener noreferrer" style={{ color: '#4361EE', textDecoration: 'underline', fontSize: '1.05rem', display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 500 }}>
              <InsertDriveFileIcon sx={{ color: '#4361EE', fontSize: 20, marginRight: 2 }} />
              <GoogleIcon sx={{ color: '#EA4335', fontSize: 20, marginRight: 6 }} />
              View Resume (Google Drive)
            </a>
          </div>
        )}
        {/* Show notice period and/or immediately available in non-editable mode */}
        {!editMode && (
          <>
            {!!profile.noticePeriod && (
              <p className={styles.noticePeriodText}><AccessTimeIcon sx={{ color: '#2563eb', fontSize: 18, verticalAlign: 'middle', marginRight: 0.5 }} />Notice Period: {profile.noticePeriod} days</p>
            )}
            {profile.immediatelyAvailable && (
              <p className={styles.immediatelyAvailableText}><CheckCircleIcon sx={{ color: '#059669', fontSize: 18, verticalAlign: 'middle', marginRight: 0.5 }} />Immediately Available</p>
            )}
          </>
        )}
      </div>
      <div className={styles.aboutSection}>
        <h3>About</h3>
        {editMode && editProfile && onChange ? (
          <textarea
            className={styles.editTextarea}
            name="about"
            value={editProfile.about}
            onChange={e => {
              onChange(e);
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }}
            ref={el => {
              if (el) {
                el.style.height = 'auto';
                el.style.height = el.scrollHeight + 'px';
              }
            }}
            placeholder="About"
            rows={1}
          />
        ) : (
          profile.about && profile.about.trim() !== '' ? (
            <p style={{ whiteSpace: 'pre-line' }}>{profile.about}</p>
          ) : (
            <p className={styles.placeholderText}>No about info yet.</p>
          )
        )}
      </div>
      <div className={styles.expSection}>
        <h3>Experience</h3>
        {editMode && editProfile && onExperienceChange && onAddExperience && onRemoveExperience ? (
          <>
            {editProfile.experience.map((exp, idx) => (
              <div key={idx} className={styles.expEditCard}>
                <div className={styles.expEditRow}>
                  <div className={styles.inputGroup}>
                    <input
                      className={styles.editInput + (experienceErrors && experienceErrors[idx]?.role ? ' ' + styles.inputError : '')}
                      placeholder="Role"
                      value={exp.role}
                      onChange={e => onExperienceChange(idx, 'role', e.target.value)}
                    />
                    {experienceErrors && experienceErrors[idx]?.role && (
                      <div className={styles.fieldError}>{experienceErrors[idx].role}</div>
                    )}
                  </div>
                  <div className={styles.inputGroup}>
                    <input
                      className={styles.editInput + (experienceErrors && experienceErrors[idx]?.company ? ' ' + styles.inputError : '')}
                      placeholder="Company"
                      value={exp.company}
                      onChange={e => onExperienceChange(idx, 'company', e.target.value)}
                    />
                    {experienceErrors && experienceErrors[idx]?.company && (
                      <div className={styles.fieldError}>{experienceErrors[idx].company}</div>
                    )}
                  </div>
                  <div className={styles.expDateGroup}>
                    <div className={styles.inputGroup + ' ' + styles.expDateRow}>
                      <label className={styles.expDateLabel}>Start Date</label>
                      <input
                        className={styles.editInput + (experienceErrors && experienceErrors[idx]?.startDate ? ' ' + styles.inputError : '')}
                        type="date"
                        value={exp.startDate}
                        onChange={e => onExperienceChange(idx, 'startDate', e.target.value)}
                      />
                      {experienceErrors && experienceErrors[idx]?.startDate && (
                        <div className={styles.fieldError}>{experienceErrors[idx].startDate}</div>
                      )}
                    </div>
                    <div className={styles.inputGroup + ' ' + styles.expDateRow}>
                      <label className={styles.expDateLabel}>End Date</label>
                      <input
                        className={styles.editInput + (experienceErrors && experienceErrors[idx]?.endDate ? ' ' + styles.inputError : '')}
                        type="date"
                        value={exp.endDate}
                        onChange={e => onExperienceChange(idx, 'endDate', e.target.value)}
                        disabled={exp.currentlyWorking}
                      />
                      {experienceErrors && experienceErrors[idx]?.endDate && (
                        <div className={styles.fieldError}>{experienceErrors[idx].endDate}</div>
                      )}
                    </div>
                  </div>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={exp.currentlyWorking}
                        onChange={e => onExperienceChange(idx, 'currentlyWorking', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Currently working here"
                    className={styles.expCheckboxLabel}
                  />
                </div>
                <textarea
                  className={styles.editTextarea}
                  placeholder="Description"
                  value={exp.description}
                  ref={el => {
                    if (el) {
                      el.style.height = 'auto';
                      el.style.height = el.scrollHeight + 'px';
                    }
                  }}
                  onChange={e => {
                    onExperienceChange(idx, 'description', e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = e.target.scrollHeight + 'px';
                  }}
                  rows={1}
                />
                <div className={styles.expRemoveBtnRow}>
                  <IconButton 
                    aria-label="remove experience"
                    onClick={() => onRemoveExperience(idx)}
                    className={styles.expRemoveBtn}
                    size="small"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </div>
              </div>
            ))}
            <Button 
              variant="outlined" 
              onClick={onAddExperience} 
              className={styles.addExpBtn}
              sx={{ marginTop: '0.5rem', color: '#4361EE', borderColor: '#4361EE', fontWeight: 600, width: '100%' }}
            >
              + Add Experience
            </Button>
          </>
        ) : (
          profile.experience && profile.experience.length > 0 ? (
            profile.experience.map((exp, idx) => (
              <div key={idx} className={styles.expViewCard}>
                <div className={styles.expViewHeader}>
                  <span className={styles.expViewRole}>{exp.role}</span>
                  <span className={styles.expViewCompany}><BusinessCenterIcon sx={{ fontSize: 18, verticalAlign: 'middle', color: '#6c7a89', marginRight: 4 }} />{exp.company}</span>
                </div>
                <div className={styles.expViewDates}><CalendarMonthIcon sx={{ fontSize: 18, verticalAlign: 'middle', color: '#4361EE', marginRight: 4 }} />
                  {exp.startDate ? new Date(exp.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : ''}
                  {exp.startDate && (exp.currentlyWorking || exp.endDate) ? ' - ' : ''}
                  {exp.currentlyWorking ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : ''}
                </div>
                <p className={styles.expViewDescription}>{exp.description}</p>
              </div>
            ))
          ) : (
            <p className={styles.placeholderText}>No experience added yet.</p>
          )
        )}
      </div>
      {/* Education Section */}
      <div className={styles.expSection}>
        <h3>Education</h3>
        {editMode && editProfile && onEducationChange && onAddEducation && onRemoveEducation ? (
          <>
            {editProfile.education.map((edu, idx) => (
              <div key={idx} className={styles.expEditCard}>
                <div className={styles.expEditRow}>
                  <div className={styles.inputGroup} style={{ maxWidth: '340px' }}>
                    <input
                      className={styles.editInput + (educationErrors && educationErrors[idx]?.college ? ' ' + styles.inputError : '')}
                      placeholder="College"
                      value={edu.college}
                      onChange={e => onEducationChange(idx, 'college', e.target.value)}
                    />
                    {educationErrors && educationErrors[idx]?.college && (
                      <div className={styles.fieldError}>{educationErrors[idx].college}</div>
                    )}
                  </div>
                  <div className={styles.inputGroup} style={{ maxWidth: '340px' }}>
                    <input
                      className={styles.editInput + (educationErrors && educationErrors[idx]?.degree ? ' ' + styles.inputError : '')}
                      placeholder="Degree"
                      value={edu.degree}
                      onChange={e => onEducationChange(idx, 'degree', e.target.value)}
                    />
                    {educationErrors && educationErrors[idx]?.degree && (
                      <div className={styles.fieldError}>{educationErrors[idx].degree}</div>
                    )}
                  </div>
                  <div className={styles.expDateGroup}>
                    <div className={styles.inputGroup + ' ' + styles.expDateRow}>
                      <label className={styles.expDateLabel}>Start Date</label>
                      <input
                        className={styles.editInput + (educationErrors && educationErrors[idx]?.startDate ? ' ' + styles.inputError : '')}
                        type="date"
                        value={edu.startDate}
                        onChange={e => onEducationChange(idx, 'startDate', e.target.value)}
                      />
                      {educationErrors && educationErrors[idx]?.startDate && (
                        <div className={styles.fieldError}>{educationErrors[idx].startDate}</div>
                      )}
                    </div>
                    <div className={styles.inputGroup + ' ' + styles.expDateRow}>
                      <label className={styles.expDateLabel}>End Date</label>
                      <input
                        className={styles.editInput + (educationErrors && educationErrors[idx]?.endDate ? ' ' + styles.inputError : '')}
                        type="date"
                        value={edu.endDate}
                        onChange={e => onEducationChange(idx, 'endDate', e.target.value)}
                        disabled={edu.ongoing || edu.currentlyStudying}
                      />
                      {(edu.ongoing || edu.currentlyStudying) && (
                        <div style={{ color: '#059669', fontWeight: 500, marginTop: 4 }}>Present</div>
                      )}
                      {educationErrors && educationErrors[idx]?.endDate && (
                        <div className={styles.fieldError}>{educationErrors[idx].endDate}</div>
                      )}
                    </div>
                  </div>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={!!(edu.ongoing || edu.currentlyStudying)}
                        onChange={e => onEducationChange(idx, 'ongoing', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Currently studying"
                    className={styles.expCheckboxLabel}
                  />
                </div>
                <div className={styles.expEditRow}>
                  <input
                    className={styles.editInput}
                    placeholder="Grade (e.g. 8.5 CGPA)"
                    value={edu.grade}
                    onChange={e => onEducationChange(idx, 'grade', e.target.value)}
                  />
                </div>
                <div className={styles.expRemoveBtnRow}>
                  <IconButton 
                    aria-label="remove education"
                    onClick={() => onRemoveEducation(idx)}
                    className={styles.expRemoveBtn}
                    size="small"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </div>
              </div>
            ))}
            <Button 
              variant="outlined" 
              onClick={onAddEducation} 
              className={styles.addExpBtn}
              sx={{ marginTop: '0.5rem', color: '#4361EE', borderColor: '#4361EE', fontWeight: 600, width: '100%' }}
            >
              + Add Education
            </Button>
          </>
        ) : (
          profile.education && profile.education.length > 0 ? (
            profile.education.map((edu, idx) => (
              <div key={idx} className={styles.expViewCard}>
                <div className={styles.expViewHeader}>
                  <span className={styles.expViewRole}>{edu.degree}</span>
                  <span className={styles.expViewCompany}><SchoolIcon sx={{ fontSize: 18, verticalAlign: 'middle', color: '#6c7a89', marginRight: 4 }} />{edu.college}</span>
                </div>
                <div className={styles.expViewDates}><CalendarMonthIcon sx={{ fontSize: 18, verticalAlign: 'middle', color: '#4361EE', marginRight: 4 }} />
                  {edu.startDate ? new Date(edu.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : ''}
                  {edu.startDate && (edu.currentlyStudying || edu.ongoing || edu.endDate) ? ' - ' : ''}
                  {edu.currentlyStudying || edu.ongoing ? 'Present' : edu.endDate ? new Date(edu.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : ''}
                </div>
                {edu.grade && <div className={styles.expViewDescription}>Grade: {edu.grade}</div>}
              </div>
            ))
          ) : (
            <p className={styles.placeholderText}>No education added yet.</p>
          )
        )}
      </div>
      <div className={styles.skillsSection}>
        <h3>Skills</h3>
        {editMode && editProfile && onSkillsChange ? (
          <input
            className={styles.editInput}
            name="skills"
            value={editProfile.skills.join(", ")}
            onChange={onSkillsChange}
            placeholder="Comma separated skills"
          />
        ) : (
          profile.skills && profile.skills.length > 0 ? (
            <div className={styles.skillsList}>
              {profile.skills.map((skill, idx) => (
                <Chip key={idx} label={skill} className={styles.skillChip} />
              ))}
            </div>
          ) : (
            <p className={styles.placeholderText}>No skills listed.</p>
          )
        )}
      </div>
      {editMode && onSave && onCancel && (
        <div className={styles.editActionsBottom}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={onSave} 
            className={styles.editBtn}
            sx={{ color: '#fff !important', backgroundColor: '#4361EE !important' }}
            disabled={isUpdating}
          >
            {isUpdating ? <CircularProgress size={22} color="inherit" /> : 'Save'}
          </Button>
          <Button 
            variant="outlined" 
            onClick={onCancel} 
            className={styles.editBtn}
            sx={{ color: '#4361EE !important', backgroundColor: '#fff !important', borderColor: '#4361EE !important' }}
            disabled={isUpdating}
          >
            Cancel
          </Button>
        </div>
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

export default ProfileCard; 