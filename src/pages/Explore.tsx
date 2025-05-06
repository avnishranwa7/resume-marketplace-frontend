import React, { useState, useEffect, useCallback } from "react";
import styles from "./Explore.module.css";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useGetProfiles } from "../queries/profile";
import { Experience } from "../types";
import {
  Select,
  MenuItem,
  Divider,
  Checkbox,
  ListItemText,
  Radio,
} from "@mui/material";
import useDocumentTitle from '../hooks/useDocumentTitle';

const mockProfiles = [
  {
    id: 1,
    name: "Emily Carter",
    avatarColor: "#4361EE",
    role: "Full Stack Developer",
    location: "New York, NY",
    yoe: 5,
    skills: ["React", "Node.js", "TypeScript"],
    tags: ["Frontend", "Backend"],
    type: "job_seeker",
    country: "USA",
    state: "NY",
  },
  {
    id: 2,
    name: "Michael Smith",
    avatarColor: "#10B981",
    role: "Data Scientist",
    location: "San Francisco, CA",
    yoe: 3,
    skills: ["Python", "TensorFlow", "SQL"],
    tags: ["ML", "AI"],
    type: "job_seeker",
    country: "USA",
    state: "CA",
  },
  {
    id: 3,
    name: "Sarah Williams",
    avatarColor: "#F472B6",
    role: "Product Manager",
    location: "Austin, TX",
    yoe: 7,
    skills: ["Product", "Agile", "UI/UX"],
    tags: ["Management"],
    type: "recruiter",
    country: "USA",
    state: "TX",
  },
  {
    id: 4,
    name: "Sarah Williams",
    avatarColor: "#F472B6",
    role: "Product Manager",
    location: "Austin, TX",
    yoe: 7,
    skills: ["Product", "Agile", "UI/UX"],
    tags: ["Management"],
    type: "recruiter",
    country: "USA",
    state: "TX",
  },
  {
    id: 5,
    name: "Sarah Williams",
    avatarColor: "#F472B6",
    role: "Product Manager",
    location: "Austin, TX",
    yoe: 7,
    skills: ["Product", "Agile", "UI/UX"],
    tags: ["Management"],
    type: "recruiter",
    country: "USA",
    state: "TX",
  },
  {
    id: 6,
    name: "Sarah Williams",
    avatarColor: "#F472B6",
    role: "Product Manager",
    location: "Austin, TX",
    yoe: 7,
    skills: ["Product", "Agile", "UI/UX"],
    tags: ["Management"],
    type: "recruiter",
    country: "USA",
    state: "TX",
  },
  // ...add more mock profiles as needed
];

const extraRoles = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Scientist",
  "Product Manager",
  "UI/UX Designer",
  "DevOps Engineer",
  "QA Engineer",
  "Mobile Developer",
  "Project Manager",
  "Business Analyst",
  "Software Developer",
];
const allRoles = Array.from(
  new Set([...mockProfiles.map((profile) => profile.role), ...extraRoles])
);

const PAGE_SIZE = 6;

const calculateYearsOfExperience = (
  experience: Experience[]
): { years: number; months: number } => {
  if (!experience || experience.length === 0) return { years: 0, months: 0 };

  const now = new Date();
  const totalMonths = experience.reduce((total, exp) => {
    const startDate = new Date(exp.startDate);
    const endDate = exp.currentlyWorking ? now : new Date(exp.endDate || now);

    const months =
      (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth());

    return total + months;
  }, 0);

  return {
    years: Math.floor(totalMonths / 12),
    months: totalMonths % 12,
  };
};

const formatExperience = (years: number, months: number): string => {
  if (years === 0 && months === 0) return "No experience";
  if (years === 0) return `${months} month${months === 1 ? "" : "s"}`;
  if (months === 0) return `${years} year${years === 1 ? "" : "s"}`;
  return `${years} year${years === 1 ? "" : "s"} ${months} month${
    months === 1 ? "" : "s"
  }`;
};

