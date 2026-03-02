import type { ReactNode } from "react";

export type TeacherDashboardCardItem = {
  title: string;
  description: string;
  navigateTo: string;
  iconBgColor: string;
  icon: ReactNode;
};

export const teacherDashboardCards: TeacherDashboardCardItem[] = [
  {
    title: "Lektion erstellen",
    description: "Erstellen Sie eine neue Video-Lektion für Ihre Kurse",
    navigateTo: "/teacher/post-lesson",
    iconBgColor: "bg-gradient-to-br from-blue-500 to-blue-600",
    icon: (
      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
        />
      </svg>
    ),
  },
  {
    title: "Lektionen verwalten",
    description: "Eigene Lektionen ansehen, kommentieren und veröffentlichen",
    navigateTo: "/teacher/courses",
    iconBgColor: "bg-gradient-to-br from-green-500 to-green-600",
    icon: (
      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
  },
  {
    title: "Produkte",
    description: "Veröffentlichte Lektionen und Produktansicht ansehen",
    navigateTo: "/teacher/product-courses",
    iconBgColor: "bg-gradient-to-br from-purple-500 to-purple-600",
    icon: (
      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      </svg>
    ),
  },
];