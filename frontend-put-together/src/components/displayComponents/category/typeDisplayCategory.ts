import type { DisplayLessonType } from "../../../types/Lesson";
import type { DisplayCourse } from "../../../types/Course";

export type CategoryWithCourses = {
    categoryId: string;
    categoryName: string;
    courses: DisplayCourse[];
};

export type DisplayCategoryCourseProps = {
    categoriesWithCourses: CategoryWithCourses[];
    openCategoryId: string | null;
    onToggleCategory: (id: string | null) => void;
    openCourseId: string | null;
    onToggleCourse: (id: string | null) => void;
    selectedLesson: DisplayLessonType | null;
    onSelectLesson: (lesson: DisplayLessonType) => void;
};



