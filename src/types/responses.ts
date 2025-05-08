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
  about: Array<string>;
  name: string;
  email: string;
  phone: string;
  skills: Array<string>;
  keywords: Array<string>;
  education: Array<{
    degree: string;
    university: string;
    duration: string;
    grade: string;
  }>;
  projects: Array<{
    title: string;
    details: Array<string>;
  }>;
  experience: Array<{
    company: string;
    title: string;
    duration: string;
    details: Array<string>;
  }>;
}

export interface ParsedJD {
  role: string;
  keywords: Array<string>;
  experience: string;
  notice_period: string;
  immediately_available_required: string;
}

export interface ProfileAccess {
  access: boolean;
  contactData: {
    email: boolean;
    phone: boolean;
    driveLink: boolean;
  };
}
