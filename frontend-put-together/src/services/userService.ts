import type { RegisterPayload, LoginPayload, LoginInfo } from "../components/auth/typeAuth";
import type { UserReadDto } from "../types/User";
import { getApiBaseUrl } from "../config/runtimeConfig";
import { apiFetch } from "../hooks/useApi";

const API = `${getApiBaseUrl()}/api/users`;

export async function createUser(registerPayload: RegisterPayload): Promise<void> {
  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(registerPayload),
  });

  if (!res.ok) throw new Error("User register fehlgeschlagen.");
}

export async function loginUser(loginPayload: LoginPayload): Promise<LoginInfo> {
  const res = await fetch(`${API}/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginPayload),
  });

  if (!res.ok) throw new Error("User login fehlgeschlagen.");

  return res.json();
}

export async function createRefreshTokenUser(): Promise<LoginInfo> {
  const res = await fetch(`${API}/refresh`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error("User refresh fehlgeschlagen.");

  return res.json();
}

export async function logoutUser(): Promise<void> {
  const res = await fetch(`${API}/logout`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error("User logout fehlgeschlagen.");

  // backend returns 200 OK with no JSON body
  return;
}

// =========================
// ADMIN: list all accounts
// GET /api/users/all
// =========================

function mapUserReadDto(raw: any): UserReadDto {
  return {
    id: raw.id ?? raw.Id,
    userName: raw.userName ?? raw.UserName,
    email: raw.email ?? raw.Email,
    roleName: raw.roleName ?? raw.RoleName ?? raw.role ?? raw.Role, 
    createdAt: raw.createdAt ?? raw.CreatedAt,
  };
}

export async function getAllUsers(): Promise<UserReadDto[]> {
  const res = await apiFetch(`${API}/all`, { method: "GET" });
  if (!res.ok) throw new Error("Load users fehlgeschlagen.");

  const data = await res.json();
  return Array.isArray(data) ? data.map(mapUserReadDto) : [];
}

// =========================
// ADMIN: get user details
// GET /api/users/{id}
// =========================
export type UserDetailsDto = {
  id: string;
  userName: string;
  email: string;
  roleName: string;
  createdAt: string;
  deletedAt: string | null;
  isActive: boolean;
};

export async function getUserById(id: string): Promise<UserDetailsDto> {
  const res = await apiFetch(`${API}/${id}`, { method: "GET" });

  if (!res.ok) throw new Error("Load user details fehlgeschlagen.");

  return res.json();
}

// =========================
// ADMIN: update role (Student <-> Teacher only)
// PATCH /api/users/{id}/role
// body: { role: "Student" | "Teacher" }
// =========================
export async function updateUserRole(
  id: string,
  role: "Student" | "Teacher"
): Promise<void> {
  const res = await apiFetch(`${API}/${id}/role`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role }),
  });

  if (!res.ok) throw new Error("Update role fehlgeschlagen.");
}

// =========================
// ADMIN: deactivate user (soft delete)
// PATCH /api/users/{id}/deactivate
// =========================
export async function deactivateUser(id: string): Promise<void> {
  const res = await apiFetch(`${API}/${id}/deactivate`, { method: "PATCH" });

  // backend might return 403 if target is Admin (good)
  if (!res.ok) throw new Error("Deactivate user fehlgeschlagen.");
}

// =========================
// ADMIN: activate user
// PATCH /api/users/{id}/activate
// =========================
export async function activateUser(id: string): Promise<void> {
  const res = await apiFetch(`${API}/${id}/activate`, { method: "PATCH" });

  if (!res.ok) throw new Error("Activate user fehlgeschlagen.");
}

// =========================
// ADMIN: reset password
// POST /api/users/{id}/reset-password
// body: { newPassword: string }
// =========================
export async function resetUserPassword(
  id: string,
  newPassword: string
): Promise<void> {
  const res = await apiFetch(`${API}/${id}/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ newPassword }),
  });

  if (!res.ok) throw new Error("Reset password fehlgeschlagen.");
}

// =========================
// ADMIN: list users by role (optional)
// GET /api/users/role/{role}
// =========================
export async function getUsersByRole(role: string): Promise<UserReadDto[]> {
  const res = await apiFetch(`${API}/role/${encodeURIComponent(role)}`, {
    method: "GET",
  });

  if (!res.ok) throw new Error("Load users by role fehlgeschlagen.");

  return res.json();
}