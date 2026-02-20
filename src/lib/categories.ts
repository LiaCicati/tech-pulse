export const CATEGORIES = [
  "SOFTWARE_ENGINEERING",
  "WEB_DEV",
  "REACT_NEXTJS",
  "FRAMEWORKS",
  "CMS",
  "BACKEND",
  "TESTING_QA",
  "UX",
  "ARCHITECTURE",
  "WORKFLOWS",
  "AI",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_LABELS: Record<Category, string> = {
  SOFTWARE_ENGINEERING: "Software Engineering",
  WEB_DEV: "Web Dev",
  REACT_NEXTJS: "React & Next.js",
  FRAMEWORKS: "Frameworks",
  CMS: "CMS",
  BACKEND: "Backend",
  TESTING_QA: "Testing & QA",
  UX: "UX",
  ARCHITECTURE: "Architecture",
  WORKFLOWS: "Workflows",
  AI: "AI",
};

export const CATEGORY_COLORS: Record<Category, string> = {
  SOFTWARE_ENGINEERING: "bg-blue-100 text-blue-800",
  WEB_DEV: "bg-green-100 text-green-800",
  REACT_NEXTJS: "bg-sky-100 text-sky-800",
  FRAMEWORKS: "bg-violet-100 text-violet-800",
  CMS: "bg-amber-100 text-amber-800",
  BACKEND: "bg-purple-100 text-purple-800",
  TESTING_QA: "bg-yellow-100 text-yellow-800",
  UX: "bg-pink-100 text-pink-800",
  ARCHITECTURE: "bg-orange-100 text-orange-800",
  WORKFLOWS: "bg-cyan-100 text-cyan-800",
  AI: "bg-red-100 text-red-800",
};
