import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UploadIcon, DiscoverIcon, HiredIcon } from "../assets/icons";
import "../styles/Home.css";
import {
  MenuItem,
  Select,
  Checkbox,
  ListItemText,
  Divider,
} from "@mui/material";
import Radio from "@mui/material/Radio";
import useDocumentTitle from "../hooks/useDocumentTitle";
import AutoAwesome from "@mui/icons-material/AutoAwesome";
import { io } from "socket.io-client";
import baseUrl from "../api/baseUrl";
import useAppSelector from "../hooks/useAppSelector";
import useAppDispatch from "../hooks/useAppDispatch";
import { addNotification } from "../store/slices/notificationsSlice";

const Home: React.FC = () => {
  useDocumentTitle("Home");
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [filters, setFilters] = useState({
    role: "",
    keyword: "",
    yoe: "",
    noticePeriod: "",
    immediatelyAvailable: false,
  });
  const [touched, setTouched] = useState(false);

  const allRoles = [
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

  useEffect(() => {
    const socket = io(baseUrl);

    if (auth.token && auth.role === "job_seeker") {
      socket.on("notification", (data) => {
        if (data.to === auth.userId) {
          const company = data?.company?.name ?? "";
          const message = `A recruiter from ${
            company ?? "a company"
          } has viewed your profile`;
          dispatch(addNotification({ message, type: data.type }));
        }
      });
    }

    return () => {
      socket.off();
    };
  }, []);

  // On mount, read filters from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setFilters((prev) => ({
      ...prev,
      role: params.get("role") || "",
      keyword: params.get("keyword") || "",
      yoe: params.get("yoe") || "",
      noticePeriod: params.get("noticePeriod") || "",
      immediatelyAvailable: params.get("immediatelyAvailable") === "true",
    }));
  }, [location.search]);

  // On filter change, update URL
  const updateUrlParams = (newFilters: typeof filters) => {
    const params = new URLSearchParams();
    if (newFilters.role) params.set("role", newFilters.role);
    if (newFilters.keyword) params.set("keyword", newFilters.keyword);
    if (newFilters.yoe) params.set("yoe", newFilters.yoe);
    if (newFilters.noticePeriod)
      params.set("noticePeriod", newFilters.noticePeriod);
    if (newFilters.immediatelyAvailable)
      params.set("immediatelyAvailable", "true");
    navigate({ pathname: "/", search: params.toString() }, { replace: true });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => {
      const updated = { ...prev, [name]: value };
      updateUrlParams(updated);
      return updated;
    });
    setTouched(true);
  };

  // Handler for the custom notice period dropdown
  const handleNoticePeriodDropdownChange = (event: any) => {
    const value = event.target.value;
    const noticePeriodOptions = ["", "15", "30", "60", "90"];
    if (Array.isArray(value)) {
      const hasImmediate = value.includes("immediate");
      const lastSelected = value[value.length - 1];
      if (noticePeriodOptions.includes(lastSelected)) {
        setFilters((prev) => {
          const updated = {
            ...prev,
            immediatelyAvailable: hasImmediate,
            noticePeriod: lastSelected,
          };
          updateUrlParams(updated);
          return updated;
        });
      } else {
        setFilters((prev) => {
          const updated = {
            ...prev,
            immediatelyAvailable: hasImmediate,
          };
          updateUrlParams(updated);
          return updated;
        });
      }
    } else {
      setFilters((prev) => {
        const updated = { ...prev, noticePeriod: value };
        updateUrlParams(updated);
        return updated;
      });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!filters.role) {
      setTouched(true);
      return;
    }
    const params = new URLSearchParams();
    params.set("role", filters.role);
    if (filters.keyword) params.set("keyword", filters.keyword);
    if (filters.yoe) params.set("yoe", filters.yoe);
    if (filters.noticePeriod) params.set("noticePeriod", filters.noticePeriod);
    if (filters.immediatelyAvailable)
      params.set("immediatelyAvailable", "true");
    navigate(`/explore?${params.toString()}`);
  };

  const handleReset = () => {
    setFilters({
      role: "",
      keyword: "",
      yoe: "",
      noticePeriod: "",
      immediatelyAvailable: false,
    });
    setTouched(false);
    navigate({ pathname: "/" }, { replace: true });
  };

  const popularTags = [
    "React",
    "Python",
    "Product Management",
    "Data Science",
    "UI/UX",
    "Marketing",
    "Azure",
  ];

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
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>
            Find the Right
            <br />
            Talent, Instantly.
          </h1>
          <p>Find thousands of candidates that match your requirements</p>

          {/* Search Form */}
          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-inputs">
              <select
                name="role"
                value={filters.role}
                onChange={handleChange}
                required
                className={touched && !filters.role ? "input-error" : ""}
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
              <input
                type="text"
                placeholder="Keyword"
                value={filters.keyword}
                onChange={handleChange}
                name="keyword"
              />
              <select value={filters.yoe} onChange={handleChange} name="yoe">
                <option value="">YOE</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((y) => (
                  <option key={y} value={y}>
                    {y} Years
                  </option>
                ))}
              </select>
              <Select
                id="noticePeriod"
                name="noticePeriod"
                multiple
                value={noticePeriodSelectValue}
                onChange={handleNoticePeriodDropdownChange}
                renderValue={(selected) => {
                  if (!selected.length) return "Select notice period";
                  const labels = [];
                  if (selected.includes("immediate"))
                    labels.push("Immediately Available");
                  const period = (selected as string[]).find(
                    (v: string) => v !== "immediate"
                  );
                  if (period === "") labels.push("Any");
                  else if (period) labels.push(`${period} days`);
                  return labels.join(", ");
                }}
                displayEmpty
                size="small"
                sx={{
                  minHeight: "40px",
                  height: "40px",
                  fontSize: "1rem",
                  ".MuiSelect-select": { padding: "10px 14px" },
                  background: "#fff",
                  borderRadius: "4px",
                }}
              >
                <MenuItem value="immediate" dense>
                  <Checkbox
                    checked={filters.immediatelyAvailable}
                    size="small"
                  />
                  <ListItemText primary="Immediately Available" />
                </MenuItem>
                <Divider />
                <MenuItem value="" dense>
                  <Radio checked={filters.noticePeriod === ""} size="small" />
                  <ListItemText primary="Any" />
                </MenuItem>
                <MenuItem value="15" dense>
                  <Radio checked={filters.noticePeriod === "15"} size="small" />
                  <ListItemText primary="15 days" />
                </MenuItem>
                <MenuItem value="30" dense>
                  <Radio checked={filters.noticePeriod === "30"} size="small" />
                  <ListItemText primary="30 days" />
                </MenuItem>
                <MenuItem value="60" dense>
                  <Radio checked={filters.noticePeriod === "60"} size="small" />
                  <ListItemText primary="60 days" />
                </MenuItem>
                <MenuItem value="90" dense>
                  <Radio checked={filters.noticePeriod === "90"} size="small" />
                  <ListItemText primary="90 days" />
                </MenuItem>
              </Select>
              <button type="submit" className="search-btn">
                Search
              </button>
              <button
                type="button"
                className="search-btn"
                style={{
                  background: "#e2e8f0",
                  color: "#222b45",
                  marginLeft: 8,
                }}
                onClick={handleReset}
              >
                Reset
              </button>
            </div>
          </form>
        </div>
        <div className="hero-image">
          <img
            src="/assets/hero-illustration.svg"
            alt="Find talent illustration"
          />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-icon">
              <UploadIcon />
            </div>
            <h3>Create Profile</h3>
            <p>Build your professional profile</p>
          </div>
          <div className="step">
            <div className="step-icon">
              <DiscoverIcon />
            </div>
            <h3>Get Discovered</h3>
            <p>Recruiters find your profile</p>
          </div>
          <div className="step">
            <div className="step-icon">
              <HiredIcon />
            </div>
            <h3>Get Hired</h3>
            <p>Land your dream job</p>
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section className="ai-showcase">
        <div className="section-header">
          <div className="ai-badge">AI-Powered</div>
          <h2>Smart Recruitment Features</h2>
          {/* <div className="section-subtitle">
            Experience the future of recruitment with our advanced AI
            capabilities
          </div> */}
        </div>
        <div className="ai-features-grid">
          <div className="ai-feature-card">
            <div className="ai-feature-icon">
              <AutoAwesome />
            </div>
            <div className="audience-badge recruiter">For Recruiters</div>
            <h3>Smart JD Analysis</h3>
            <p>
              Upload job descriptions and let our AI automatically extract key
              requirements, skills, and experience needed to find the perfect
              candidates
            </p>
            <ul className="feature-list">
              <li>Automatic skill extraction</li>
              <li>Experience level detection</li>
              <li>Notice period requirements</li>
              <li>Smart candidate matching</li>
            </ul>
          </div>
          <div className="ai-feature-card">
            <div className="ai-feature-icon">
              <AutoAwesome />
            </div>
            <div className="audience-badge jobseeker">For Job Seekers</div>
            <h3>Resume Parsing</h3>
            <p>
              Create detailed profiles instantly with our advanced resume
              parsing technology to showcase your skills and experience
            </p>
            <ul className="feature-list">
              <li>Instant profile creation</li>
              <li>Accurate skill extraction</li>
              <li>Work history formatting</li>
              <li>Education details parsing</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Popular Tags Section */}
      <section className="popular-tags">
        <h2>Popular Tags</h2>
        <div className="tags">
          {popularTags.map((tag, index) => (
            <button
              key={index}
              className="tag"
              onClick={() => setFilters((prev) => ({ ...prev, tags: tag }))}
            >
              {tag}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
