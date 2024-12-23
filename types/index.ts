export interface ProjectDataType {
  title: string;
  description: string;
  technologies: string;
  link?: string;
}

export interface Skill {
  category: string;
  items: string[];
}

export interface Experience {
  title: string;
  company: string;
  position: string;
  start_date: string;
  end_date: string;
  description: string[];
  detailed_experience: string;
  location: string;
  isEndPresent: boolean;
}

export interface Education {
  university: string;
  major: string;
  gpa: string;
  level: string;
  graduation_date: string;
  coursework: string;
}

export interface Personal {
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  github: string;
  linkedin: string;
  website: string;
} 