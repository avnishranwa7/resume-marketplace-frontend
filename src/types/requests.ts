import { Experience, Project } from ".";

export interface UpdateProfileRequest {
  id: string;
  name: string;
  role: string;
  email: string;
  about: string;
  experience: Experience[];
  projects: Project[];
  skills: string[];
  education: any[];
  immediatelyAvailable?: boolean;
  noticePeriod?: number;
  driveLink?: string;
  phone?: string;
}
