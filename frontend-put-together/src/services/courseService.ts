import type {
  Course,
  CourseWithLessons,
  CreateCourseRequest,
  UpdateCourseRequest,
} from "../types/Course";
import { getApiBaseUrl } from "../config/runtimeConfig";
import { apiFetch } from "../hooks/useApi";

const API = `${getApiBaseUrl()}/api/courses`;

// =====================================================
// GET /api/courses (Admin / Teacher)
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
// POST /api/courses (Admin only)
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
// PUT /api/courses/{id} (Admin only)
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
    throw new Error("Failed to update course");
  }
}

// =====================================================
// DELETE /api/courses/{id} (Admin only)
// =====================================================
export async function deleteCourse(id: string): Promise<void> {
  const res = await apiFetch(`${API}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete course");
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
    throw new Error("Failed to publish course");
  }
}

// =====================================================
// POST /api/courses/{id}/unpublish (if exists)
// =====================================================
export async function unpublishCourse(id: string): Promise<void> {
  const res = await apiFetch(`${API}/${id}/unpublish`, {
    method: "POST",
  });

  if (!res.ok) {
    throw new Error("Failed to unpublish course");
  }
}