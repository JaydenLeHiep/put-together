import type {
  Course,
  CourseWithLessons,
  CreateCourseRequest,
  UpdateCourseRequest,
  CategoryWithPaidCourses,
  PublicCategoryCatalog
} from "../types/course";
import { getApiBaseUrl } from "../config/runtimeConfig";
import { apiFetch } from "../hooks/useApi";

const API = `${getApiBaseUrl()}/api/courses`;

// =====================================================
// GET /api/courses
// =====================================================
export async function getAllCourses(): Promise<Course[]> {
  const res = await apiFetch(API, { method: "GET" });

  if (!res.ok) {
    throw new Error(`Failed to load courses (${res.status})`);
  }

  return res.json();
}

// =====================================================
// GET /api/courses/{id}
// =====================================================
export async function getCourseById(id: string): Promise<Course> {
  const res = await apiFetch(`${API}/${id}`, { method: "GET" });

  if (!res.ok) {
    throw new Error("Course not found");
  }

  return res.json();
}

// =====================================================
// GET /api/courses/{id}/lessons
// =====================================================
export async function getCourseWithLessons(
  id: string
): Promise<CourseWithLessons> {
  const res = await apiFetch(`${API}/${id}/lessons`, { method: "GET" });

  if (!res.ok) {
    throw new Error("Course not found");
  }

  return res.json();
}

// =====================================================
// GET /api/courses/student-paid-category-course
// =====================================================
export async function getStudentPaidCategoryCourses(): Promise<CategoryWithPaidCourses[]> {
  const res = await apiFetch(`${API}/student-paid-category-course`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Failed to load paid student courses");
  }

  return res.json();
}

// =====================================================
// POST /api/courses
// =====================================================
export async function createCourse(
  request: CreateCourseRequest
): Promise<{ id: string }> {
  const res = await apiFetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to create course");
  }

  return res.json();
}

// =====================================================
// PUT /api/courses/{id}
// =====================================================
export async function updateCourse(
  id: string,
  request: UpdateCourseRequest
): Promise<void> {
  const res = await apiFetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to update course");
  }
}

// =====================================================
// DELETE /api/courses/{id}
// =====================================================
export async function deleteCourse(id: string): Promise<void> {
  const res = await apiFetch(`${API}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to delete course");
  }
}

// =====================================================
// POST /api/courses/{id}/publish
// =====================================================
export async function publishCourse(id: string): Promise<void> {
  const res = await apiFetch(`${API}/${id}/publish`, {
    method: "POST",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to publish course");
  }
}

// =====================================================
// POST /api/courses/{id}/unpublish
// =====================================================
export async function unpublishCourse(id: string): Promise<void> {
  const res = await apiFetch(`${API}/${id}/unpublish`, {
    method: "POST",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to unpublish course");
  }
}

export async function getPublicCourseCatalog(): Promise<PublicCategoryCatalog[]> {
  const res = await apiFetch(`${API}/public-catalog`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Failed to load public course catalog");
  }

  return res.json();
}