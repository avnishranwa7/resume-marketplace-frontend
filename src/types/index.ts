export interface User {
  id: string;
  email: string;
  name: string;
  role: "jobseeker" | "recruiter";
}

export interface Profile {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  yearsOfExperience: number;
  currentRole: string;
  expectedCTC: number;
  skills: string[];
  education: Education[];
  experience: Experience[];
  projects: Project[];
}

export interface Education {
  college: string;
  degree: string;
  startDate: string;
  endDate?: string;
  ongoing?: boolean;
  grade?: string;
  currentlyStudying?: boolean;
}

export interface Experience {
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  currentlyWorking?: boolean;
  description?: string;
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface ProfileData {
  _id: string;
  userId: string;
  name: string;
  email: string;
  role: string;
  about: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  keywords: string[];
  phone?: string;
  yearsOfExperience?: number;
  immediatelyAvailable?: boolean;
  noticePeriod?: number;
  resumeLink?: string;
}
