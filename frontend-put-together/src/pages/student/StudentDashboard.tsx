import { useEffect, useMemo, useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";
import { DisplayCategory } from "../../components/displayComponents/category/DisplayCategory";
import { DisplayLesson } from "../../components/displayComponents/lesson/DisplayLesson";

import type { CategoryWithCourses } from "../../components/displayComponents/category/typeDisplayCategory";
import type { DisplayLessonType } from "../../types/lesson";
import { type CategoryWithPaidCourses } from "../../types/course";
import { getStudentPaidCategoryCourses } from "../../services/courseService";

export function StudentDashboard() {
  const [loading, setLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] =
    useState<DisplayLessonType | null>(null);
  const [categoriesWithCourses, setCategoriesWithCourses] = useState<CategoryWithCourses[]>([]);

  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);
  const [openCourseId, setOpenCourseId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await getStudentPaidCategoryCourses();

        if (cancelled) return;

        const mapped = mapPaidCategoriesToDisplayCategories(data);
        setCategoriesWithCourses(mapped);
        setSelectedLesson(null);
      } catch (error) {
        console.error("Failed to load student courses", error);

        if (!cancelled) {
          setCategoriesWithCourses([]);
          setSelectedLesson(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    if (!q) return categoriesWithCourses;

    return categoriesWithCourses
      .map((category) => ({
        ...category,
        courses: category.courses.filter((course) => {
          const title = (course.title ?? "").toLowerCase();
          return title.includes(q);
        }),
      }))
      .filter((category) => category.courses.length > 0);
  }, [categoriesWithCourses, searchQuery]);

  const totalCourses = categoriesWithCourses.reduce(
    (sum, category) => sum + category.courses.length,
    0
  );

  function handleSelectLesson(lesson: DisplayLessonType) {
    setSelectedLesson(lesson);
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <aside className="lg:col-span-4 space-y-4">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-lila-600 to-lila-700 p-6">
            <h2 className="text-xl font-bold text-white mb-2">Kursinhalte</h2>
            <p className="text-lila-100 text-sm">
              {totalCourses} {totalCourses === 1 ? "Kurs" : "Kurse"} verfügbar
            </p>
          </div>

          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <input
                type="text"
                placeholder="Kurse durchsuchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-lila-500 focus:outline-none transition-colors text-gray-800"
              />

              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <div className="max-h-[calc(100vh-320px)] overflow-y-auto p-3">
            {filteredCategories.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                Keine Kurse gefunden
              </div>
            ) : (
              <DisplayCategory
                categoriesWithCourses={filteredCategories}
                openCategoryId={openCategoryId}
                onToggleCategory={setOpenCategoryId}
                openCourseId={openCourseId}
                onToggleCourse={setOpenCourseId}
                onSelectLesson={handleSelectLesson}
              />
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-lila-600 to-lila-700 rounded-2xl p-6 text-white shadow-lg">
          <h3 className="font-semibold mb-2">Ihr Lernbereich</h3>
          <div className="flex items-end gap-2 mb-3">
            <span className="text-4xl font-bold">{totalCourses}</span>
            <span className="text-lila-200 mb-1">aktive Kurse</span>
          </div>
          <div className="w-full bg-lila-800 rounded-full h-2 mb-4">
            <div className="bg-white h-2 rounded-full w-full" />
          </div>
        </div>
      </aside>

      <section className="lg:col-span-8 space-y-6">
        <DisplayLesson selectedLesson={selectedLesson} />
      </section>
    </div>
  );
}

function mapPaidCategoriesToDisplayCategories(
  data: CategoryWithPaidCourses[]
): CategoryWithCourses[] {
  return data
    .map((category) => ({
      categoryId: category.categoryId,
      categoryName: category.categoryName,
      courses: category.courses.map((course) => ({
        courseId: course.courseId,
        title: course.title,
        expiresAtUtc: course.expiresAtUtc,
      })),
    }))
    .sort((a, b) => a.categoryName.localeCompare(b.categoryName));
}