import React from "react";
import type { DisplayCourseProps } from "./typeDisplayCourses";
import type { Lesson } from "./lesson/typeDisplayLesson";
import { DisplayLesson } from "./lesson/DisplayLesson";

export const DisplayCourse = ({
  course,
  isOpen,
  onToggle,
}: DisplayCourseProps) => {
  const fakeLesson: Lesson = {
    id: `${course.courseId}-lesson-1`,
    title: "Einführung",
    content: `
      <p>Willkommen zum Kurs <strong>${course.title}</strong>.</p>
      <p>Dies ist eine Beispiellektion mit etwas Inhalt.</p>
      <ul>
        <li>Grundlagen</li>
        <li>Erklärung</li>
        <li>Zusammenfassung</li>
      </ul>
    `,
    videoLibraryId: "123456",
    videoGuid: "abc-def",
    fileDocuments: [
      {
        id: "4405a2c4-fc1b-4cb3-aaad-87e4177cd562",
        fileName: "exercises-lm.pdf",
      },
      {
        id: "5526b3d5-gd2c-5fd4-bbbe-98f5288ef673",
        fileName: "grammar-summary.pdf",
      },
    ],
  };

  return (
    <div className="mb-1">
      {/* COURSE HEADER */}
      <button
        onClick={() => onToggle(isOpen ? null : course.courseId)}
        className="w-full flex items-center justify-between px-3 py-2.5 font-semibold text-sm text-gray-700 hover:bg-lila-50 rounded-lg transition-colors duration-150 group"
      >
        <span className="flex items-center gap-2">
          {/* Arrow */}
          <svg
            className={`w-4 h-4 text-lila-600 transition-transform duration-200 ${
              isOpen ? "rotate-90" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>

          <span className="truncate">{course.title}</span>
        </span>

        {/* Expiry Badge */}
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
          {new Date(course.expiresAtUtc).toLocaleDateString()}
        </span>
      </button>

      {/* LESSON AREA */}
      {isOpen && (
        <div className="mt-1 ml-3 space-y-0.5">
          <DisplayLesson selectedLesson={fakeLesson} />
        </div>
      )}
    </div>
  );
};
