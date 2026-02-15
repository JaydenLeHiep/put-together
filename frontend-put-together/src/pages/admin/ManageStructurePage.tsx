import { useEffect, useState } from "react";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/categoryService";
import {
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../../services/courseService";
import type { Category } from "../../types/Category";
import type { Course } from "../../types/Course";

type EditingCategory = {
  id: string;
  name: string;
  description?: string;
};

type EditingCourse = {
  id: string;
  title: string;
  description: string;
  level: string;
  price: number | null;
};

export default function ManageStructurePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(new Set());

  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showCourseForm, setShowCourseForm] = useState<string | null>(null);

  const [editingCategory, setEditingCategory] = useState<EditingCategory | null>(null);
  const [editingCourse, setEditingCourse] = useState<EditingCourse | null>(null);

  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    level: "A1",
    price: null as number | null,
  });

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      const [cat, crs] = await Promise.all([
        getAllCategories(),
        getAllCourses(),
      ]);

      if (!cancelled) {
        setCategories(cat);
        setCourses(crs);
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, []);

  // Category operations
  async function handleCreateCategory() {
    if (!newCategory.name.trim()) return;

    await createCategory({
      name: newCategory.name,
      description: newCategory.description || undefined,
    });

    setNewCategory({ name: "", description: "" });
    setShowCategoryForm(false);
    await reloadData();
  }

  async function handleUpdateCategory() {
    if (!editingCategory || !editingCategory.name.trim()) return;

    await updateCategory(editingCategory.id, {
      name: editingCategory.name,
      description: editingCategory.description || undefined,
    });

    setEditingCategory(null);
    await reloadData();
  }

  async function handleDeleteCategory(id: string) {
    if (!confirm("Möchten Sie diese Kategorie wirklich löschen?")) return;

    await deleteCategory(id);
    setExpandedCategories(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    await reloadData();
  }

  // Course operations
  async function handleCreateCourse(categoryId: string) {
    if (!newCourse.title.trim()) return;

    await createCourse({
      categoryId,
      title: newCourse.title,
      description: newCourse.description,
      level: newCourse.level,
      price: newCourse.price,
    });

    setNewCourse({ title: "", description: "", level: "A1", price: null });
    setShowCourseForm(null);
    await reloadData();
  }

  async function handleUpdateCourse() {
    if (!editingCourse || !editingCourse.title.trim()) return;

    await updateCourse(editingCourse.id, {
      title: editingCourse.title,
      description: editingCourse.description,
      level: editingCourse.level,
      price: editingCourse.price,
    });

    setEditingCourse(null);
    await reloadData();
  }

  async function handleDeleteCourse(id: string) {
    if (!confirm("Möchten Sie diesen Kurs wirklich löschen?")) return;

    await deleteCourse(id);
    setExpandedCourses(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    await reloadData();
  }

  function toggleCategory(id: string) {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function toggleCourse(id: string) {
    setExpandedCourses(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function getCategoryTitle(category: Category) {
    return `${category.name} (${category.courseCount} ${category.courseCount === 1 ? 'Kurs' : 'Kurse'})`;
  }

  async function reloadData() {
    const [cat, crs] = await Promise.all([
      getAllCategories(),
      getAllCourses(),
    ]);
    setCategories(cat);
    setCourses(crs);
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-lila-700">
          Kategorien & Kurse verwalten
        </h1>
        <button
          onClick={() => setShowCategoryForm(!showCategoryForm)}
          className="bg-lila-600 text-white px-6 py-2 rounded-lg hover:bg-lila-700 transition"
        >
          + Neue Kategorie
        </button>
      </div>

      {/* Create Category Form */}
      {showCategoryForm && (
        <div className="bg-white border-2 border-lila-200 rounded-lg p-6 mb-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Neue Kategorie erstellen</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name *</label>
              <input
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                placeholder="z.B. Grammatik"
                className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-lila-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Beschreibung</label>
              <textarea
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                placeholder="Optionale Beschreibung"
                rows={3}
                className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-lila-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCreateCategory}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                Speichern
              </button>
              <button
                onClick={() => {
                  setShowCategoryForm(false);
                  setNewCategory({ name: "", description: "" });
                }}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="space-y-3">
        {categories.map((category) => {
          const categoryCourses = courses.filter(c => c.categoryId === category.id);
          const isExpanded = expandedCategories.has(category.id);
          const isEditing = editingCategory?.id === category.id;

          return (
            <div key={category.id} className="border border-gray-200 rounded-lg bg-white shadow-sm">
              {/* Category Header */}
              <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition">
                <div
                  onClick={() => !isEditing && toggleCategory(category.id)}
                  className="flex items-center gap-3 flex-1 cursor-pointer"
                >
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">
                      {getCategoryTitle(category)}
                    </h3>
                    {category.description && (
                      <p className="text-sm text-gray-500">{category.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingCategory({
                      id: category.id,
                      name: category.name,
                      description: category.description,
                    })}
                    className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded hover:bg-blue-50"
                  >
                    Bearbeiten
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="text-red-600 hover:text-red-800 px-3 py-1 rounded hover:bg-red-50"
                  >
                    Löschen
                  </button>
                </div>
              </div>

              {/* Edit Category Form */}
              {isEditing && (
                <div className="px-4 pb-4 border-t bg-gray-50">
                  <div className="pt-4 space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Name *</label>
                      <input
                        value={editingCategory.name}
                        onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                        className="border border-gray-300 p-2 rounded w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Beschreibung</label>
                      <textarea
                        value={editingCategory.description || ""}
                        onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                        rows={2}
                        className="border border-gray-300 p-2 rounded w-full"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleUpdateCategory}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        Speichern
                      </button>
                      <button
                        onClick={() => setEditingCategory(null)}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                      >
                        Abbrechen
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Expanded Category Content - Courses */}
              {isExpanded && (
                <div className="border-t bg-gray-50 p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-gray-700">Kurse in dieser Kategorie</h4>
                    <button
                      onClick={() => setShowCourseForm(category.id)}
                      className="bg-green-600 text-white px-4 py-1.5 text-sm rounded hover:bg-green-700"
                    >
                      + Neuer Kurs
                    </button>
                  </div>

                  {/* Create Course Form */}
                  {showCourseForm === category.id && (
                    <div className="bg-white border rounded-lg p-4 mb-4 shadow-sm">
                      <h5 className="font-semibold mb-3">Neuen Kurs erstellen</h5>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium mb-1">Titel *</label>
                            <input
                              value={newCourse.title}
                              onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                              placeholder="Kurstitel"
                              className="border border-gray-300 p-2 rounded w-full text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Level *</label>
                            <select
                              value={newCourse.level}
                              onChange={(e) => setNewCourse({ ...newCourse, level: e.target.value })}
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
                          <label className="block text-sm font-medium mb-1">Beschreibung</label>
                          <textarea
                            value={newCourse.description}
                            onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                            placeholder="Kursbeschreibung"
                            rows={2}
                            className="border border-gray-300 p-2 rounded w-full text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Preis (€)</label>
                          <input
                            type="number"
                            value={newCourse.price || ""}
                            onChange={(e) => setNewCourse({ ...newCourse, price: e.target.value ? parseFloat(e.target.value) : null })}
                            placeholder="Optional"
                            className="border border-gray-300 p-2 rounded w-full text-sm"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleCreateCourse(category.id)}
                            className="bg-green-600 text-white px-4 py-2 text-sm rounded hover:bg-green-700"
                          >
                            Speichern
                          </button>
                          <button
                            onClick={() => {
                              setShowCourseForm(null);
                              setNewCourse({ title: "", description: "", level: "A1", price: null });
                            }}
                            className="bg-gray-300 text-gray-700 px-4 py-2 text-sm rounded hover:bg-gray-400"
                          >
                            Abbrechen
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Courses List */}
                  {categoryCourses.length === 0 ? (
                    <p className="text-gray-500 text-sm py-4">Noch keine Kurse in dieser Kategorie</p>
                  ) : (
                    <div className="space-y-2">
                      {categoryCourses.map((course) => {
                        const isCourseExpanded = expandedCourses.has(course.id);
                        const isCourseEditing = editingCourse?.id === course.id;

                        return (
                          <div key={course.id} className="bg-white border rounded-lg">
                            {/* Course Header */}
                            <div className="flex items-center justify-between p-3 hover:bg-gray-50">
                              <div
                                onClick={() => !isCourseEditing && toggleCourse(course.id)}
                                className="flex items-center gap-2 flex-1 cursor-pointer"
                              >
                                <svg
                                  className={`w-4 h-4 text-gray-400 transition-transform ${isCourseExpanded ? 'rotate-90' : ''}`}
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                                <div>
                                  <div className="font-medium text-gray-800">
                                    <span className="text-lila-600 font-semibold">{course.level}</span> – {course.title}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {course.lessonCount} {course.lessonCount === 1 ? 'Lektion' : 'Lektionen'}
                                    {course.price && ` • €${course.price}`}
                                    <span className={`ml-2 px-2 py-0.5 rounded text-xs ${course.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                      {course.isPublished ? 'Veröffentlicht' : 'Entwurf'}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex gap-2">
                                <button
                                  onClick={() => setEditingCourse({
                                    id: course.id,
                                    title: course.title,
                                    description: course.description,
                                    level: course.level,
                                    price: course.price,
                                  })}
                                  className="text-blue-600 hover:text-blue-800 px-2 py-1 text-sm rounded hover:bg-blue-50"
                                >
                                  Bearbeiten
                                </button>
                                <button
                                  onClick={() => handleDeleteCourse(course.id)}
                                  className="text-red-600 hover:text-red-800 px-2 py-1 text-sm rounded hover:bg-red-50"
                                >
                                  Löschen
                                </button>
                              </div>
                            </div>

                            {/* Edit Course Form */}
                            {isCourseEditing && (
                              <div className="px-3 pb-3 border-t bg-gray-50">
                                <div className="pt-3 space-y-3">
                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <label className="block text-sm font-medium mb-1">Titel *</label>
                                      <input
                                        value={editingCourse.title}
                                        onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                                        className="border border-gray-300 p-2 rounded w-full text-sm"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium mb-1">Level *</label>
                                      <select
                                        value={editingCourse.level}
                                        onChange={(e) => setEditingCourse({ ...editingCourse, level: e.target.value })}
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
                                    <label className="block text-sm font-medium mb-1">Beschreibung</label>
                                    <textarea
                                      value={editingCourse.description}
                                      onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                                      rows={2}
                                      className="border border-gray-300 p-2 rounded w-full text-sm"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium mb-1">Preis (€)</label>
                                    <input
                                      type="number"
                                      value={editingCourse.price || ""}
                                      onChange={(e) => setEditingCourse({ ...editingCourse, price: e.target.value ? parseFloat(e.target.value) : null })}
                                      className="border border-gray-300 p-2 rounded w-full text-sm"
                                    />
                                  </div>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={handleUpdateCourse}
                                      className="bg-green-600 text-white px-4 py-2 text-sm rounded hover:bg-green-700"
                                    >
                                      Speichern
                                    </button>
                                    <button
                                      onClick={() => setEditingCourse(null)}
                                      className="bg-gray-300 text-gray-700 px-4 py-2 text-sm rounded hover:bg-gray-400"
                                    >
                                      Abbrechen
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Expanded Course Content */}
                            {isCourseExpanded && !isCourseEditing && (
                              <div className="px-3 pb-3 border-t bg-gray-50">
                                <div className="pt-3 text-sm text-gray-600">
                                  <p className="mb-2"><strong>Beschreibung:</strong> {course.description || "Keine Beschreibung"}</p>
                                  <p><strong>Erstellt am:</strong> {new Date(course.createdAt).toLocaleDateString('de-DE')}</p>
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

        {categories.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">Noch keine Kategorien vorhanden</p>
            <p className="text-sm mt-2">Erstellen Sie Ihre erste Kategorie, um zu beginnen</p>
          </div>
        )}
      </div>
    </div>
  );
}