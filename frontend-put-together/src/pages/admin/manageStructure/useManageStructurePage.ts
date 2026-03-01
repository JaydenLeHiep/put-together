import { useEffect, useState } from "react";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../../services/categoryService";
import {
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../../../services/courseService";
import type { Category } from "../../../types/category";
import type { Course } from "../../../types/course";

export type EditingCategory = {
  id: string;
  name: string;
  description?: string;
};

export type EditingCourse = {
  id: string;
  title: string;
  description: string;
  level: string;
  price: number | null;
};

export function useManageStructurePage() {
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

  async function reloadData() {
    const [cat, crs] = await Promise.all([
      getAllCategories(),
      getAllCourses(),
    ]);
    setCategories(cat);
    setCourses(crs);
  }

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
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    await reloadData();
  }

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
    setExpandedCourses((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    await reloadData();
  }

  function toggleCategory(id: string) {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleCourse(id: string) {
    setExpandedCourses((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function getCategoryTitle(category: Category) {
    return `${category.name} (${category.courseCount} ${
      category.courseCount === 1 ? "Kurs" : "Kurse"
    })`;
  }

  function resetCategoryForm() {
    setShowCategoryForm(false);
    setNewCategory({ name: "", description: "" });
  }

  function resetCourseForm() {
    setShowCourseForm(null);
    setNewCourse({ title: "", description: "", level: "A1", price: null });
  }

  return {
    categories,
    courses,
    expandedCategories,
    expandedCourses,
    showCategoryForm,
    showCourseForm,
    editingCategory,
    editingCourse,
    newCategory,
    newCourse,

    setShowCategoryForm,
    setShowCourseForm,
    setEditingCategory,
    setEditingCourse,
    setNewCategory,
    setNewCourse,

    handleCreateCategory,
    handleUpdateCategory,
    handleDeleteCategory,
    handleCreateCourse,
    handleUpdateCourse,
    handleDeleteCourse,
    toggleCategory,
    toggleCourse,
    getCategoryTitle,
    resetCategoryForm,
    resetCourseForm,
  };
}