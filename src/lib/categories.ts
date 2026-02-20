export const CATEGORIES = [
  "SOFTWARE_ENGINEERING",
  "WEB_DEV",
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
  BACKEND: "bg-purple-100 text-purple-800",
  TESTING_QA: "bg-yellow-100 text-yellow-800",
  UX: "bg-pink-100 text-pink-800",
  ARCHITECTURE: "bg-orange-100 text-orange-800",
  WORKFLOWS: "bg-cyan-100 text-cyan-800",
  AI: "bg-red-100 text-red-800",
};
