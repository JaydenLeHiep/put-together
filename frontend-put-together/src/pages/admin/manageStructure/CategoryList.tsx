import type { Category } from "../../../types/category";
import type { Course } from "../../../types/course";
import type {
  EditingCategory,
  EditingCourse,
} from "./useManageStructurePage";

type CategoryListProps = {
  categories: Category[];
  courses: Course[];
  expandedCategories: Set<string>;
  expandedCourses: Set<string>;
  showCourseForm: string | null;
  editingCategory: EditingCategory | null;
  editingCourse: EditingCourse | null;
  newCourse: {
    title: string;
    description: string;
    level: string;
    price: number | null;
  };
  onSetShowCourseForm: (value: string | null) => void;
  onSetEditingCategory: (value: EditingCategory | null) => void;
  onSetEditingCourse: (value: EditingCourse | null) => void;
  onSetNewCourse: (value: {
    title: string;
    description: string;
    level: string;
    price: number | null;
  }) => void;
  onToggleCategory: (id: string) => void;
  onToggleCourse: (id: string) => void;
  onGetCategoryTitle: (category: Category) => string;
  onCreateCourse: (categoryId: string) => void;
  onUpdateCategory: () => void;
  onDeleteCategory: (id: string) => void;
  onUpdateCourse: () => void;
  onDeleteCourse: (id: string) => void;
  onResetCourseForm: () => void;
};

const levelOptions = ["A1", "A2", "B1", "B2", "C1", "C2"];

const themeColors = [
  {
    gradient: "from-blue-500 to-indigo-600",
    bgLight: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    ring: "focus:ring-blue-100",
  },
  {
    gradient: "from-emerald-400 to-teal-600",
    bgLight: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    ring: "focus:ring-emerald-100",
  },
  {
    gradient: "from-orange-400 to-rose-500",
    bgLight: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
    ring: "focus:ring-rose-100",
  },
  {
    gradient: "from-purple-500 to-fuchsia-600",
    bgLight: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
    ring: "focus:ring-purple-100",
  },
  {
    gradient: "from-cyan-400 to-blue-500",
    bgLight: "bg-cyan-50",
    text: "text-cyan-700",
    border: "border-cyan-200",
    ring: "focus:ring-cyan-100",
  },
];

const levelBadges: Record<string, string> = {
  A1: "bg-emerald-100 text-emerald-700 border-emerald-200",
  A2: "bg-teal-100 text-teal-700 border-teal-200",
  B1: "bg-blue-100 text-blue-700 border-blue-200",
  B2: "bg-indigo-100 text-indigo-700 border-indigo-200",
  C1: "bg-purple-100 text-purple-700 border-purple-200",
  C2: "bg-rose-100 text-rose-700 border-rose-200",
};

