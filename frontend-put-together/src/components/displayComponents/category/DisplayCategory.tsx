import { DisplayCourse } from "../course/DisplayCourse";
import type { DisplayCategoryCourseProps } from "./typeDisplayCategory";

export const DisplayCategory = ({
  categoriesWithCourses,
  openCategoryId,
  onToggleCategory,
  openCourseId,
  onToggleCourse,
  selectedLesson,
  onSelectLesson,
}: DisplayCategoryCourseProps) => {
  return (
    <div className="px-3">
      {categoriesWithCourses.map((categoryAndCourse) => {
        const isOpen = openCategoryId === categoryAndCourse.categoryId;

        return (
          <div key={categoryAndCourse.categoryId} className="mb-2">
            {/* CATEGORY HEADER */}
            <button
              onClick={() =>
                onToggleCategory(isOpen ? null : categoryAndCourse.categoryId)
              }
              className="w-full flex items-center justify-between px-3 py-2.5 font-bold text-sm text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-150"
            >
              <span className="flex items-center gap-2">
                <svg
                  className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
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

                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  />
                </svg>

                {categoryAndCourse.categoryName}
              </span>

              <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full font-medium">
                {categoryAndCourse.courses.length}
              </span>
            </button>

            {/* COURSES */}
            {isOpen && (
              <div className="mt-1 ml-6 space-y-1">
                {categoryAndCourse.courses.map((course) => (
                  <DisplayCourse
                    key={course.courseId}
                    course={course}
                    isOpen={openCourseId === course.courseId}
                    onToggle={onToggleCourse}
                    selectedLesson={selectedLesson}
                    onSelectLesson={onSelectLesson}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
