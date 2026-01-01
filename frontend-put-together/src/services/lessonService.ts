import type { Lesson } from "../types/lesson";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE) {
  throw new Error("VITE_API_BASE_URL is not defined");
}

const API = `${API_BASE}/api/lessons`;

export async function getLessons(): Promise<Lesson[]> {
  const res = await fetch(API);
  if (!res.ok) {
    throw new Error(`Failed to load lessons (HTTP ${res.status})`);
  }
  return res.json();
}

export async function getLessonById(id: string): Promise<Lesson> {
  const res = await fetch(`${API}/${id}`);
  if (!res.ok) {
    throw new Error("Lesson not found");
  }
  return res.json();
}

export async function deleteLesson(id: string): Promise<void> {
  const res = await fetch(`${API}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Delete failed");
  }
}

export async function createLesson(form: FormData): Promise<void> {
  const res = await fetch(API, {
    method: "POST",
    body: form,
  });
  if (!res.ok) {
    throw new Error("Upload fehlgeschlagen");
  }
}