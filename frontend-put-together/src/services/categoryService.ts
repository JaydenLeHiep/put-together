import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "../types/category";
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
// POST /api/categories
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
// PUT /api/categories/{id}
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
    const text = await res.text();
    throw new Error(text || "Failed to update category");
  }
}

// =====================================================
// DELETE /api/categories/{id}
// =====================================================
export async function deleteCategory(id: string): Promise<void> {
  const res = await apiFetch(`${API}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to delete category");
  }
}