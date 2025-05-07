export interface Response<T> {
  message: string;
  data?: T;
}

export interface Order {
  id: string;
  amount: number;
  entity: string;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: "created" | "attempted" | "paid";
  attempts: number;
}

export interface ParsedResume {
  name: string;
  contact: {
    email: string;
    phone: string;
  };
  skills: {
    languages: Array<string>;
    technologies: Array<string>;
  };
  education: Array<{
    degree: string;
    institute: string;
    duration: string;
    grade: string;
  }>;
  projects: Array<{
    title: string;
    description: string;
  }>;
  experience: Array<{
    company: string;
    title: string;
    duration: string;
    location: string;
    details: Array<string>;
  }>;
  
}
