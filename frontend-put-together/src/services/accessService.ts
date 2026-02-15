import { getApiBaseUrl } from "../config/runtimeConfig";
import { apiFetch } from "../hooks/useApi";
import type { Course } from "../types/Course";

type CourseId = Course["id"];

const API = `${getApiBaseUrl()}/api/access`;

function buildUrl(path: string, params?: Record<string, string>) {
  if (!params || Object.keys(params).length === 0) return `${API}${path}`;
  const qs = new URLSearchParams(params).toString();
  return `${API}${path}?${qs}`;
}

async function requestVoid(url: string, method: "POST") {
  const res = await apiFetch(url, { method });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed (${res.status})`);
  }
}

async function requestJson<T>(url: string, method: "GET" | "POST" = "GET") {
  const res = await apiFetch(url, { method });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed (${res.status})`);
  }

  return (await res.json()) as T;
}

// POST /api/access/grant-course?studentId=...&courseId=...
export async function grantCourseAccess(studentId: string, courseId: CourseId) {
  const url = buildUrl("/grant-course", {
    studentId,
    courseId: String(courseId),
  });
  return requestVoid(url, "POST");
}

// POST /api/access/revoke-course?studentId=...&courseId=...
export async function revokeCourseAccess(studentId: string, courseId: CourseId) {
  const url = buildUrl("/revoke-course", {
    studentId,
    courseId: String(courseId),
  });
  return requestVoid(url, "POST");
}

// GET /api/access/course?studentId=...
export async function getStudentCourseAccess(studentId: string): Promise<Course[]> {
  const url = buildUrl("/course", { studentId });
  return requestJson<Course[]>(url, "GET");
}