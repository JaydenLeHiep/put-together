import { useState, useEffect } from "react";
import type { DisplayCourseProps } from "./typeDisplayCourses";
import type { DisplayLessonType } from "../../../types/Lesson";
import { getLessonsByCourseIdForStudent } from "../../../services/lessonService";

export const DisplayCourse = ({
  course,
  isOpen,
  onToggle,
  selectedLesson,
  onSelectLesson,
}: DisplayCourseProps) => {
  const [lessons, setLessons] = useState<DisplayLessonType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    async function loadLessons() {
      try {
        setLoading(true);
        setError(null);

        const data = await getLessonsByCourseIdForStudent(course.courseId);
        setLessons(data);
      } catch (err) {
        console.log(err);
        setError("Failed to load lessons");
      } finally {
        setLoading(false);
      }
    }

    loadLessons();
  }, [isOpen, course.courseId]);

  return (
    <div className="mb-1">
      {/* COURSE HEADER */}
      <button
        onClick={() => onToggle(isOpen ? null : course.courseId)}
        className="w-full flex items-center justify-between px-3 py-2.5 font-semibold text-sm text-gray-700 hover:bg-lila-50 rounded-lg transition-colors duration-150 group"
      >
        <span className="flex items-center gap-2">
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

        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
          gültig nur bis {new Date(course.expiresAtUtc).toLocaleDateString()}
        </span>
      </button>

      {/* LESSON LIST */}
      {isOpen && (
        <div className="mt-1 ml-3 space-y-1">
          {loading && (
            <p className="text-xs text-gray-400 px-2 py-1">
              Loading lessons...
            </p>
          )}

          {error && <p className="text-xs text-red-500 px-2 py-1">{error}</p>}

          {!loading &&
            lessons.map((lesson) => (
              <button
                key={lesson.id}
                onClick={() => onSelectLesson(lesson)}
                className={`w-full text-left px-3 py-2 text-sm rounded-lg transition ${
                  selectedLesson?.id === lesson.id
                    ? "bg-lila-100 text-lila-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {lesson.title}
              </button>
            ))}
        </div>
      )}
    </div>
  );
};
