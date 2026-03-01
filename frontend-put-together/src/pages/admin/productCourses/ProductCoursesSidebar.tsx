import type { Category } from "../../../types/category";
import type { CourseWithLessons, LessonInCourse } from "../../../types/course";
import ProductCoursesCategoryTree from "./ProductCoursesCategoryTree";

type CategoryWithCourses = Category & {
  courses: CourseWithLessons[];
};

type ProductCoursesSidebarProps = {
  categories: CategoryWithCourses[];
  totalPublishedLessons: number;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  openCategoryId: string | null;
  onToggleCategory: (id: string | null) => void;
  openCourseId: string | null;
  onToggleCourse: (id: string | null) => void;
  selectedLessonId: string | null;
  onSelectLesson: (lesson: LessonInCourse) => void;
};

export default function ProductCoursesSidebar({
  categories,
  totalPublishedLessons,
  searchQuery,
  onSearchChange,
  openCategoryId,
  onToggleCategory,
  openCourseId,
  onToggleCourse,
  selectedLessonId,
  onSelectLesson,
}: ProductCoursesSidebarProps) {
  return (
    <aside className="lg:col-span-4 space-y-4">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-lila-600 to-lila-700 p-6">
          <h2 className="text-xl font-bold text-white mb-2">Produkt-Kurse</h2>
          <p className="text-lila-100 text-sm">
            {totalPublishedLessons} veröffentlichte Lektionen
          </p>
        </div>

        <div className="p-4 border-b">
          <input
            type="text"
            placeholder="Kurse durchsuchen…"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-lila-500 focus:outline-none"
          />
        </div>

        <div className="max-h-[calc(100vh-300px)] overflow-y-auto py-3">
          {categories.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Keine veröffentlichten Kurse
            </div>
          ) : (
            <ProductCoursesCategoryTree
              categories={categories}
              openCategoryId={openCategoryId}
              onToggleCategory={onToggleCategory}
              openCourseId={openCourseId}
              onToggleCourse={onToggleCourse}
              selectedLessonId={selectedLessonId}
              onSelectLesson={onSelectLesson}
            />
          )}
        </div>
      </div>
    </aside>
  );
}