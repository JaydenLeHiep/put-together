import type {
  Category,
  CategoryWithCourses,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "../types/Category";
import { getApiBaseUrl } from "../config/runtimeConfig";
import { apiFetch } from "../hooks/useApi";

const API = `${getApiBaseUrl()}/api/categories`;

// =====================================================
// GET /api/categories
// =====================================================
export async function getAllCategories(): Promise<Category[]> {
  const res = await apiFetch(API, { method: "GET" });

  if (!res.ok) {
    throw new Error(`Failed to load categories (${res.status})`);
  }

  return res.json();
}

// =====================================================
// GET /api/categories/{id}
// =====================================================
export async function getCategoryById(
  id: string
): Promise<Category> {
  const res = await apiFetch(`${API}/${id}`, { method: "GET" });

  if (!res.ok) {
    throw new Error("Category not found");
  }

  return res.json();
}

// =====================================================
// GET /api/categories/{id}/courses (OPTIONAL)
// Only add this if backend exposes it
// =====================================================
export async function getCategoryWithCourses(
  id: string
): Promise<CategoryWithCourses> {
  const res = await apiFetch(`${API}/${id}/courses`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Category not found");
  }

  return res.json();
}

// =====================================================
// POST /api/categories (Admin)
// =====================================================
export async function createCategory(
  request: CreateCategoryRequest
): Promise<{ id: string }> {
  const res = await apiFetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to create category");
  }

  return res.json();
}

// =====================================================
// PUT /api/categories/{id} (Admin)
// =====================================================
export async function updateCategory(
  id: string,
  request: UpdateCategoryRequest
): Promise<void> {
  const res = await apiFetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    throw new Error("Failed to update category");
  }
}

// =====================================================
// DELETE /api/categories/{id} (Admin)
// =====================================================
export async function deleteCategory(id: string): Promise<void> {
  const res = await apiFetch(`${API}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete category");
  }
}


