export interface User {
  id: string;
  email: string;
  name: string;
  role: "student" | "instructor";
  createdAt: Date;
}

export interface Course {
  id: string;
  title: string;
  startDate: Date;
  totalWeeks: number;
  lessonsPerWeek: number;
  notionPageIds: {
    home: string;
    calendar: string;
    notice: string;
    [key: string]: string;
  };
}

export interface Lesson {
  id: string;
  week: number;
  session: number;
  title: string;
  notionPageId: string;
  order: number;
}

export interface Progress {
  userId: string;
  lessonId: string;
  completed: boolean;
  completedAt?: Date;
  scrollProgress?: number;
}

export interface Quiz {
  id: string;
  title: string;
  week: number;
  session: number;
  questions: Question[];
  maxAttempts: number;
}

export interface Question {
  id: string;
  type: "multiple" | "subjective";
  question: string;
  options?: string[];
  correctAnswer?: string;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  answers: Record<string, string>;
  score: number;
  passed: boolean;
  feedback?: string;
  createdAt: Date;
}

export interface Practice {
  id: string;
  title: string;
  week: number;
  session: number;
  description: string;
  promptTemplate: string;
}

export interface PracticeSubmission {
  id: string;
  userId: string;
  practiceId: string;
  prompt: string;
  score: number;
  feedback: string;
  suggestions: string[];
  createdAt: Date;
}

export interface Submission {
  id: string;
  userId: string;
  lessonId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  status: "submitted" | "late" | "returned";
  submittedAt: Date;
  deadline?: Date;
  instructorComment?: string;
}

export interface InstructorComment {
  id: string;
  submissionId: string;
  comment: string;
  createdAt: Date;
}
