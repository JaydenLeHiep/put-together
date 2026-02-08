export type Lesson = {
  id: string;
  title: string;
  content: string;
  videoGuid: string;
  videoLibraryId: string;
  videoUrl: string;
  courseId: string;
  isPublished: boolean;
  createdById: string;
  createdAt: string;
  publishedAt: string | null;
};

export type CreateLessonRequest = {
  title: string;
  content?: string;
  courseId: string;
  file: File;
};

export type UpdateLessonRequest = {
  title?: string;
  content?: string;
  file?: File | null;
  videoLibraryId?: string;
};