export default function CategoryList({
  categories,
  courses,
  expandedCategories,
  expandedCourses,
  showCourseForm,
  editingCategory,
  editingCourse,
  newCourse,
  onSetShowCourseForm,
  onSetEditingCategory,
  onSetEditingCourse,
  onSetNewCourse,
  onToggleCategory,
  onToggleCourse,
  onGetCategoryTitle,
  onCreateCourse,
  onUpdateCategory,
  onDeleteCategory,
  onUpdateCourse,
  onDeleteCourse,
  onResetCourseForm,
}: CategoryListProps) {
  return (
    <div className="space-y-6">
      {categories.map((category, index) => {
        const categoryCourses = courses.filter((c) => c.categoryId === category.id);
        const isExpanded = expandedCategories.has(category.id);
        const isEditing = editingCategory?.id === category.id;
        const theme = themeColors[index % themeColors.length];
        const categoryHasCourses = categoryCourses.length > 0;

        return (
          <div
            key={category.id}
            className={`overflow-visible rounded-3xl border ${isExpanded ? theme.border : "border-slate-200"
              } bg-white shadow-sm transition-all duration-300 hover:shadow-lg`}
          >
            {/* Category Header */}
            <div
              className={`flex items-center justify-between gap-4 px-6 py-5 ${isExpanded ? theme.bgLight + " bg-opacity-40" : ""
                }`}
            >
              <div
                onClick={() => !isEditing && onToggleCategory(category.id)}
                className="group flex flex-1 cursor-pointer items-center gap-5"
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${theme.gradient} text-white shadow-md transition-transform duration-300 group-hover:scale-105`}
                >
                  <svg
                    className={`h-6 w-6 transition-transform duration-300 ${isExpanded ? "rotate-90" : ""
                      }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-xl font-extrabold text-slate-700 tracking-tight">
                      {onGetCategoryTitle(category)}
                    </h3>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${theme.bgLight} ${theme.text}`}
                    >
                      {categoryCourses.length} {categoryCourses.length === 1 ? "Kurs" : "Kurse"}
                    </span>
                  </div>

                  {category.description && (
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-500 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:opacity-100">
                <button
                  onClick={() =>
                    onSetEditingCategory({
                      id: category.id,
                      name: category.name,
                      description: category.description,
                    })
                  }
                  className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 active:scale-95"
                  title="Bearbeiten"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>

                <div className="relative group">
                  <button
                    onClick={() => onDeleteCategory(category.id)}
                    disabled={categoryHasCourses}
                    className={`rounded-xl border bg-white p-2.5 shadow-sm transition-all active:scale-95 ${categoryHasCourses
                      ? "cursor-not-allowed border-slate-200 text-slate-300"
                      : "border-slate-200 text-slate-600 hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                      }`}
                    title={categoryHasCourses ? "" : "Löschen"}
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>

                  {categoryHasCourses && (
                    <div className="pointer-events-none absolute right-full top-1/2 z-50 mr-3 w-64 -translate-y-1/2 whitespace-normal break-words rounded-lg bg-slate-800 px-3 py-2 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
                      Diese Kategorie kann nicht gelöscht werden, solange noch Kurse darin enthalten sind.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Edit Category Form */}
            {isEditing && editingCategory && (
              <div className="border-t border-slate-100 bg-slate-50 p-6">
                <div className={`rounded-2xl border-l-4 border-l-blue-500 bg-white p-6 shadow-sm`}>
                  <h4 className="mb-5 text-lg font-bold text-slate-700 flex items-center gap-2">
                    <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    Kategorie bearbeiten
                  </h4>

                  <div className="space-y-5">
                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-700">
                        Name *
                      </label>
                      <input
                        value={editingCategory.name}
                        onChange={(e) =>
                          onSetEditingCategory({
                            ...editingCategory,
                            name: e.target.value,
                          })
                        }
                        className={`w-full rounded-xl border border-slate-300 px-4 py-3.5 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 ${theme.ring}`}
                        placeholder="Kategoriename"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-700">
                        Beschreibung
                      </label>
                      <textarea
                        value={editingCategory.description || ""}
                        onChange={(e) =>
                          onSetEditingCategory({
                            ...editingCategory,
                            description: e.target.value,
                          })
                        }
                        rows={3}
                        className={`w-full rounded-xl border border-slate-300 px-4 py-3.5 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 ${theme.ring} resize-none`}
                        placeholder="Optionale Beschreibung"
                      />
                    </div>

                    <div className="flex flex-wrap gap-3 pt-2">
                      <button
                        onClick={onUpdateCategory}
                        className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg active:scale-95"
                      >
                        Änderungen speichern
                      </button>

                      <button
                        onClick={() => onSetEditingCategory(null)}
                        className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 active:scale-95"
                      >
                        Abbrechen
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Expanded Category Content */}
            {isExpanded && (
              <div className="border-t border-slate-100 bg-slate-50/50 p-6">
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-lg font-extrabold text-slate-700">
                      Kursübersicht
                    </h4>
                    <p className="mt-1 text-sm font-medium text-slate-500">
                      Verwalten Sie die Lerninhalte dieser Kategorie.
                    </p>
                  </div>

                  <button
                    onClick={() => onSetShowCourseForm(category.id)}
                    className="group flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg active:scale-95"
                  >
                    <svg className="h-5 w-5 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                    Neuer Kurs
                  </button>
                </div>

                {/* Create Course Form */}
                {showCourseForm === category.id && (
                  <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 ring-1 ring-slate-400/10">
                    <h5 className="mb-5 text-lg font-bold text-slate-700 flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                      </span>
                      Neuen Kurs erstellen
                    </h5>

                    <div className="space-y-5">
                      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-sm font-bold text-slate-700">
                            Titel *
                          </label>
                          <input
                            value={newCourse.title}
                            onChange={(e) =>
                              onSetNewCourse({
                                ...newCourse,
                                title: e.target.value,
                              })
                            }
                            placeholder="z.B. Anfängerkurs"
                            className="w-full rounded-xl border border-slate-300 px-4 py-3.5 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-bold text-slate-700">
                            Niveau *
                          </label>
                          <select
                            value={newCourse.level}
                            onChange={(e) =>
                              onSetNewCourse({
                                ...newCourse,
                                level: e.target.value,
                              })
                            }
                            className="w-full rounded-xl border border-slate-300 px-4 py-3.5 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 bg-white"
                          >
                            {levelOptions.map((level) => (
                              <option key={level} value={level}>
                                {level}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-bold text-slate-700">
                          Beschreibung
                        </label>
                        <textarea
                          value={newCourse.description}
                          onChange={(e) =>
                            onSetNewCourse({
                              ...newCourse,
                              description: e.target.value,
                            })
                          }
                          placeholder="Worum geht es in diesem Kurs?"
                          rows={3}
                          className="w-full rounded-xl border border-slate-300 px-4 py-3.5 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 resize-none"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-bold text-slate-700">
                          Preis (€)
                        </label>
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                            <span className="text-slate-500 font-medium">€</span>
                          </div>
                          <input
                            type="number"
                            value={newCourse.price || ""}
                            onChange={(e) =>
                              onSetNewCourse({
                                ...newCourse,
                                price: e.target.value
                                  ? parseFloat(e.target.value)
                                  : null,
                              })
                            }
                            placeholder="0.00"
                            className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-3.5 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3 pt-2">
                        <button
                          onClick={() => onCreateCourse(category.id)}
                          className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg active:scale-95"
                        >
                          Kurs anlegen
                        </button>

                        <button
                          onClick={onResetCourseForm}
                          className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 active:scale-95"
                        >
                          Abbrechen
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Course List */}
                {categoryCourses.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white px-6 py-12 text-center">
                    <div className="mb-3 rounded-full bg-slate-50 p-4">
                      <svg className="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    </div>
                    <h3 className="text-sm font-bold text-slate-700">Keine Kurse vorhanden</h3>
                    <p className="mt-1 text-sm font-medium text-slate-500">
                      Erstellen Sie den ersten Kurs in dieser Kategorie.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {categoryCourses.map((course) => {
                      const isCourseExpanded = expandedCourses.has(course.id);
                      const isCourseEditing = editingCourse?.id === course.id;
                      const badgeStyle = levelBadges[course.level] || "bg-slate-100 text-slate-700 border-slate-200";
                      const courseHasLessons = course.lessonCount > 0;

                      return (
                        <div
                          key={course.id}
                          className="overflow-visible rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
                        >
                          {/* Course Header */}
                          <div className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-slate-50/50">
                            <div
                              onClick={() =>
                                !isCourseEditing && onToggleCourse(course.id)
                              }
                              className="group flex flex-1 cursor-pointer items-center gap-4"
                            >
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400 transition-colors group-hover:bg-slate-200 group-hover:text-slate-600">
                                <svg
                                  className={`h-5 w-5 transition-transform duration-300 ${isCourseExpanded ? "rotate-90 text-slate-700" : ""
                                    }`}
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2.5}
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-3">
                                  <span className={`rounded-lg border px-2.5 py-1 text-xs font-extrabold shadow-sm ${badgeStyle}`}>
                                    {course.level}
                                  </span>

                                  <h5 className="truncate text-base font-extrabold text-slate-700">
                                    {course.title}
                                  </h5>
                                </div>

                                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-slate-500">
                                  <span className="flex items-center gap-1.5">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                    {course.lessonCount} {course.lessonCount === 1 ? "Lektion" : "Lektionen"}
                                  </span>

                                  {course.price !== null && (
                                    <span className="flex items-center gap-1.5">
                                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                      €{course.price.toFixed(2)}
                                    </span>
                                  )}

                                  <span
                                    className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-bold ${course.isPublished
                                      ? "bg-emerald-100 text-emerald-700"
                                      : "bg-amber-100 text-amber-700"
                                      }`}
                                  >
                                    <span className={`h-1.5 w-1.5 rounded-full ${course.isPublished ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                                    {course.isPublished ? "Veröffentlicht" : "Entwurf"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  onSetEditingCourse({
                                    id: course.id,
                                    title: course.title,
                                    description: course.description,
                                    level: course.level,
                                    price: course.price,
                                  })
                                }
                                className="rounded-xl p-2.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 active:scale-95"
                                title="Bearbeiten"
                              >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                              </button>

                              <div className="relative group">
                                <button
                                  onClick={() => onDeleteCourse(course.id)}
                                  disabled={courseHasLessons}
                                  className={`rounded-xl p-2.5 transition-colors active:scale-95 ${courseHasLessons
                                    ? "cursor-not-allowed text-slate-300"
                                    : "text-slate-400 hover:bg-red-50 hover:text-red-600"
                                    }`}
                                  title={courseHasLessons ? "" : "Löschen"}
                                >
                                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                </button>

                                {courseHasLessons && (
                                  <div className="pointer-events-none absolute right-full top-1/2 z-50 mr-3 w-64 -translate-y-1/2 whitespace-normal break-words rounded-lg bg-slate-800 px-3 py-2 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
                                    Dieser Kurs kann nicht gelöscht werden, solange noch Lektionen darin enthalten sind.
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Edit Course Form */}
                          {isCourseEditing && editingCourse && (
                            <div className="border-t border-slate-100 bg-slate-50 p-5">
                              <div className="rounded-2xl bg-white p-6 shadow-sm">
                                <h5 className="mb-5 text-base font-bold text-slate-700">
                                  Kurs bearbeiten
                                </h5>

                                <div className="space-y-5">
                                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                    <div>
                                      <label className="mb-2 block text-sm font-bold text-slate-700">
                                        Titel *
                                      </label>
                                      <input
                                        value={editingCourse.title}
                                        onChange={(e) =>
                                          onSetEditingCourse({
                                            ...editingCourse,
                                            title: e.target.value,
                                          })
                                        }
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3.5 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                      />
                                    </div>

                                    <div>
                                      <label className="mb-2 block text-sm font-bold text-slate-700">
                                        Level *
                                      </label>
                                      <select
                                        value={editingCourse.level}
                                        onChange={(e) =>
                                          onSetEditingCourse({
                                            ...editingCourse,
                                            level: e.target.value,
                                          })
                                        }
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3.5 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 bg-white"
                                      >
                                        {levelOptions.map((level) => (
                                          <option key={level} value={level}>
                                            {level}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>

                                  <div>
                                    <label className="mb-2 block text-sm font-bold text-slate-700">
                                      Beschreibung
                                    </label>
                                    <textarea
                                      value={editingCourse.description}
                                      onChange={(e) =>
                                        onSetEditingCourse({
                                          ...editingCourse,
                                          description: e.target.value,
                                        })
                                      }
                                      rows={3}
                                      className="w-full rounded-xl border border-slate-300 px-4 py-3.5 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 resize-none"
                                    />
                                  </div>

                                  <div>
                                    <label className="mb-2 block text-sm font-bold text-slate-700">
                                      Preis (€)
                                    </label>
                                    <div className="relative">
                                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                        <span className="text-slate-500 font-medium">€</span>
                                      </div>
                                      <input
                                        type="number"
                                        value={editingCourse.price || ""}
                                        onChange={(e) =>
                                          onSetEditingCourse({
                                            ...editingCourse,
                                            price: e.target.value
                                              ? parseFloat(e.target.value)
                                              : null,
                                          })
                                        }
                                        className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-3.5 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                      />
                                    </div>
                                  </div>

                                  <div className="flex flex-wrap gap-3 pt-2">
                                    <button
                                      onClick={onUpdateCourse}
                                      className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg active:scale-95"
                                    >
                                      Speichern
                                    </button>

                                    <button
                                      onClick={() => onSetEditingCourse(null)}
                                      className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 active:scale-95"
                                    >
                                      Abbrechen
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Expanded Course Details */}
                          {isCourseExpanded && !isCourseEditing && (
                            <div className="border-t border-slate-100 bg-white px-5 py-5">
                              <div className="rounded-2xl bg-slate-50/50 p-5 border border-slate-100">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                  <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                      Kursbeschreibung
                                    </p>
                                    <p className="mt-2 text-sm leading-relaxed text-slate-700">
                                      {course.description || <span className="italic text-slate-400">Keine Beschreibung hinterlegt</span>}
                                    </p>
                                  </div>

                                  <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                      Metadaten
                                    </p>
                                    <div className="mt-2 space-y-2">
                                      <div className="flex justify-between text-sm">
                                        <span className="font-medium text-slate-500">Erstellt am:</span>
                                        <span className="font-bold text-slate-700">{new Date(course.createdAt).toLocaleDateString("de-DE")}</span>
                                      </div>
                                      <div className="flex justify-between text-sm">
                                        <span className="font-medium text-slate-500">Status:</span>
                                        <span className="font-bold text-slate-700">{course.isPublished ? "Sichtbar" : "Verborgen"}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}