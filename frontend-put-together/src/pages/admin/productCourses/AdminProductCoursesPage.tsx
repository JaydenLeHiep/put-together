import { useEffect, useMemo, useState } from "react";
import type { Category } from "../../../types/category";
import type { CourseWithLessons, LessonInCourse } from "../../../types/course";

import { getAllCategories } from "../../../services/categoryService";
import { getAllCourses, getCourseWithLessons } from "../../../services/courseService";

import LoadingSpinner from "../../../components/LoadingSpinner";
import ProductCoursesSidebar from "./../productCourses/ProductCoursesSidebar";
import ProductCourseDetail from "./../productCourses/ProductCourseDetail";
import ProductCourseEmptyState from "./../productCourses/ProductCourseEmptyState";

export default function AdminProductCoursesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [courses, setCourses] = useState<CourseWithLessons[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedLesson, setSelectedLesson] = useState<LessonInCourse | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);
  const [openCourseId, setOpenCourseId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);

      try {
        const [allCategories, allCourses] = await Promise.all([
          getAllCategories(),
          getAllCourses(),
        ]);

        const withLessons = await Promise.all(
          allCourses.map((course) => getCourseWithLessons(course.id))
        );

        if (cancelled) return;

        setCategories(allCategories);
        setCourses(withLessons);
        setSelectedLesson(null);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredCategories = useMemo(() => {
    return categories
      .map((category) => {
        const categoryCourses = courses
          .filter((course) => course.categoryId === category.id)
          .map((course) => {
            const publishedLessons = course.lessons.filter((lesson) => {
              if (!lesson.isPublished) return false;

              if (!normalizedQuery) return true;

              return lesson.title.toLowerCase().includes(normalizedQuery);
            });

            return {
              ...course,
              lessons: publishedLessons,
            };
          })
          .filter((course) => course.lessons.length > 0);

        return {
          ...category,
          courses: categoryCourses,
        };
      })
      .filter((category) => category.courses.length > 0);
  }, [categories, courses, normalizedQuery]);

  const totalPublishedLessons = useMemo(() => {
    return courses.reduce((sum, course) => {
      return sum + course.lessons.filter((lesson) => lesson.isPublished).length;
    }, 0);
  }, [courses]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <ProductCoursesSidebar
        categories={filteredCategories}
        totalPublishedLessons={totalPublishedLessons}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        openCategoryId={openCategoryId}
        onToggleCategory={setOpenCategoryId}
        openCourseId={openCourseId}
        onToggleCourse={setOpenCourseId}
        selectedLessonId={selectedLesson?.id ?? null}
        onSelectLesson={setSelectedLesson}
      />

      {!selectedLesson ? (
        <ProductCourseEmptyState />
      ) : (
        <ProductCourseDetail selectedLesson={selectedLesson} />
      )}
    </div>
  );
}