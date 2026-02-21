import type { FileDocument } from "./FileDocument";
export type Lesson = {
  id: string;
  title: string;
  content: string;
  videoGuid?: string | null;
  videoLibraryId?: string | null;
  videoUrl?: string | null;
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
  videoFile?: File | null;
  documents?: File[];
};

export type UpdateLessonRequest = {
  title?: string;
  content?: string;
  videoFile?: File | null;
  documents?: File[];
};

export type DisplayLessonType = {
  id: string;
  title: string;
  content?: string | null;
  videoLibraryId?: string | null;
  videoGuid?: string | null;
  fileDocuments?: FileDocument[];
};