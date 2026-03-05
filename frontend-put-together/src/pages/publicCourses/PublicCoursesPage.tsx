import { useEffect, useMemo, useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";
import PublicCourseModal from "./PublicCourseModal";
import {
  type PublicCategoryCatalog,
  type PublicCourseCard,
} from "../../types/course";
import { getPublicCourseCatalog } from "../../services/courseService";   

export default function PublicCoursesPage() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<PublicCategoryCatalog[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<PublicCourseCard | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await getPublicCourseCatalog();

        if (cancelled) return;

        setCategories(data);
        setSelectedCategoryId(data[0]?.categoryId ?? null);
      } catch (error) {
        console.error("Failed to load public course catalog", error);
        if (!cancelled) {
          setCategories([]);
          setSelectedCategoryId(null);
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

    if (!q) return categories;

    return categories
      .map((category) => ({
        ...category,
        courses: category.courses.filter((course) => {
          const title = (course.title ?? "").toLowerCase();
          const desc = (course.description ?? "").toLowerCase();
          const level = (course.level ?? "").toLowerCase();
          return (
            title.includes(q) ||
            desc.includes(q) ||
            level.includes(q)
          );
        }),
      }))
      .filter((category) => category.courses.length > 0);
  }, [categories, searchQuery]);

  const visibleCategories = filteredCategories.slice(0, 3);

  const activeCategory =
    visibleCategories.find((c) => c.categoryId === selectedCategoryId) ??
    visibleCategories[0] ??
    null;

  const visibleCourses = activeCategory?.courses.slice(0, 9) ?? [];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div className="min-h-[calc(100vh-120px)] bg-gradient-to-b from-white via-lila-50/40 to-white">
        <section className="mx-auto max-w-7xl px-6 py-10 lg:py-14">
          {/* Header */}
          <div className="rounded-3xl bg-gradient-to-r from-lila-700 to-lila-600 px-8 py-10 text-white shadow-xl">
            <div className="max-w-3xl">
              <span className="inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">
                Alle Kurse
              </span>
              <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
                Entdecken Sie unsere Deutschkurse
              </h1>
              <p className="mt-4 text-sm leading-7 text-white/85 md:text-base">
                Finden Sie passende Kurse nach Kategorie, Niveau und Inhalt.
                Wählen Sie einen Kurs aus, um einen professionellen Überblick über
                die veröffentlichten Lektionen zu erhalten.
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Kurse durchsuchen..."
                className="w-full rounded-2xl border border-gray-300 px-5 py-3 pr-12 text-sm text-gray-800 outline-none transition focus:border-lila-500 focus:ring-2 focus:ring-lila-100"
              />
              <svg
                className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
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

          {/* Category tabs */}
          <div className="mt-8 flex flex-wrap gap-3">
            {visibleCategories.map((category) => {
              const isActive = activeCategory?.categoryId === category.categoryId;

              return (
                <button
                  key={category.categoryId}
                  onClick={() => setSelectedCategoryId(category.categoryId)}
                  className={`rounded-2xl px-5 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-lila-600 text-white shadow-lg"
                      : "border border-gray-200 bg-white text-gray-700 hover:bg-lila-50 hover:text-lila-700"
                  }`}
                >
                  {category.categoryName}
                  <span className="ml-2 rounded-full bg-black/10 px-2 py-0.5 text-xs">
                    {category.courses.length}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Category description */}
          {activeCategory && (
            <div className="mt-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {activeCategory.categoryName}
              </h2>
              {activeCategory.categoryDescription && (
                <p className="mt-2 max-w-3xl text-sm leading-7 text-gray-600">
                  {activeCategory.categoryDescription}
                </p>
              )}
            </div>
          )}

          {/* Course cards */}
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {visibleCourses.map((course) => (
              <button
                key={course.id}
                onClick={() => setSelectedCourse(course)}
                className="overflow-hidden rounded-3xl border border-gray-200 bg-white text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative aspect-video bg-gray-100">
                  {course.courseThumbnailUrl ? (
                    <img
                      src={course.courseThumbnailUrl}
                      alt={course.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                      Kein Thumbnail verfügbar
                    </div>
                  )}

                  <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-lila-700">
                    {course.level}
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                      {course.publishedLessonCount}{" "}
                      {course.publishedLessonCount === 1 ? "Lektion" : "Lektionen"}
                    </span>
                    {course.price !== null && (
                      <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700">
                        €{course.price}
                      </span>
                    )}
                  </div>

                  <h3 className="mt-3 text-xl font-bold text-gray-900">
                    {course.title}
                  </h3>

                  <p className="mt-2 line-clamp-3 text-sm leading-7 text-gray-600">
                    {course.description || "Keine Beschreibung verfügbar."}
                  </p>

                  <div className="mt-5 inline-flex items-center text-sm font-semibold text-lila-700">
                    Kurs ansehen
                    <svg
                      className="ml-2 h-4 w-4"
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
                  </div>
                </div>
              </button>
            ))}
          </div>

          {activeCategory && visibleCourses.length === 0 && (
            <div className="mt-8 rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
              <p className="text-sm font-medium text-gray-500">
                Keine Kurse in dieser Kategorie gefunden.
              </p>
            </div>
          )}
        </section>
      </div>

      <PublicCourseModal
        course={selectedCourse}
        isOpen={!!selectedCourse}
        onClose={() => setSelectedCourse(null)}
      />
    </>
  );
}