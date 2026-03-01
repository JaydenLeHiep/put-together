import { getApiBaseUrl } from "../config/runtimeConfig";
import { apiFetch } from "../hooks/useApi";
import type { FileDocument, FileUrl } from "../components/displayComponents/lessonFileDocuments/typeDisplayFileDocuments";

const API = `${getApiBaseUrl()}/api/storages/lessons`;

export async function getFileDocumentsByLessonId(id: string): Promise<FileDocument[]> {
    const res = await apiFetch(`${API}/${id}/files`, { method: "GET" });

    if (!res.ok) {
        throw new Error(`Failed to load file documents (${res.status})`);
    }

    return res.json();
}

export async function downloadFileDocumentsByFileIdAndLessonId(fileId: string, lessonId: string): Promise<FileUrl> {
    const res = await apiFetch(`${API}/${lessonId}/files/${fileId}/download`, { method: "GET" });

    if (!res.ok) {
        throw new Error(`Failed to load file documents (${res.status})`);
    }

    return res.json();
}