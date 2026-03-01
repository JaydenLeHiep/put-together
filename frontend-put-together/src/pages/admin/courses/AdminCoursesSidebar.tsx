import type { Category } from "../../../types/category";
import type { CourseWithLessons, LessonInCourse } from "../../../types/course";

type AdminCoursesSidebarProps = {
  categories: Category[];
  courses: CourseWithLessons[];
  openStatus: {
    draft: boolean;
    published: boolean;
  };
  setOpenStatus: React.Dispatch<
    React.SetStateAction<{
      draft: boolean;
      published: boolean;
    }>
  >;
  openCategories: Record<string, boolean>;
  setOpenCategories: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  openCourses: Record<string, boolean>;
  setOpenCourses: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  selectedLesson: LessonInCourse | null;
  onSelectLesson: (lesson: LessonInCourse) => void;
};

export default function AdminCoursesSidebar({
  categories,
  courses,
  openStatus,
  setOpenStatus,
  openCategories,
  setOpenCategories,
  openCourses,
  setOpenCourses,
  selectedLesson,
  onSelectLesson,
}: AdminCoursesSidebarProps) {
  function lessonsByStatus(course: CourseWithLessons, published: boolean) {
    return course.lessons.filter((l) => l.isPublished === published);
  }

  function coursesByCategory(categoryId: string) {
    return courses.filter((c) => c.categoryId === categoryId);
  }

  return (
    <aside className="lg:col-span-4">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-lila-600 to-lila-700 p-6">
          <h2 className="text-xl font-bold text-white">Lektionen</h2>
        </div>

        <div className="divide-y divide-gray-100">
          <Section
            title="Entwürfe"
            open={openStatus.draft}
            toggle={() => setOpenStatus((s) => ({ ...s, draft: !s.draft }))}
          >
            {categories.map((category) => {
              const categoryCourses = coursesByCategory(category.id);
              const hasLessons = categoryCourses.some(
                (course) => lessonsByStatus(course, false).length > 0,
              );

              if (!hasLessons) return null;

              return (
                <CategoryBlock
                  key={category.id}
                  category={category}
                  courses={categoryCourses}
                  isDraft={true}
                  openCategories={openCategories}
                  setOpenCategories={setOpenCategories}
                  openCourses={openCourses}
                  setOpenCourses={setOpenCourses}
                  selectedLesson={selectedLesson}
                  onSelect={onSelectLesson}
                />
              );
            })}
          </Section>

          <Section
            title="Veröffentlicht"
            open={openStatus.published}
            toggle={() =>
              setOpenStatus((s) => ({ ...s, published: !s.published }))
            }
          >
            {categories.map((category) => {
              const categoryCourses = coursesByCategory(category.id);
              const hasLessons = categoryCourses.some(
                (course) => lessonsByStatus(course, true).length > 0,
              );

              if (!hasLessons) return null;

              return (
                <CategoryBlock
                  key={category.id}
                  category={category}
                  courses={categoryCourses}
                  isDraft={false}
                  openCategories={openCategories}
                  setOpenCategories={setOpenCategories}
                  openCourses={openCourses}
                  setOpenCourses={setOpenCourses}
                  selectedLesson={selectedLesson}
                  onSelect={onSelectLesson}
                />
              );
            })}
          </Section>
        </div>
      </div>
    </aside>
  );
}

function Section({
  title,
  open,
  toggle,
  children,
}: {
  title: string;
  open: boolean;
  toggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <button
        onClick={toggle}
        className="w-full px-6 py-4 font-bold text-left text-gray-800 hover:bg-gray-50 transition-colors duration-150 flex items-center justify-between group"
      >
        <span className="text-base">{title}</span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {open && <div className="pb-3">{children}</div>}
    </div>
  );
}

type CategoryBlockProps = {
  category: Category;
  courses: CourseWithLessons[];
  isDraft: boolean;
  openCategories: Record<string, boolean>;
  setOpenCategories: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  openCourses: Record<string, boolean>;
  setOpenCourses: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  selectedLesson: LessonInCourse | null;
  onSelect: (lesson: LessonInCourse) => void;
};

function CategoryBlock({
  category,
  courses,
  isDraft,
  openCategories,
  setOpenCategories,
  openCourses,
  setOpenCourses,
  selectedLesson,
  onSelect,
}: CategoryBlockProps) {
  const categoryKey = `${category.id}-${isDraft ? "draft" : "published"}`;
  const isCategoryOpen = !!openCategories[categoryKey];

  const totalLessons = courses.reduce((sum, course) => {
    const lessons = course.lessons.filter((l) => l.isPublished === !isDraft);
    return sum + lessons.length;
  }, 0);

  if (totalLessons === 0) return null;

  return (
    <div className="px-3 mb-2">
      <button
        onClick={() =>
          setOpenCategories((o) => ({ ...o, [categoryKey]: !o[categoryKey] }))
        }
        className="w-full flex items-center justify-between px-3 py-2.5 font-bold text-sm text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-150 group"
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
          {totalLessons}
        </span>
      </button>

      {isCategoryOpen && (
        <div className="mt-1 ml-4 space-y-1">
          {courses.map((course) => {
            const lessons = course.lessons.filter(
              (l) => l.isPublished === !isDraft,
            );

            if (lessons.length === 0) return null;

            return (
              <CourseBlock
                key={course.id}
                course={course}
                lessons={lessons}
                openCourses={openCourses}
                setOpenCourses={setOpenCourses}
                selectedLesson={selectedLesson}
                onSelect={onSelect}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

type CourseBlockProps = {
  course: CourseWithLessons;
  lessons: LessonInCourse[];
  openCourses: Record<string, boolean>;
  setOpenCourses: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  selectedLesson: LessonInCourse | null;
  onSelect: (lesson: LessonInCourse) => void;
};

function CourseBlock({
  course,
  lessons,
  openCourses,
  setOpenCourses,
  selectedLesson,
  onSelect,
}: CourseBlockProps) {
  const isOpen = !!openCourses[course.id];

  return (
    <div className="mb-1">
      <button
        onClick={() =>
          setOpenCourses((o) => ({ ...o, [course.id]: !o[course.id] }))
        }
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
          {course.title}
        </span>
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
          {lessons.length}
        </span>
      </button>

      {isOpen && (
        <div className="mt-1 ml-3 space-y-0.5">
          {lessons.map((lesson) => (
            <button
              key={lesson.id}
              onClick={() => onSelect(lesson)}
              className={`block w-full text-left px-4 py-2.5 text-sm rounded-lg transition-all duration-150 ${
                selectedLesson?.id === lesson.id
                  ? "bg-lila-100 text-lila-900 font-medium border-l-3 border-lila-600 shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    selectedLesson?.id === lesson.id ? "bg-lila-600" : "bg-gray-300"
                  }`}
                />
                <span className="truncate">{lesson.title}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}