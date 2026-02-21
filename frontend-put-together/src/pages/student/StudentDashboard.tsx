import { useState, useEffect } from "react";
import type { CategoryWithCourses } from "../../components/displayComponents/category/typeDisplayCategory";
import { DisplayCategory } from "../../components/displayComponents/category/DisplayCategory";
import { getCategoriesCourseForStudent } from "../../services/categoryCourseService";
import type { DisplayLessonType } from "../../types/Lesson";
import { DisplayLesson } from "../../components/displayComponents/lesson/DisplayLesson";

export const StudentDashboard = () => {
  // They are actually both categories and course together (not optimal -_- !!)
  const [categoriesWithCourses, setCategoriesWithCourses] = useState<
    CategoryWithCourses[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);
  const [openCourseId, setOpenCourseId] = useState<string | null>(null);

  const [selectedLesson, setSelectedLesson] =
    useState<DisplayLessonType | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getCategoriesCourseForStudent();
        setCategoriesWithCourses(data);
      } catch (err) {
        console.log(err);
        setError("Failed to load courses");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  function handleToggleCategory(id: string | null) {
    setOpenCategoryId(id);
    setOpenCourseId(null);
  }

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* SIDEBAR */}
      <aside className="lg:col-span-4">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-lila-600 to-lila-700 p-6">
            <h2 className="text-xl font-bold text-white">Deine Kurse</h2>
          </div>

          <div className="p-3">
            <DisplayCategory
              categoriesWithCourses={categoriesWithCourses}
              openCategoryId={openCategoryId}
              onToggleCategory={handleToggleCategory}
              openCourseId={openCourseId}
              onToggleCourse={setOpenCourseId}
              onSelectLesson={setSelectedLesson}
              selectedLesson={selectedLesson}
            />
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <section className="lg:col-span-8 space-y-6">
        <DisplayLesson selectedLesson={selectedLesson} />
      </section>
    </div>
  );
};
