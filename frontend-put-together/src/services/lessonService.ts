import type { Lesson } from "../types/lesson";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

console.info("[LessonService] Loaded");
console.info(
  "[LessonService] VITE_API_BASE_URL =",
  import.meta.env.VITE_API_BASE_URL
);

if (!API_BASE) {
  throw new Error("VITE_API_BASE_URL is not defined");
}

const API = `${API_BASE}/api/lessons`;

export async function getLessons(): Promise<Lesson[]> {
  console.info("[LessonService] getLessons() called");
  console.info("[LessonService] Fetch URL:", API);

  const res = await fetch(API);

  console.info("[LessonService] Response status:", res.status);
  console.info("[LessonService] Response headers:", [...res.headers.entries()]);

  const text = await res.text();
  console.info("[LessonService] Raw response body:", text);

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Response is not valid JSON");
  }
}
export async function getLessonById(id: string): Promise<Lesson> {
  const res = await fetch(`${API}/${id}`);
  if (!res.ok) throw new Error("Lesson not found");
  return res.json();
}

export async function deleteLesson(id: string): Promise<void> {
  const res = await fetch(`${API}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Delete failed");
}

export async function createLesson(form: FormData): Promise<void> {
  const res = await fetch(API, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error("Upload fehlgeschlagen");
}