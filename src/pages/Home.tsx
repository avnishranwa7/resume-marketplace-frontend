import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadIcon, DiscoverIcon, HiredIcon } from '../assets/icons';
import { avatars } from '../assets/avatars';
import '../styles/Home.css';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    yoe: '',
    tags: '',
    city: '',
    state: '',
    country: ''
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search logic
    console.log('Search:', searchParams);
  };

  const featuredResumes = [
    {
      name: 'Emily R.',
      location: 'New York, NY',
      role: 'Software Engineer',
      experience: '3 Years',
      skills: ['JavaScript', 'React', 'Node.js'],
      image: avatars.emily
    },
    {
      name: 'Michael S.',
      location: 'San Francisco, CA',
      role: 'Data Analyst',
      experience: '3 Years',
      skills: ['SQL', 'Python', 'Tableau'],
      image: avatars.michael
    },
    {
      name: 'Sarah W.',
      location: 'Austin, TX',
      role: 'Marketing Manager',
      experience: '8 Years',
      skills: ['Social Marketing', 'Social Media'],
      image: avatars.sarah
    },
    {
      name: 'David L.',
      location: 'Seattle, WA',
      role: 'Product Designer',
      experience: '6 Years',
      skills: ['UI/UX', 'Sketch'],
      image: avatars.david
    }
  ];

  const popularTags = [
    'React', 'Python', 'Product Management', 'Data Science',
    'UI/UX', 'Marketing', 'Azure'
  ];

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Find the Right<br />Talent, Instantly.</h1>
          <p>Find thousands of candidates that match your requirements.</p>

          {/* Search Form */}
          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-inputs">
              <input
                type="text"
                placeholder="Keyword"
                value={searchParams.keyword}
                onChange={(e) => setSearchParams(prev => ({ ...prev, keyword: e.target.value }))}
              />
              <select
                value={searchParams.yoe}
                onChange={(e) => setSearchParams(prev => ({ ...prev, yoe: e.target.value }))}
              >
                <option value="">YOE</option>
                <option value="0-2">0-2 years</option>
                <option value="3-5">3-5 years</option>
                <option value="5+">5+ years</option>
              </select>
              <input
                type="text"
                placeholder="Tags"
                value={searchParams.tags}
                onChange={(e) => setSearchParams(prev => ({ ...prev, tags: e.target.value }))}
              />
              <input
                type="text"
                placeholder="City"
                value={searchParams.city}
                onChange={(e) => setSearchParams(prev => ({ ...prev, city: e.target.value }))}
              />
              <select
                value={searchParams.state}
                onChange={(e) => setSearchParams(prev => ({ ...prev, state: e.target.value }))}
              >
                <option value="">State</option>
                {/* Add state options */}
              </select>
              <select
                value={searchParams.country}
                onChange={(e) => setSearchParams(prev => ({ ...prev, country: e.target.value }))}
              >
                <option value="">Country</option>
                {/* Add country options */}
              </select>
              <button type="submit" className="search-btn">Search</button>
            </div>
          </form>
        </div>
        <div className="hero-image">
          <img src="/src/assets/hero-illustration.svg" alt="Find talent illustration" />
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

      {/* Featured Resumes Section */}
      <section className="featured-resumes">
        <div className="section-header">
          <h2>Featured Resumes</h2>
          <button onClick={() => navigate('/search')} className="view-more">
            View More →
          </button>
        </div>
        <div className="resume-cards">
          {featuredResumes.map((resume, index) => (
            <div key={index} className="resume-card">
              <img src={resume.image} alt={resume.name} className="avatar" />
              <h3>{resume.name}</h3>
              <p className="location">{resume.location}</p>
              <p className="role">{resume.role}</p>
              <p className="experience">{resume.experience}</p>
              <div className="skills">
                {resume.skills.map((skill, idx) => (
                  <span key={idx} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Tags Section */}
      <section className="popular-tags">
        <h2>Popular Tags</h2>
        <div className="tags">
          {popularTags.map((tag, index) => (
            <button key={index} className="tag" onClick={() => setSearchParams(prev => ({ ...prev, tags: tag }))}>
              {tag}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home; 