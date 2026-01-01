import type { Lesson } from "../types/lesson";

declare global {
  interface Window {
    __CONFIG__?: {
      API_BASE_URL?: string;
    };
  }
}

const API_BASE = window.__CONFIG__?.API_BASE_URL;

if (!API_BASE) {
  throw new Error("API base URL is not configured");
}
const API = `${API_BASE}/api/lessons`;

export async function getLessons(): Promise<Lesson[]> {
  const res = await fetch(API);
  if (!res.ok) {
    throw new Error(`Failed to load lessons (${res.status})`);
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
  const res = await fetch(`${API}/${id}`, { method: "DELETE" });
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