import type { Course } from "./Course";

export type Category = {
  id: string;
  name: string;
  description?: string;
  bunnyLibraryId: string;
  createdAt: string;
  courseCount: number;
};

export type CreateCategoryRequest = {
  name: string;
  description?: string;
};

export type UpdateCategoryRequest = {
  name: string;
  description?: string;
};

export type CategoryWithCourses = {
  id: string;
  name: string;
  courses: Course[];
};