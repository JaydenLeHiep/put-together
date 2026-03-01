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
    <div className="space-y-3">
      {categories.map((category) => {
        const categoryCourses = courses.filter((c) => c.categoryId === category.id);
        const isExpanded = expandedCategories.has(category.id);
        const isEditing = editingCategory?.id === category.id;

        return (
          <div
            key={category.id}
            className="border border-gray-200 rounded-lg bg-white shadow-sm"
          >
            <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition">
              <div
                onClick={() => !isEditing && onToggleCategory(category.id)}
                className="flex items-center gap-3 flex-1 cursor-pointer"
              >
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    isExpanded ? "rotate-90" : ""
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

                <div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    {onGetCategoryTitle(category)}
                  </h3>
                  {category.description && (
                    <p className="text-sm text-gray-500">{category.description}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    onSetEditingCategory({
                      id: category.id,
                      name: category.name,
                      description: category.description,
                    })
                  }
                  className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded hover:bg-blue-50"
                >
                  Bearbeiten
                </button>
                <button
                  onClick={() => onDeleteCategory(category.id)}
                  className="text-red-600 hover:text-red-800 px-3 py-1 rounded hover:bg-red-50"
                >
                  Löschen
                </button>
              </div>
            </div>

            {isEditing && editingCategory && (
              <div className="px-4 pb-4 border-t bg-gray-50">
                <div className="pt-4 space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name *</label>
                    <input
                      value={editingCategory.name}
                      onChange={(e) =>
                        onSetEditingCategory({
                          ...editingCategory,
                          name: e.target.value,
                        })
                      }
                      className="border border-gray-300 p-2 rounded w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
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
                      rows={2}
                      className="border border-gray-300 p-2 rounded w-full"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={onUpdateCategory}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      Speichern
                    </button>
                    <button
                      onClick={() => onSetEditingCategory(null)}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                    >
                      Abbrechen
                    </button>
                  </div>
                </div>
              </div>
            )}

            {isExpanded && (
              <div className="border-t bg-gray-50 p-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium text-gray-700">
                    Kurse in dieser Kategorie
                  </h4>
                  <button
                    onClick={() => onSetShowCourseForm(category.id)}
                    className="bg-green-600 text-white px-4 py-1.5 text-sm rounded hover:bg-green-700"
                  >
                    + Neuer Kurs
                  </button>
                </div>

                {showCourseForm === category.id && (
                  <div className="bg-white border rounded-lg p-4 mb-4 shadow-sm">
                    <h5 className="font-semibold mb-3">Neuen Kurs erstellen</h5>

                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium mb-1">
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
                            placeholder="Kurstitel"
                            className="border border-gray-300 p-2 rounded w-full text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Level *
                          </label>
                          <select
                            value={newCourse.level}
                            onChange={(e) =>
                              onSetNewCourse({
                                ...newCourse,
                                level: e.target.value,
                              })
                            }
                            className="border border-gray-300 p-2 rounded w-full text-sm"
                          >
                            <option value="A1">A1</option>
                            <option value="A2">A2</option>
                            <option value="B1">B1</option>
                            <option value="B2">B2</option>
                            <option value="C1">C1</option>
                            <option value="C2">C2</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">
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
                          placeholder="Kursbeschreibung"
                          rows={2}
                          className="border border-gray-300 p-2 rounded w-full text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Preis (€)
                        </label>
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
                          placeholder="Optional"
                          className="border border-gray-300 p-2 rounded w-full text-sm"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => onCreateCourse(category.id)}
                          className="bg-green-600 text-white px-4 py-2 text-sm rounded hover:bg-green-700"
                        >
                          Speichern
                        </button>
                        <button
                          onClick={onResetCourseForm}
                          className="bg-gray-300 text-gray-700 px-4 py-2 text-sm rounded hover:bg-gray-400"
                        >
                          Abbrechen
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {categoryCourses.length === 0 ? (
                  <p className="text-gray-500 text-sm py-4">
                    Noch keine Kurse in dieser Kategorie
                  </p>
                ) : (
                  <div className="space-y-2">
                    {categoryCourses.map((course) => {
                      const isCourseExpanded = expandedCourses.has(course.id);
                      const isCourseEditing = editingCourse?.id === course.id;

                      return (
                        <div key={course.id} className="bg-white border rounded-lg">
                          <div className="flex items-center justify-between p-3 hover:bg-gray-50">
                            <div
                              onClick={() =>
                                !isCourseEditing && onToggleCourse(course.id)
                              }
                              className="flex items-center gap-2 flex-1 cursor-pointer"
                            >
                              <svg
                                className={`w-4 h-4 text-gray-400 transition-transform ${
                                  isCourseExpanded ? "rotate-90" : ""
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

                              <div>
                                <div className="font-medium text-gray-800">
                                  <span className="text-lila-600 font-semibold">
                                    {course.level}
                                  </span>{" "}
                                  – {course.title}
                                </div>

                                <div className="text-xs text-gray-500">
                                  {course.lessonCount}{" "}
                                  {course.lessonCount === 1
                                    ? "Lektion"
                                    : "Lektionen"}
                                  {course.price && ` • €${course.price}`}
                                  <span
                                    className={`ml-2 px-2 py-0.5 rounded text-xs ${
                                      course.isPublished
                                        ? "bg-green-100 text-green-700"
                                        : "bg-gray-100 text-gray-600"
                                    }`}
                                  >
                                    {course.isPublished ? "Veröffentlicht" : "Entwurf"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-2">
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
                                className="text-blue-600 hover:text-blue-800 px-2 py-1 text-sm rounded hover:bg-blue-50"
                              >
                                Bearbeiten
                              </button>
                              <button
                                onClick={() => onDeleteCourse(course.id)}
                                className="text-red-600 hover:text-red-800 px-2 py-1 text-sm rounded hover:bg-red-50"
                              >
                                Löschen
                              </button>
                            </div>
                          </div>

                          {isCourseEditing && editingCourse && (
                            <div className="px-3 pb-3 border-t bg-gray-50">
                              <div className="pt-3 space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-sm font-medium mb-1">
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
                                      className="border border-gray-300 p-2 rounded w-full text-sm"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium mb-1">
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
                                      className="border border-gray-300 p-2 rounded w-full text-sm"
                                    >
                                      <option value="A1">A1</option>
                                      <option value="A2">A2</option>
                                      <option value="B1">B1</option>
                                      <option value="B2">B2</option>
                                      <option value="C1">C1</option>
                                      <option value="C2">C2</option>
                                    </select>
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-sm font-medium mb-1">
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
                                    rows={2}
                                    className="border border-gray-300 p-2 rounded w-full text-sm"
                                  />
                                </div>

                                <div>
                                  <label className="block text-sm font-medium mb-1">
                                    Preis (€)
                                  </label>
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
                                    className="border border-gray-300 p-2 rounded w-full text-sm"
                                  />
                                </div>

                                <div className="flex gap-2">
                                  <button
                                    onClick={onUpdateCourse}
                                    className="bg-green-600 text-white px-4 py-2 text-sm rounded hover:bg-green-700"
                                  >
                                    Speichern
                                  </button>
                                  <button
                                    onClick={() => onSetEditingCourse(null)}
                                    className="bg-gray-300 text-gray-700 px-4 py-2 text-sm rounded hover:bg-gray-400"
                                  >
                                    Abbrechen
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          {isCourseExpanded && !isCourseEditing && (
                            <div className="px-3 pb-3 border-t bg-gray-50">
                              <div className="pt-3 text-sm text-gray-600">
                                <p className="mb-2">
                                  <strong>Beschreibung:</strong>{" "}
                                  {course.description || "Keine Beschreibung"}
                                </p>
                                <p>
                                  <strong>Erstellt am:</strong>{" "}
                                  {new Date(course.createdAt).toLocaleDateString("de-DE")}
                                </p>
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