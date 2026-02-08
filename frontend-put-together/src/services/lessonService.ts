import type {
  Lesson,
} from "../types/Lesson";
import type {
  LessonComment,
  CreateLessonCommentRequest,
} from "../types/LessonComment";
import { getApiBaseUrl } from "../config/runtimeConfig";
import { apiFetch } from "../hooks/useApi";

const API = `${getApiBaseUrl()}/api/lessons`;

// =====================================================
// GET /api/lessons/{id}
// =====================================================
export async function getLessonById(id: string): Promise<Lesson> {
  const res = await apiFetch(`${API}/${id}`, { method: "GET" });

  if (!res.ok) {
    throw new Error("Lesson not found");
  }

  return res.json();
}

// =====================================================
// POST /api/lessons (multipart/form-data)
// =====================================================
export async function createLesson(form: FormData): Promise<void> {
  const res = await apiFetch(API, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Upload failed");
  }
}

// =====================================================
// PUT /api/lessons/{id} (multipart/form-data)
// =====================================================
export async function updateLesson(
  id: string,
  form: FormData
): Promise<void> {
  const res = await apiFetch(`${API}/${id}`, {
    method: "PUT",
    body: form,
  });

  if (!res.ok) {
    throw new Error("Update failed");
  }
}

// =====================================================
// DELETE /api/lessons/{id}
// =====================================================
export async function deleteLesson(id: string): Promise<void> {
  const res = await apiFetch(`${API}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Delete failed");
  }
}

// =====================================================
// POST /api/lessons/{id}/restore
// =====================================================
export async function restoreLesson(id: string): Promise<void> {
  const res = await apiFetch(`${API}/${id}/restore`, {
    method: "POST",
  });

  if (!res.ok) {
    throw new Error("Restore failed");
  }
}

// =====================================================
// POST /api/lessons/{id}/publish
// =====================================================
export async function publishLesson(id: string): Promise<void> {
  const res = await apiFetch(`${API}/${id}/publish`, {
    method: "POST",
  });

  if (!res.ok) {
    throw new Error("Failed to publish lesson");
  }
}

// =====================================================
// POST /api/lessons/{id}/unpublish
// =====================================================
export async function unpublishLesson(id: string): Promise<void> {
  const res = await apiFetch(`${API}/${id}/unpublish`, {
    method: "POST",
  });

  if (!res.ok) {
    throw new Error("Failed to unpublish lesson");
  }
}

// =====================================================
// COMMENTS
// =====================================================
export async function getLessonComments(
  id: string
): Promise<LessonComment[]> {
  const res = await apiFetch(`${API}/${id}/comments`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Failed to load comments");
  }

  return res.json();
}

export async function addLessonComment(
  id: string,
  request: CreateLessonCommentRequest
): Promise<void> {
  const res = await apiFetch(`${API}/${id}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    throw new Error("Failed to add comment");
  }
}

export async function getPublishedLessons(): Promise<Lesson[]> {
  const res = await apiFetch(`${API}/published`, { method: "GET" });

  if (!res.ok) {
    throw new Error(`Failed to load published lessons (${res.status})`);
  }

  return res.json();
}