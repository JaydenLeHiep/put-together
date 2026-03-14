export type Course = {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  level: string; // A1, A2, B1, B2
  bunnyCollectionId: string;
  price: number | null;
  isPublished: boolean;
  lessonCount: number;
  createdAt: string;
};

export type CourseWithLessons = {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  level: string;
  price?: number;
  isPublished: boolean;
  lessons: LessonInCourse[];
};

export type LessonInCourse = {
  id: string;
  title: string;
  content: string;
  videoLibraryId: string;
  videoGuid: string;
  videoUrl: string;
  thumbnailUrl: string;
  courseId: string;
  isPublished: boolean;
  userId: string;
  createdAt: string;
  publishedAt: string | null;
};

export type CreateCourseRequest = {
  categoryId: string;
  title: string;
  description: string;
  level: string;
  price: number | null;
};

export type UpdateCourseRequest = {
  title?: string;
  description?: string;
  level?: string;
  price?: number | null;
  isPublished?: boolean;
};

export type DisplayCourse = {
  courseId: string,
  title: string,
  expiresAtUtc: string
}

export type StudentPaidCourse = {
  courseId: string;
  title: string;
  expiresAtUtc: string;
};

export type CategoryWithPaidCourses = {
  categoryId: string;
  categoryName: string;
  courses: StudentPaidCourse[];
};

export type PublicLessonPreview = {
  id: string;
  title: string;
  content: string;
  thumbnailUrl: string;
};

export type PublicCourseCard = {
  id: string;
  title: string;
  description: string;
  level: string;
  price: number | null;
  publishedLessonCount: number;
  courseThumbnailUrl: string | null;
  lessons: PublicLessonPreview[];
};

export type PublicCategoryCatalog = {
  categoryId: string;
  categoryName: string;
  categoryDescription: string | null;
  courses: PublicCourseCard[];
};