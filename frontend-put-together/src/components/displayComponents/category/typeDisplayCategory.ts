import type { DisplayLessonType } from "../../../types/lesson";
import type { StudentPaidCourse } from "../../../types/course";

export type CategoryWithCourses = {
  categoryId: string;
  categoryName: string;
  courses: StudentPaidCourse[];
};

export type DisplayCategoryCourseProps = {
  categoriesWithCourses: CategoryWithCourses[];
  openCategoryId: string | null;
  onToggleCategory: (id: string | null) => void;
  openCourseId: string | null;
  onToggleCourse: (id: string | null) => void;
  onSelectLesson: (lesson: DisplayLessonType) => void;
};