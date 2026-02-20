
export type Course = {
    courseId: string;
    title: string;
    expiresAtUtc: string;
};

export type CategoryWithCourses = {
    categoryId: string;
    categoryName: string;
    courses: Course[];
};

export type DisplayCategoryCourseProps = {
    categories: CategoryWithCourses[];
    openCategoryId: string | null;
    onToggleCategory: (id: string | null) => void;
    openCourseId: string | null;
    onToggleCourse: (id: string | null) => void;
};
