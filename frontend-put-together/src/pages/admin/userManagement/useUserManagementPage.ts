import { useEffect, useMemo, useState } from "react";
import type { UserReadDto } from "../../../types/user";
import {
  getAllUsers,
  getUserById,
  type UserDetailsDto,
} from "../../../services/userService";
import type { Course } from "../../../types/course";
import { getAllCourses } from "../../../services/courseService";
import {
  grantCourseAccess,
  revokeCourseAccess,
  getStudentCourseAccess,
} from "../../../services/accessService";

export type RoleFilter = "All" | string;
type CourseId = Course["id"];

function normalizeRole(value?: string | null) {
  return (value ?? "").trim().toLowerCase();
}

export function formatDate(value: string | null | undefined) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString("de-AT");
}

export function rolePillClass(roleName?: string) {
  const r = normalizeRole(roleName);
  if (r === "admin") return "bg-red-100 text-red-700";
  if (r === "teacher") return "bg-blue-100 text-blue-700";
  if (r === "student") return "bg-green-100 text-green-700";
  return "bg-gray-100 text-gray-700";
}

export function useUserManagementPage() {
  const [users, setUsers] = useState<UserReadDto[]>([]);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState<UserReadDto | null>(null);

  const [details, setDetails] = useState<UserDetailsDto | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("All");
  const [error, setError] = useState<string | null>(null);

  const [actionBusy, setActionBusy] = useState(false);
  const [roleDraft, setRoleDraft] = useState<"Student" | "Teacher">("Student");

  const [pwDraft, setPwDraft] = useState("");
  const [pwRepeat, setPwRepeat] = useState("");
  const [showPwNew, setShowPwNew] = useState(false);
  const [showPwRepeat, setShowPwRepeat] = useState(false);

  const [accessModalOpen, setAccessModalOpen] = useState(false);
  const [accessMode, setAccessMode] = useState<"grant" | "revoke">("grant");

  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [activeCourses, setActiveCourses] = useState<Course[]>([]);
  const [accessLoading, setAccessLoading] = useState(false);
  const [accessBusy, setAccessBusy] = useState(false);
  const [accessError, setAccessError] = useState<string | null>(null);

  const [courseQuery, setCourseQuery] = useState("");

  const [checkedCourseIds, setCheckedCourseIds] = useState<Set<CourseId>>(
    () => new Set<CourseId>()
  );

  const availableRoles = useMemo(() => {
    const roles = Array.from(
      new Set(users.map((u) => (u.roleName ?? "").trim()).filter(Boolean))
    );
    roles.sort((a, b) =>
      a === "Admin" ? -1 : b === "Admin" ? 1 : a.localeCompare(b)
    );
    return roles;
  }, [users]);

  async function loadUsers(keepSelection = true) {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllUsers();
      setUsers(data);

      if (keepSelection && selected) {
        const stillExists = data.find((u) => u.id === selected.id) ?? null;
        setSelected(stillExists);
      } else if (!keepSelection) {
        setSelected(null);
      }
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Benutzer konnten nicht geladen werden."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllUsers();
        if (!cancelled) {
          setUsers(data);
          setSelected(null);
        }
      } catch (e) {
        if (!cancelled) {
          setError(
            e instanceof Error
              ? e.message
              : "Benutzer konnten nicht geladen werden."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const id = selected?.id;
    if (!id) {
      setDetails(null);
      setLoadingDetails(false);
      return;
    }

    let cancelled = false;

    async function loadDetail(userId: string) {
      setLoadingDetails(true);
      setError(null);
      try {
        const d = await getUserById(userId);
        if (!cancelled) {
          setDetails(d);
          setRoleDraft(d.roleName === "Teacher" ? "Teacher" : "Student");
          setPwDraft("");
          setPwRepeat("");
          setShowPwNew(false);
          setShowPwRepeat(false);
        }
      } catch (e) {
        if (!cancelled) {
          setError(
            e instanceof Error
              ? e.message
              : "Benutzerdetails konnten nicht geladen werden."
          );
        }
      } finally {
        if (!cancelled) setLoadingDetails(false);
      }
    }

    loadDetail(id);
    return () => {
      cancelled = true;
    };
  }, [selected?.id]);

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();

    return users
      .filter((u) => {
        if (
          roleFilter !== "All" &&
          normalizeRole(u.roleName) !== normalizeRole(roleFilter)
        ) {
          return false;
        }

        if (!q) return true;

        const inUserName = (u.userName ?? "").toLowerCase().includes(q);
        const inEmail = (u.email ?? "").toLowerCase().includes(q);
        const inRole = (u.roleName ?? "").toLowerCase().includes(q);

        return inUserName || inEmail || inRole;
      })
      .sort((a, b) => {
        const da = new Date(a.createdAt).getTime();
        const db = new Date(b.createdAt).getTime();
        if (!Number.isFinite(da) || !Number.isFinite(db)) return 0;
        return db - da;
      });
  }, [users, search, roleFilter]);

  const stats = useMemo(() => {
    const total = users.length;
    const admins = users.filter((u) => normalizeRole(u.roleName) === "admin").length;
    const teachers = users.filter((u) => normalizeRole(u.roleName) === "teacher").length;
    const students = users.filter((u) => normalizeRole(u.roleName) === "student").length;
    return { total, admins, teachers, students };
  }, [users]);

  const selectedInitial = useMemo(
    () => (selected?.userName?.[0] ?? "?").toUpperCase(),
    [selected?.userName]
  );

  const targetRole = details?.roleName ?? selected?.roleName ?? "";
  const targetRoleNorm = normalizeRole(targetRole);

  const isTargetAdmin = targetRoleNorm === "admin";
  const isTargetStudent = targetRoleNorm === "student";
  const isActive = details?.isActive ?? true;

  async function runAction(fn: () => Promise<void>) {
    setActionBusy(true);
    setError(null);
    try {
      await fn();
      await loadUsers(true);

      if (selected?.id) {
        const d = await getUserById(selected.id);
        setDetails(d);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Aktion fehlgeschlagen.");
    } finally {
      setActionBusy(false);
    }
  }

  const pwTrim = pwDraft.trim();
  const pwRepeatTrim = pwRepeat.trim();

  const pwTooShort =
    (pwTrim.length > 0 && pwTrim.length < 8) ||
    (pwRepeatTrim.length > 0 && pwRepeatTrim.length < 8);

  const pwMismatch =
    pwTrim.length > 0 && pwRepeatTrim.length > 0 && pwTrim !== pwRepeatTrim;

  const canResetPw =
    !loadingDetails &&
    !actionBusy &&
    pwTrim.length >= 8 &&
    pwRepeatTrim.length >= 8 &&
    pwTrim === pwRepeatTrim;

  const activeCourseIdSet = useMemo(
    () => new Set<CourseId>(activeCourses.map((c) => c.id)),
    [activeCourses]
  );

  const grantList = useMemo(() => {
    const q = courseQuery.trim().toLowerCase();

    return allCourses
      .filter((c) => {
        if (!q) return true;
        return (
          (c.title ?? "").toLowerCase().includes(q) ||
          (c.level ?? "").toLowerCase().includes(q)
        );
      })
      .sort((a, b) => (a.title ?? "").localeCompare(b.title ?? ""));
  }, [allCourses, courseQuery]);

  const revokeList = useMemo(() => {
    const q = courseQuery.trim().toLowerCase();
    return activeCourses
      .filter((c) => {
        if (!q) return true;
        return (
          (c.title ?? "").toLowerCase().includes(q) ||
          (c.level ?? "").toLowerCase().includes(q)
        );
      })
      .sort((a, b) => (a.title ?? "").localeCompare(b.title ?? ""));
  }, [activeCourses, courseQuery]);

  const visibleList = accessMode === "grant" ? grantList : revokeList;

  function toggleChecked(courseId: CourseId) {
    setCheckedCourseIds((prev) => {
      const next = new Set(prev);
      if (next.has(courseId)) next.delete(courseId);
      else next.add(courseId);
      return next;
    });
  }

  const activeVisibleCount = useMemo(() => {
    if (accessMode !== "grant") return 0;
    return visibleList.filter((c) => activeCourseIdSet.has(c.id)).length;
  }, [accessMode, visibleList, activeCourseIdSet]);

  const actionableSelectedCount = useMemo(() => {
    if (accessMode === "grant") {
      return Array.from(checkedCourseIds).filter((id) => !activeCourseIdSet.has(id)).length;
    }

    return Array.from(checkedCourseIds).filter((id) => activeCourseIdSet.has(id)).length;
  }, [accessMode, checkedCourseIds, activeCourseIdSet]);

  async function submitAccessChanges() {
    if (!selected?.id) return;
    if (checkedCourseIds.size === 0) return;

    setAccessBusy(true);
    setAccessError(null);

    try {
      const ids = Array.from(checkedCourseIds);

      if (accessMode === "grant") {
        const toGrant = ids.filter((id) => !activeCourseIdSet.has(id));
        await Promise.all(
          toGrant.map((courseId) => grantCourseAccess(selected.id, courseId))
        );
      } else {
        const toRevoke = ids.filter((id) => activeCourseIdSet.has(id));
        await Promise.all(
          toRevoke.map((courseId) => revokeCourseAccess(selected.id, courseId))
        );
      }

      const refreshed = await getStudentCourseAccess(selected.id).catch(
        () => [] as Course[]
      );
      setActiveCourses(refreshed);
      setCheckedCourseIds(new Set<CourseId>());
    } catch (e) {
      setAccessError(e instanceof Error ? e.message : "Aktion fehlgeschlagen.");
    } finally {
      setAccessBusy(false);
    }
  }

  useEffect(() => {
    if (accessModalOpen && !isTargetStudent) {
      setAccessModalOpen(false);
    }
  }, [accessModalOpen, isTargetStudent]);

  function closeAccessModal() {
    setAccessModalOpen(false);
    setAccessError(null);
    setCourseQuery("");
    setCheckedCourseIds(new Set<CourseId>());
    setAccessMode("grant");
  }

  async function openAccessModal() {
    if (!selected?.id) return;
    if (!isTargetStudent) return;

    setAccessModalOpen(true);
    setAccessLoading(true);
    setAccessError(null);
    setCheckedCourseIds(new Set<CourseId>());

    try {
      const [courses, active] = await Promise.all([
        getAllCourses(),
        getStudentCourseAccess(selected.id).catch(() => [] as Course[]),
      ]);

      setAllCourses(courses);
      setActiveCourses(active);
    } catch (e) {
      setAccessError(
        e instanceof Error ? e.message : "Kursdaten konnten nicht geladen werden."
      );
    } finally {
      setAccessLoading(false);
    }
  }

  return {
    users,
    loading,
    selected,
    details,
    loadingDetails,
    search,
    roleFilter,
    error,
    actionBusy,
    roleDraft,
    pwDraft,
    pwRepeat,
    showPwNew,
    showPwRepeat,
    accessModalOpen,
    accessMode,
    allCourses,
    activeCourses,
    accessLoading,
    accessBusy,
    accessError,
    courseQuery,
    checkedCourseIds,
    availableRoles,
    filteredUsers,
    stats,
    selectedInitial,
    isTargetAdmin,
    isTargetStudent,
    isActive,
    pwTooShort,
    pwMismatch,
    canResetPw,
    activeCourseIdSet,
    visibleList,
    activeVisibleCount,
    actionableSelectedCount,

    setSelected,
    setSearch,
    setRoleFilter,
    setRoleDraft,
    setPwDraft,
    setPwRepeat,
    setShowPwNew,
    setShowPwRepeat,
    setAccessMode,
    setCourseQuery,
    setCheckedCourseIds,

    loadUsers,
    openAccessModal,
    closeAccessModal,
    toggleChecked,
    submitAccessChanges,
    runAction,

    setError,
    formatDate,
  };
}