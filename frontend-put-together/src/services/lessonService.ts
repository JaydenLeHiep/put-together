import type {Lesson} from "../types/lesson";

const API = "http://localhost:8080/api/lessons";

export async function getLessons(): Promise<Lesson[]> {
    const res = await fetch(API);
    if (!res.ok) throw new Error("Failed to load lessons");
    return res.json();
}

export async function getLessonById(id: string): Promise<Lesson> {
    const res = await fetch(`${API}/${id}`);
    if (!res.ok) throw new Error("Lesson not found");
    return res.json();
}

export async function deleteLesson(id: string): Promise<void> {
    const res = await fetch(`${API}/${id}`, {method: "DELETE"});
    if (!res.ok) throw new Error("Delete failed");
}

export async function createLesson(form: FormData): Promise<void> {
    const res = await fetch("http://localhost:8080/api/lessons", {
        method: "POST",
        body: form,
    });

    if (!res.ok) {
        throw new Error("Upload fehlgeschlagen");
    }
}