const Explore = () => {
  useDocumentTitle('Explore Profiles');

  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    keyword: "",
    yoe: "",
    role: "",
    noticePeriod: "",
    immediatelyAvailable: false,
  });
  const [appliedFilters, setAppliedFilters] = useState({
    keyword: "",
    yoe: "",
    role: "",
    noticePeriod: "",
    immediatelyAvailable: false,
  });
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const { data } = useGetProfiles(
    appliedFilters.role,
    Number(appliedFilters.yoe),
    appliedFilters.immediatelyAvailable,
    appliedFilters.noticePeriod
  );
  const profiles = !appliedFilters.role ? [] : data ?? [];

  // On mount, read filters from URL
  useEffect(() => {
    const urlFilters = {
      keyword: searchParams.get("keyword") || "",
      yoe: searchParams.get("yoe") || "",
      role: searchParams.get("role") || "",
      noticePeriod: searchParams.get("noticePeriod") || "",
      immediatelyAvailable: searchParams.get("immediatelyAvailable") === "true",
    };
    setFilters(urlFilters);
    setAppliedFilters(urlFilters);
    setPage(1);
  }, [searchParams]);

  // Pagination logic
  const totalPages = Math.ceil(profiles.length / PAGE_SIZE);
  const paginatedProfiles = profiles.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = useCallback(() => {
    setAppliedFilters(filters);
    setPage(1);
    // Update URL
    const params: Record<string, string> = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (key === "immediatelyAvailable") {
        if (value) params[key] = "true";
      } else if (value) {
        params[key] = value as string;
      }
    });
    setSearchParams(params);
  }, [filters, setSearchParams]);

  const handleResetFilters = () => {
    setFilters({
      keyword: "",
      yoe: "",
      role: "",
      noticePeriod: "",
      immediatelyAvailable: false,
    });
    setAppliedFilters({
      keyword: "",
      yoe: "",
      role: "",
      noticePeriod: "",
      immediatelyAvailable: false,
    });
    setPage(1);
    setSearchParams({});
  };

  // Handler for the custom dropdown
  const handleNoticePeriodDropdownChange = (event: any) => {
    const value = event.target.value;
    // If user clicks a notice period, always set that as the only notice period
    // If user toggles 'immediate', keep noticePeriod as is
    const noticePeriodOptions = ["", "15", "30", "60", "90"];
    if (Array.isArray(value)) {
      const hasImmediate = value.includes("immediate");
      // Find the last selected notice period (the one just clicked)
      const lastSelected = value[value.length - 1];
      if (noticePeriodOptions.includes(lastSelected)) {
        setFilters((prev) => ({
          ...prev,
          immediatelyAvailable: hasImmediate,
          noticePeriod: lastSelected,
        }));
      } else {
        // Only toggling 'immediate'
        setFilters((prev) => ({
          ...prev,
          immediatelyAvailable: hasImmediate,
        }));
      }
    } else {
      setFilters((prev) => ({ ...prev, noticePeriod: value }));
    }
  };

  // Compose the value for the Select component
  const noticePeriodSelectValue: string[] = [];
  if (filters.immediatelyAvailable) {
    noticePeriodSelectValue.push("immediate");
  }
  if (
    typeof filters.noticePeriod === "string" &&
    filters.noticePeriod !== "" &&
    filters.noticePeriod !== "immediate"
  ) {
    noticePeriodSelectValue.push(filters.noticePeriod);
  }

  return (
    <div className={styles.explorePage}>
      <div className={styles.filterBar}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel} htmlFor="role">
            Role <span className={styles.requiredAsterisk}>*</span>
          </label>
          <select
            id="role"
            name="role"
            value={filters.role}
            onChange={handleFilterChange}
            className={styles.filterSelect}
            required
          >
            <option value="" disabled>
              Select a role
            </option>
            {allRoles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel} htmlFor="keyword">
            Keywords
          </label>
          <input
            id="keyword"
            className={styles.filterInput}
            type="text"
            name="keyword"
            placeholder="Enter keywords"
            value={filters.keyword}
            onChange={handleFilterChange}
          />
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel} htmlFor="yoe">
            YOE
          </label>
          <select
            name="yoe"
            id="yoe"
            value={filters.yoe}
            onChange={handleFilterChange}
            className={styles.filterSelect}
          >
            <option value="">YOE</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((y) => (
              <option key={y} value={y}>
                {y} Years
              </option>
            ))}
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel} htmlFor="noticePeriod">
            Notice Period
          </label>
          <Select
            id="noticePeriod"
            name="noticePeriod"
            multiple
            value={noticePeriodSelectValue}
            onChange={handleNoticePeriodDropdownChange}
            className={styles.filterSelect}
            renderValue={(selected) => {
              if (!selected.length) return "Select notice period";
              const labels = [];
              if (selected.includes("immediate"))
                labels.push("Immediately Available");
              const period = selected.find((v: string) => v !== "immediate");
              if (period === "") labels.push("Any");
              else if (period) labels.push(`${period} days`);
              return labels.join(", ");
            }}
            displayEmpty
          >
            <MenuItem value="immediate">
              <Checkbox checked={filters.immediatelyAvailable} />
              <ListItemText primary="Immediately Available" />
            </MenuItem>
            <Divider />
            <MenuItem value="">
              <Radio checked={filters.noticePeriod === ""} />
              <ListItemText primary="Any" />
            </MenuItem>
            <MenuItem value="15">
              <Radio checked={filters.noticePeriod === "15"} />
              <ListItemText primary="15 days" />
            </MenuItem>
            <MenuItem value="30">
              <Radio checked={filters.noticePeriod === "30"} />
              <ListItemText primary="30 days" />
            </MenuItem>
            <MenuItem value="60">
              <Radio checked={filters.noticePeriod === "60"} />
              <ListItemText primary="60 days" />
            </MenuItem>
            <MenuItem value="90">
              <Radio checked={filters.noticePeriod === "90"} />
              <ListItemText primary="90 days" />
            </MenuItem>
          </Select>
        </div>
      </div>
      <div className={styles.filterActions}>
        <Button
          id="applyBtn"
          variant="contained"
          className={styles.applyBtn}
          sx={{
            backgroundColor: "#4361EE",
            color: "#fff",
            fontWeight: 500,
            textTransform: "none",
            borderRadius: "8px",
            minWidth: "100px",
            marginRight: "1rem",
          }}
          onClick={handleApplyFilters}
        >
          Apply
        </Button>
        <Button
          id="resetBtn"
          variant="outlined"
          className={styles.resetBtn}
          onClick={handleResetFilters}
          sx={{
            borderColor: "#e2e8f0",
            color: "#4a5568",
            fontWeight: 500,
            textTransform: "none",
            borderRadius: "8px",
            minWidth: "100px",
          }}
        >
          Reset
        </Button>
      </div>
      <div className={styles.profileGrid}>
        {paginatedProfiles.length === 0 ? (
          <div className={styles.noResults}>
            {!appliedFilters.role
              ? "Please select required filters."
              : "No matching profiles. Please try different filters."}
          </div>
        ) : (
          profiles.map((profile) => {
            const { years, months } = calculateYearsOfExperience(
              profile.experience
            );
            return (
              <div key={profile._id} className={styles.profileCard}>
                <Avatar
                  sx={{
                    bgcolor: "#F472B6",
                    width: 84,
                    height: 84,
                    fontSize: 48,
                    margin: "0 auto",
                  }}
                >
                  {profile.name[0]}
                </Avatar>
                <h3>{profile.name}</h3>
                <p className={styles.role}>{profile.role}</p>
                <p className={styles.yoe}>{formatExperience(years, months)}</p>
                <div className={styles.skillsList}>
                  {profile.skills.slice(0, 3).map((skill, idx) => (
                    <Chip
                      key={idx}
                      label={skill}
                      className={styles.skillChip}
                    />
                  ))}
                  {profile.skills.length > 3 && (
                    <Chip
                      label={`+${profile.skills.length - 3} more`}
                      className={styles.skillChip}
                      sx={{
                        backgroundColor: "#e9effd !important",
                        color: "#4361EE !important",
                        fontWeight: 500,
                        borderRadius: "8px !important",
                        fontSize: "0.95rem !important",
                      }}
                    />
                  )}
                </div>
                <Button
                  variant="outlined"
                  className={styles.viewBtn}
                  onClick={() => navigate(`/profile/${profile._id}`)}
                >
                  View Profile
                </Button>
              </div>
            );
          })
        )}
      </div>
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <Button
            variant="outlined"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className={styles.pageBtn}
          >
            Prev
          </Button>
          <span className={styles.pageInfo}>
            {page} / {totalPages}
          </span>
          <Button
            variant="outlined"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className={styles.pageBtn}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default Explore;
