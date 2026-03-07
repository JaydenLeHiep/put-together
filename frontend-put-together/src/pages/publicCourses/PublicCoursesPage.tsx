import { useEffect, useMemo, useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";
import PublicCourseModal from "./PublicCourseModal";
import {
  type PublicCategoryCatalog,
  type PublicCourseCard,
} from "../../types/course";
import { getPublicCourseCatalog } from "../../services/courseService";

const levelColors: Record<string, { dot: string; text: string; bg: string }> = {
  A1: { dot: "bg-emerald-400", text: "text-emerald-700", bg: "bg-emerald-50" },
  A2: { dot: "bg-teal-400", text: "text-teal-700", bg: "bg-teal-50" },
  B1: { dot: "bg-sky-400", text: "text-sky-700", bg: "bg-sky-50" },
  B2: { dot: "bg-violet-400", text: "text-violet-700", bg: "bg-violet-50" },
  C1: { dot: "bg-amber-400", text: "text-amber-700", bg: "bg-amber-50" },
  C2: { dot: "bg-rose-400", text: "text-rose-700", bg: "bg-rose-50" },
};

function SearchIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  );
}

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
        if (!cancelled) { setCategories([]); setSelectedCategoryId(null); }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
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
          return title.includes(q) || desc.includes(q) || level.includes(q);
        }),
      }))
      .filter((category) => category.courses.length > 0);
  }, [categories, searchQuery]);

  const visibleCategories = filteredCategories.slice(0, 3);
  const activeCategory =
    visibleCategories.find((c) => c.categoryId === selectedCategoryId) ??
    visibleCategories[0] ?? null;
  const visibleCourses = activeCategory?.courses.slice(0, 9) ?? [];

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <div className="min-h-[calc(100vh-120px)] bg-lila-50/30">
        <section className="mx-auto max-w-7xl px-6 py-12 lg:py-16">

          {/* ── Hero ── */}
          <div className="relative overflow-hidden rounded-[2rem] bg-lila-700 px-8 py-12 text-white md:px-12">
            {/* dot pattern */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />
            {/* light blobs */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-lila-400 opacity-30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-12 left-1/4 h-52 w-52 rounded-full bg-purple-300 opacity-20 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-lila-800/40 to-transparent" />

            <div className="relative max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/80">
                <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
                Lila Deutsch Sprach Zentrum
              </span>
              <h1 className="mt-5 text-4xl font-black leading-[1.1] tracking-tight md:text-5xl">
                Entdecken Sie unsere<br />
                <span className="text-white/80">Deutschkurse</span>
              </h1>
              <p className="mt-4 max-w-lg text-sm leading-7 text-white/65">
                Finden Sie passende Kurse nach Kategorie, Niveau und Inhalt.
                Wählen Sie einen Kurs aus, um einen Überblick über die veröffentlichten Lektionen zu erhalten.
              </p>
            </div>
          </div>

          {/* ── Search ── */}
          <div className="mt-8">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lila-400">
                <SearchIcon />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Kurse durchsuchen…"
                className="w-full rounded-2xl border border-lila-200 bg-white py-3.5 pl-11 pr-5 text-sm text-gray-800 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-lila-500 focus:ring-3 focus:ring-lila-100 hover:border-lila-300"
              />
            </div>
          </div>

          {/* ── Category tabs ── */}
          <div className="mt-7 flex flex-wrap gap-2">
            {visibleCategories.map((category) => {
              const isActive = activeCategory?.categoryId === category.categoryId;
              return (
                <button
                  key={category.categoryId}
                  onClick={() => setSelectedCategoryId(category.categoryId)}
                  className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-lila-700 text-white shadow-lg shadow-lila-200"
                      : "border border-lila-200 bg-white text-lila-700 hover:border-lila-300 hover:bg-lila-50"
                  }`}
                >
                  {category.categoryName}
                  <span
                    className={`ml-2 rounded-full px-2 py-0.5 text-xs font-bold ${
                      isActive ? "bg-white/20 text-white" : "bg-lila-100 text-lila-600"
                    }`}
                  >
                    {category.courses.length}
                  </span>
                </button>
              );
            })}
          </div>

          {/* ── Active category header ── */}
          {activeCategory && (
            <div className="mt-8 flex items-end justify-between gap-4 border-b border-lila-100 pb-5">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-gray-900">
                  {activeCategory.categoryName}
                </h2>
                {activeCategory.categoryDescription && (
                  <p className="mt-1.5 max-w-2xl text-sm leading-6 text-gray-500">
                    {activeCategory.categoryDescription}
                  </p>
                )}
              </div>
              <span className="shrink-0 rounded-full bg-lila-100 px-3 py-1 text-xs font-bold text-lila-700">
                {visibleCourses.length} {visibleCourses.length === 1 ? "Kurs" : "Kurse"}
              </span>
            </div>
          )}

          {/* ── Course grid ── */}
          <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visibleCourses.map((course, i) => {
              const lc = levelColors[course.level] ?? { dot: "bg-gray-400", text: "text-gray-700", bg: "bg-gray-100" };
              return (
                <button
                  key={course.id}
                  onClick={() => setSelectedCourse(course)}
                  className="group overflow-hidden rounded-2xl border border-lila-100 bg-white text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-lila-200 hover:shadow-xl hover:shadow-lila-100/60"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video overflow-hidden bg-lila-50">
                    {course.courseThumbnailUrl ? (
                      <img
                        src={course.courseThumbnailUrl}
                        alt={course.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-lila-50 to-purple-50">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm text-lila-300">
                          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                        <span className="text-xs text-lila-400">Kein Thumbnail</span>
                      </div>
                    )}
                    {/* Level badge */}
                    <div className={`absolute left-3 top-3 flex items-center gap-1.5 rounded-lg ${lc.bg} px-2.5 py-1 shadow-sm`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${lc.dot}`} />
                      <span className={`text-xs font-bold ${lc.text}`}>{course.level}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-lila-100 bg-lila-50 px-2.5 py-1 text-xs font-semibold text-lila-700">
                        {course.publishedLessonCount}{" "}
                        {course.publishedLessonCount === 1 ? "Lektion" : "Lektionen"}
                      </span>
                      {course.price !== null && (
                        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-700">
                          €{course.price}
                        </span>
                      )}
                    </div>

                    <h3 className="mt-3 text-base font-black leading-tight tracking-tight text-gray-900 transition-colors group-hover:text-lila-700">
                      {course.title}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500">
                      {course.description || "Keine Beschreibung verfügbar."}
                    </p>

                    <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-lila-600">
                      Kurs ansehen
                      <ArrowIcon />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* ── Empty state ── */}
          {activeCategory && visibleCourses.length === 0 && (
            <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-lila-200 bg-white px-6 py-16 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-lila-50 text-lila-400">
                <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-600">Keine Kurse gefunden</p>
              <p className="mt-1 text-xs text-gray-400">Versuchen Sie eine andere Suche oder Kategorie.</p>
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