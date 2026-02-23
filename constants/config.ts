export const ROUTES = {
  // Public
  LOGIN: "/login",
  
  // Student
  STUDENT_HOME: "/home",
  STUDENT_LEARNING: "/learning",
  STUDENT_LESSON: "/lesson",
  STUDENT_PRACTICE: "/practice",
  STUDENT_QUIZ: "/quiz",
  STUDENT_CALENDAR: "/calendar",
  STUDENT_NOTICE: "/notice",
  
  // Instructor
  INSTRUCTOR_ADMIN: "/admin",
  
  // Unauthorized
  UNAUTHORIZED: "/unauthorized",
} as const;

export const COLLECTIONS = {
  USERS: "users",
  COURSES: "courses",
  LESSONS: "lessons",
  PROGRESS: "progress",
  QUIZZES: "quizzes",
  QUIZ_ATTEMPTS: "quizAttempts",
  PRACTICES: "practices",
  PRACTICE_SUBMISSIONS: "practiceSubmissions",
  SUBMISSIONS: "submissions",
  COMMENTS: "comments",
  INSTRUCTOR_EMAILS: "instructorEmails",
  STUDENT_EMAILS: "studentEmails",
} as const;

export const STORAGE_PATHS = {
  SUBMISSIONS: "submissions",
} as const;

export const MAX_FILE_SIZE = 5 * 1024 * 1024 * 1024; // 5GB

export const ALLOWED_FILE_TYPES = [".zip"];
