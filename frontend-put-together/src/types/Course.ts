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
  courseId: string;
  isPublished: boolean;
  createdById: string;
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