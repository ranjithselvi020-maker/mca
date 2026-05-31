export type SubjectId =
  | 'python'
  | 'java'
  | 'ds'
  | 'dbms'
  | 'os'
  | 'cn'
  | 'se'
  | 'cloud'
  | 'ml'
  | 'ai'
  | 'web';

export interface Subject {
  id: SubjectId;
  title: string;
  code: string;
  category: string;
  description: string;
  topics: { name: string; completed: boolean }[];
  progress: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: number; // Index of the correct option
  explanation?: string;
}

export interface QuizResult {
  id: string;
  subjectTitle: string;
  score: number;
  total: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  date: string;
}

export interface StudentProfile {
  name: string;
  email: string;
  semester: number;
  streak: number;
  points: number;
  lastActiveDate: string;
}

export interface StudyGoal {
  id: string;
  title: string;
  completed: boolean;
  date: string;
}

export interface CodeProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  initialCode: string;
  testCases: { input: string; expected: string }[];
  solutionExplanation?: string;
}

export interface ResumeData {
  fullName: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  summary: string;
  skills: string[]; // comma-separated/list
  education: {
    institution: string;
    degree: string;
    year: string;
    gpa: string;
  }[];
  experience: {
    company: string;
    role: string;
    duration: string;
    details: string;
  }[];
  projects: {
    title: string;
    techStack: string;
    description: string;
  }[];
}

export interface CareerPath {
  title: string;
  demand: 'High' | 'Very High' | 'Moderate';
  description: string;
  skillsNeeded: string[];
  avgSalary: string;
  steps: string[];
}
