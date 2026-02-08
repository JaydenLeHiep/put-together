import { getApiBaseUrl } from "../config/runtimeConfig";
import { apiFetch } from "../hooks/useApi";

const API = `${getApiBaseUrl()}/api/access`;

// POST /api/access/lesson (Admin only)
export async function grantLessonAccess(
  studentId: string,
  lessonId: string
): Promise<void> {
  const res = await apiFetch(
    `${API}/lesson?studentId=${studentId}&lessonId=${lessonId}`,
    {
      method: "POST",
    }
  );
  if (!res.ok) {
    throw new Error("Failed to grant lesson access");
  }
}

// POST /api/access/course (Admin only)
export async function grantCourseAccess(
  studentId: string,
  courseId: string
): Promise<void> {
  const res = await apiFetch(
    `${API}/course?studentId=${studentId}&courseId=${courseId}`,
    {
      method: "POST",
    }
  );
  if (!res.ok) {
    throw new Error("Failed to grant course access");
  }
}

// DELETE /api/access/lesson (Admin only)
export async function revokeLessonAccess(
  studentId: string,
  lessonId: string
): Promise<void> {
  const res = await apiFetch(
    `${API}/lesson?studentId=${studentId}&lessonId=${lessonId}`,
    {
      method: "DELETE",
    }
  );
  if (!res.ok) {
    throw new Error("Failed to revoke lesson access");
  }
}
