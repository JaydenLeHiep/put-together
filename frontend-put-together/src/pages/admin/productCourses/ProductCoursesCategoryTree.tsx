import type { Category } from "../../../types/category";
import type { CourseWithLessons, LessonInCourse } from "../../../types/course";

type CategoryWithCourses = Category & {
  courses: CourseWithLessons[];
};

type ProductCoursesCategoryTreeProps = {
  categories: CategoryWithCourses[];
  openCategoryId: string | null;
  onToggleCategory: (id: string | null) => void;
  openCourseId: string | null;
  onToggleCourse: (id: string | null) => void;
  selectedLessonId: string | null;
  onSelectLesson: (lesson: LessonInCourse) => void;
};

export default function ProductCoursesCategoryTree({
  categories,
  openCategoryId,
  onToggleCategory,
  openCourseId,
  onToggleCourse,
  selectedLessonId,
  onSelectLesson,
}: ProductCoursesCategoryTreeProps) {
  return (
    <div className="px-3">
      {categories.map((category) => {
        const isCategoryOpen = openCategoryId === category.id;

        return (
          <div key={category.id} className="mb-2">
            <button
              onClick={() => onToggleCategory(isCategoryOpen ? null : category.id)}
              className="w-full flex items-center justify-between px-3 py-2.5 font-bold text-sm text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-150"
            >
              <span className="flex items-center gap-2">
                <svg
                  className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
                    isCategoryOpen ? "rotate-90" : ""
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

                {category.name}
              </span>

              <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full font-medium">
                {category.courses.length}
              </span>
            </button>

            {isCategoryOpen && (
              <div className="mt-1 ml-6 space-y-1">
                {category.courses.map((course) => {
                  const isCourseOpen = openCourseId === course.id;

                  return (
                    <div key={course.id} className="mb-1">
                      <button
                        onClick={() => onToggleCourse(isCourseOpen ? null : course.id)}
                        className="w-full flex items-center justify-between px-3 py-2.5 font-semibold text-sm text-gray-700 hover:bg-lila-50 rounded-lg transition-colors duration-150"
                      >
                        <span className="flex items-center gap-2">
                          <svg
                            className={`w-4 h-4 text-lila-600 transition-transform duration-200 ${
                              isCourseOpen ? "rotate-90" : ""
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
                          {course.lessons.length}
                        </span>
                      </button>

                      {isCourseOpen && (
                        <div className="mt-1 ml-3 space-y-0.5">
                          {course.lessons.map((lesson, index) => (
                            <button
                              key={lesson.id}
                              onClick={() => onSelectLesson(lesson)}
                              className={`block w-full text-left px-4 py-2.5 text-sm rounded-lg transition-all duration-150 ${
                                selectedLessonId === lesson.id
                                  ? "bg-lila-100 text-lila-900 font-medium border-l-4 border-lila-600"
                                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                                    selectedLessonId === lesson.id
                                      ? "bg-lila-600 text-white"
                                      : "bg-gray-100 text-gray-600"
                                  }`}
                                >
                                  {String(index + 1).padStart(2, "0")}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <p className="truncate">{lesson.title}</p>
                                  <span className="inline-block mt-1 text-[10px] font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded">
                                    Veröffentlicht
                                  </span>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}