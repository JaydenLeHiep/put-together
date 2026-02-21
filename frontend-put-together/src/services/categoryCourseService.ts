import { getApiBaseUrl } from "../config/runtimeConfig";
import { apiFetch } from "../hooks/useApi";
import type { CategoryWithCourses } from "../components/displayComponents/category/typeDisplayCategory";

const API = `${getApiBaseUrl()}/api/courses/student-paid-category-course`;


export async function getCategoriesCourseForStudent(): Promise<CategoryWithCourses[]> {
    const res = await apiFetch(API, { method: "GET" });

    if (!res.ok) {
        throw new Error(`Failed to load categories (${res.status})`);
    }

    return res.json();
}