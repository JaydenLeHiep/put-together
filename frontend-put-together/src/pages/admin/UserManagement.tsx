import { useEffect, useMemo, useState } from "react";
import type { UserReadDto } from "../../types/User";
import {
  activateUser,
  deactivateUser,
  getAllUsers,
  getUserById,
  resetUserPassword,
  updateUserRole,
  type UserDetailsDto,
} from "../../services/userService";
import type { Course } from "../../types/Course";
import { getAllCourses } from "../../services/courseService";
import {
  grantCourseAccess,
  revokeCourseAccess,
  getStudentCourseAccess,
} from "../../services/accessService";

type RoleFilter = "All" | string;

function formatDate(value: string | null | undefined) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString("de-AT");
}

function normalizeRole(value?: string | null) {
  return (value ?? "").trim().toLowerCase();
}

function rolePillClass(roleName?: string) {
  const r = normalizeRole(roleName);
  if (r === "admin") return "bg-red-100 text-red-700";
  if (r === "teacher") return "bg-blue-100 text-blue-700";
  if (r === "student") return "bg-green-100 text-green-700";
  return "bg-gray-100 text-gray-700";
}

type CourseId = Course["id"];

export default function UserManagement() {
  const [users, setUsers] = useState<UserReadDto[]>([]);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState<UserReadDto | null>(null);

  // details
  const [details, setDetails] = useState<UserDetailsDto | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // ui
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("All");
  const [error, setError] = useState<string | null>(null);

  // actions state
  const [actionBusy, setActionBusy] = useState(false);
  const [roleDraft, setRoleDraft] = useState<"Student" | "Teacher">("Student");

  // reset password (new + repeat)
  const [pwDraft, setPwDraft] = useState("");
  const [pwRepeat, setPwRepeat] = useState("");
  const [showPwNew, setShowPwNew] = useState(false);
  const [showPwRepeat, setShowPwRepeat] = useState(false);

  // access modal
  const [accessModalOpen, setAccessModalOpen] = useState(false);
  const [accessMode, setAccessMode] = useState<"grant" | "revoke">("grant");

  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [activeCourses, setActiveCourses] = useState<Course[]>([]); // student currently has access
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

  // initial load
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
        if (!cancelled)
          setError(
            e instanceof Error
              ? e.message
              : "Benutzer konnten nicht geladen werden."
          );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // load details when selection changes
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

          // prepare role draft (only Student/Teacher are editable anyway)
          if (d.roleName === "Teacher") setRoleDraft("Teacher");
          else setRoleDraft("Student");

          // reset password fields when changing user
          setPwDraft("");
          setPwRepeat("");
          setShowPwNew(false);
          setShowPwRepeat(false);
        }
      } catch (e) {
        if (!cancelled)
          setError(
            e instanceof Error
              ? e.message
              : "Benutzerdetails konnten nicht geladen werden."
          );
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
    const admins = users.filter((u) => normalizeRole(u.roleName) === "admin")
      .length;
    const teachers = users.filter(
      (u) => normalizeRole(u.roleName) === "teacher"
    ).length;
    const students = users.filter(
      (u) => normalizeRole(u.roleName) === "student"
    ).length;
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

      // refresh list + refresh details
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
    // revoke: show active only
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

  async function submitAccessChanges() {
    if (!selected?.id) return;
    if (checkedCourseIds.size === 0) return;

    setAccessBusy(true);
    setAccessError(null);

    try {
      const ids = Array.from(checkedCourseIds);

      if (accessMode === "grant") {
        // only grant those NOT already active
        const toGrant = ids.filter((id) => !activeCourseIdSet.has(id));
        await Promise.all(toGrant.map((courseId) => grantCourseAccess(selected.id, courseId)));
      } else {
        // only revoke those that ARE active (safety)
        const toRevoke = ids.filter((id) => activeCourseIdSet.has(id));
        await Promise.all(toRevoke.map((courseId) => revokeCourseAccess(selected.id, courseId)));
      }

      // refetch newest state from DB
      const refreshed = await getStudentCourseAccess(selected.id).catch(() => [] as Course[]);
      setActiveCourses(refreshed);

      // clear selections
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

  const actionableSelectedCount = useMemo(() => {
    if (accessMode === "grant") {
      // only those selected that are NOT already active
      return Array.from(checkedCourseIds).filter((id) => !activeCourseIdSet.has(id)).length;
    }
    // revoke: only those selected that ARE active
    return Array.from(checkedCourseIds).filter((id) => activeCourseIdSet.has(id)).length;
  }, [accessMode, checkedCourseIds, activeCourseIdSet]);

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
        // Nếu backend chưa có GET này, nó sẽ throw -> mình catch và show message
        getStudentCourseAccess(selected.id).catch(() => [] as Course[]),
      ]);

      setAllCourses(courses);
      setActiveCourses(active);
    } catch (e) {
      setAccessError(e instanceof Error ? e.message : "Kursdaten konnten nicht geladen werden.");
    } finally {
      setAccessLoading(false);
    }
  }

  /* ===================== LOADING ===================== */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-lila-600" />
      </div>
    );
  }

  /* ===================== RENDER ===================== */
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* ===================== SIDEBAR ===================== */}
      <aside className="lg:col-span-4">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-lila-600 to-lila-700 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">
                  Benutzerverwaltung
                </h2>
                <p className="text-white/80 text-sm mt-1">
                  Admin: alle Konten anzeigen
                </p>
              </div>

              <button
                onClick={() => loadUsers(true)}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-150"
              >
                Neu laden
              </button>
            </div>

            {/* quick stats */}
            <div className="grid grid-cols-2 gap-3 mt-5">
              <Stat label="Gesamt" value={stats.total} />
              <Stat label="Admins" value={stats.admins} />
              <Stat label="Lehrer" value={stats.teachers} />
              <Stat label="Schüler" value={stats.students} />
            </div>
          </div>

          {/* controls */}
          <div className="p-4 border-b border-gray-100 space-y-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Suche: Benutzername, E-Mail, Rolle..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-lila-500 focus:border-transparent"
            />

            <div className="flex items-center gap-2 flex-wrap">
              <FilterPill
                active={roleFilter === "All"}
                onClick={() => setRoleFilter("All")}
                label="Alle"
              />

              {availableRoles.map((r) => (
                <FilterPill
                  key={r}
                  active={normalizeRole(roleFilter) === normalizeRole(r)}
                  onClick={() => setRoleFilter(r)}
                  label={r}
                />
              ))}
            </div>

            <p className="text-xs text-gray-500">
              {filteredUsers.length} / {users.length} angezeigt
            </p>

            {error && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-sm text-red-700">
                {error}
              </div>
            )}
          </div>

          {/* list */}
          <div className="divide-y divide-gray-100">
            {filteredUsers.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                Keine Benutzer gefunden.
              </div>
            ) : (
              filteredUsers.map((u) => {
                const active = selected?.id === u.id;
                const initial = (u.userName?.[0] ?? "?").toUpperCase();

                return (
                  <button
                    key={u.id}
                    onClick={() => setSelected(u)}
                    className={`w-full text-left px-5 py-4 transition-colors duration-150 ${active ? "bg-lila-50" : "hover:bg-gray-50"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lila-500 to-lila-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-sm">
                        {initial}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-semibold text-gray-900 truncate">
                            {u.userName}
                          </p>

                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${rolePillClass(
                              u.roleName
                            )}`}
                          >
                            {u.roleName}
                          </span>
                        </div>

                        <p className="text-sm text-gray-500 truncate mt-0.5">
                          {u.email}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </aside>

      {/* ===================== MAIN ===================== */}
      <section className="lg:col-span-8 space-y-6">
        {!selected ? (
          <EmptyState />
        ) : (
          <>
            {/* detail card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-lila-600 to-lila-700 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-white/15 text-white flex items-center justify-center font-bold text-xl shadow-sm">
                    {selectedInitial}
                  </div>

                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-white">
                      {selected.userName}
                    </h1>
                    <p className="text-white/80">{selected.email}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/15 text-white">
                      {loadingDetails
                        ? "Wird geladen..."
                        : details?.roleName ?? selected.roleName}
                    </span>

                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold ${isActive
                        ? "bg-green-500/20 text-white"
                        : "bg-yellow-500/20 text-white"
                        }`}
                      title={
                        details?.deletedAt
                          ? `Gelöscht am: ${formatDate(details.deletedAt)}`
                          : ""
                      }
                    >
                      {isActive ? "Aktiv" : "Inaktiv"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 border-b border-gray-100">
                {loadingDetails ? (
                  <div className="flex items-center justify-center py-6">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-lila-600" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoRow label="Benutzer-ID" value={selected.id} mono />
                    <InfoRow label="Erstellt am" value={formatDate(selected.createdAt)} />
                    <InfoRow
                      label="Rolle"
                      value={details?.roleName ?? selected.roleName}
                    />
                    <InfoRow
                      label="Gelöscht am"
                      value={formatDate(details?.deletedAt)}
                    />
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={async () => navigator.clipboard.writeText(selected.id)}
                    className="bg-gray-50 hover:bg-gray-100 text-gray-900 px-4 py-2.5 rounded-lg font-medium transition-colors duration-150 border border-gray-200 shadow-sm"
                  >
                    ID kopieren
                  </button>

                  <button
                    onClick={async () =>
                      navigator.clipboard.writeText(selected.email)
                    }
                    className="bg-gray-50 hover:bg-gray-100 text-gray-900 px-4 py-2.5 rounded-lg font-medium transition-colors duration-150 border border-gray-200 shadow-sm"
                  >
                    E-Mail kopieren
                  </button>
                  {isTargetStudent && (
                    <button
                      onClick={openAccessModal}
                      disabled={loadingDetails || actionBusy}
                      className="bg-lila-600 hover:bg-lila-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors duration-150 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Kurszugriff
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-xl font-bold text-gray-900">Aktionen</h3>
                <span className="text-sm text-gray-500">
                  (nur Schüler ↔ Lehrer)
                </span>
              </div>

              {isTargetAdmin && (
                <div className="mt-4 bg-yellow-50 border border-yellow-100 rounded-xl p-4 text-sm text-yellow-800">
                  Dieses Konto ist <b>Admin</b>. Rollenwechsel / Deaktivierung ist gesperrt.
                </div>
              )}

              <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* role */}
                <div className="lg:col-span-6 bg-gray-50 border border-gray-100 rounded-xl p-4">
                  <p className="text-sm font-bold text-gray-900 mb-2">
                    Rolle ändern
                  </p>

                  <div className="flex items-center gap-3">
                    <select
                      value={roleDraft}
                      onChange={(e) =>
                        setRoleDraft(e.target.value as "Student" | "Teacher")
                      }
                      disabled={loadingDetails || actionBusy || isTargetAdmin}
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-lila-500 disabled:opacity-50"
                    >
                      <option value="Student">Schüler</option>
                      <option value="Teacher">Lehrer</option>
                    </select>

                    <button
                      disabled={loadingDetails || actionBusy || isTargetAdmin}
                      onClick={() =>
                        runAction(async () => {
                          if (!selected?.id) return;
                          await updateUserRole(selected.id, roleDraft);
                        })
                      }
                      className="bg-lila-600 hover:bg-lila-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors duration-150 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Speichern
                    </button>
                  </div>

                  <p className="text-xs text-gray-500 mt-2">
                    Backend erlaubt nur Schüler/Lehrer.
                  </p>
                </div>

                {/* activate/deactivate */}
                <div className="lg:col-span-6 bg-gray-50 border border-gray-100 rounded-xl p-4">
                  <p className="text-sm font-bold text-gray-900 mb-2">
                    Kontostatus
                  </p>

                  <div className="flex items-center gap-3">
                    {isActive ? (
                      <button
                        disabled={loadingDetails || actionBusy || isTargetAdmin}
                        onClick={() =>
                          runAction(async () => {
                            if (!selected?.id) return;
                            await deactivateUser(selected.id);
                          })
                        }
                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors duration-150 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Deaktivieren
                      </button>
                    ) : (
                      <button
                        disabled={loadingDetails || actionBusy}
                        onClick={() =>
                          runAction(async () => {
                            if (!selected?.id) return;
                            await activateUser(selected.id);
                          })
                        }
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors duration-150 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Aktivieren
                      </button>
                    )}

                    <p className="text-sm text-gray-600">
                      Status:{" "}
                      <span className="font-semibold">
                        {isActive ? "Aktiv" : "Inaktiv"}
                      </span>
                    </p>
                  </div>

                  <p className="text-xs text-gray-500 mt-2">
                    Deaktivieren setzt „Gelöscht am“ (Soft Delete).
                  </p>
                </div>

                {/* reset password */}
                <div className="lg:col-span-12 bg-gray-50 border border-gray-100 rounded-xl p-4">
                  <p className="text-sm font-bold text-gray-900 mb-2">
                    Passwort zurücksetzen
                  </p>

                  <div className="flex flex-col gap-3">
                    {/* New password */}
                    <div className="flex items-center gap-2">
                      <input
                        value={pwDraft}
                        onChange={(e) => setPwDraft(e.target.value)}
                        type={showPwNew ? "text" : "password"}
                        placeholder="Neues Passwort (mind. 8 Zeichen)"
                        disabled={loadingDetails || actionBusy}
                        className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-lila-500 disabled:opacity-50"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPwNew((s) => !s)}
                        className="bg-white hover:bg-gray-100 text-gray-900 px-3 py-2.5 rounded-lg border border-gray-200 font-medium"
                      >
                        {showPwNew ? "Verbergen" : "Anzeigen"}
                      </button>
                    </div>

                    {/* Repeat password */}
                    <div className="flex items-center gap-2">
                      <input
                        value={pwRepeat}
                        onChange={(e) => setPwRepeat(e.target.value)}
                        type={showPwRepeat ? "text" : "password"}
                        placeholder="Passwort wiederholen"
                        disabled={loadingDetails || actionBusy}
                        className={`flex-1 border rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-lila-500 disabled:opacity-50 ${pwMismatch ? "border-red-300" : "border-gray-200"
                          }`}
                      />

                      <button
                        type="button"
                        onClick={() => setShowPwRepeat((s) => !s)}
                        className="bg-white hover:bg-gray-100 text-gray-900 px-3 py-2.5 rounded-lg border border-gray-200 font-medium"
                      >
                        {showPwRepeat ? "Verbergen" : "Anzeigen"}
                      </button>
                    </div>

                    {/* Reset button BELOW */}
                    <button
                      disabled={!canResetPw}
                      onClick={() =>
                        runAction(async () => {
                          if (!selected?.id) return;
                          await resetUserPassword(selected.id, pwTrim);
                          setPwDraft("");
                          setPwRepeat("");
                          setShowPwNew(false);
                          setShowPwRepeat(false);
                        })
                      }
                      className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors duration-150 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Zurücksetzen
                    </button>

                    {/* inline validation */}
                    {pwTooShort && (
                      <p className="text-xs text-red-700">
                        Das Passwort muss mindestens 8 Zeichen lang sein.
                      </p>
                    )}
                    {pwMismatch && (
                      <p className="text-xs text-red-700">
                        Die Passwörter stimmen nicht überein.
                      </p>
                    )}

                    <p className="text-xs text-gray-500">
                      Achtung: Das Passwort wird sofort neu gesetzt. (Kein E-Mail-Flow.)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </section>
      {/* ===================== COURSE ACCESS MODAL ===================== */}
      {accessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" onClick={closeAccessModal} />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Kurszugriff verwalten
                </h3>
                <p className="text-sm text-gray-500">
                  Benutzer:{" "}
                  <span className="font-semibold">{selected?.userName}</span> (
                  {selected?.email})
                </p>
              </div>

              <button
                onClick={closeAccessModal}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-lg font-medium"
              >
                Schließen
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              {!isTargetStudent && (
                <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-3 text-sm text-yellow-800">
                  Hinweis: Kurszugriff ist normalerweise für <b>Student</b>. Aktuelle
                  Rolle: <b>{details?.roleName ?? selected?.roleName}</b>
                </div>
              )}

              {/* Tabs */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setAccessMode("grant");
                    setCheckedCourseIds(new Set<CourseId>());
                    setCourseQuery("");
                  }}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${accessMode === "grant"
                    ? "bg-lila-600 text-white"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                >
                  Zugriff gewähren
                </button>

                <button
                  onClick={() => {
                    setAccessMode("revoke");
                    setCheckedCourseIds(new Set<CourseId>());
                    setCourseQuery("");
                  }}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${accessMode === "revoke"
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                >
                  Zugriff entziehen
                </button>
              </div>

              {/* Search */}
              <input
                value={courseQuery}
                onChange={(e) => setCourseQuery(e.target.value)}
                placeholder={
                  accessMode === "grant"
                    ? "Kurse suchen (Zugriff gewähren)..."
                    : "Kurse suchen (Zugriff entziehen)..."
                }
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-lila-500 focus:border-transparent"
              />

              {accessError && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-sm text-red-700">
                  {accessError}
                </div>
              )}

              {/* List */}
              <div className="border border-gray-100 rounded-xl overflow-hidden">
                {accessLoading ? (
                  <div className="p-6 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lila-600" />
                  </div>
                ) : visibleList.length === 0 ? (
                  <div className="p-6 text-sm text-gray-500">
                    {accessMode === "grant"
                      ? "Keine Kurse verfügbar (oder der Student hat bereits Zugriff auf alle)."
                      : "Keine Kurszugriffe gefunden."}

                    {accessMode === "revoke" && activeCourses.length === 0 && (
                      <div className="mt-2 text-xs text-gray-400">
                        (Wenn du erwartest hier etwas zu sehen: Backend braucht
                        vermutlich GET /api/access/course?studentId=...)
                      </div>
                    )}
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-100 max-h-[45vh] overflow-auto">
                    {visibleList.map((c) => {
                      const hasAccess = activeCourseIdSet.has(c.id);

                      // Grant tab: if already has access -> checked + disabled
                      // Revoke tab: list is already only active -> normal selectable
                      const checked =
                        accessMode === "grant"
                          ? (hasAccess || checkedCourseIds.has(c.id))
                          : checkedCourseIds.has(c.id);

                      const disabled =
                        accessBusy ||
                        accessLoading ||
                        (accessMode === "grant" && hasAccess);

                      return (
                        <li
                          key={c.id}
                          className={`px-5 py-4 hover:bg-gray-50 ${disabled ? "opacity-60" : ""}`}
                        >
                          <label className={`flex items-start gap-3 ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}>
                            <input
                              type="checkbox"
                              checked={checked}
                              disabled={disabled}
                              onChange={() => {
                                if (disabled) return;
                                toggleChecked(c.id);
                              }}
                              className="mt-1 h-4 w-4"
                            />

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <p className="font-semibold text-gray-900 truncate">{c.title}</p>

                                {accessMode === "grant" && hasAccess && (
                                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-700">
                                    Hat Zugriff
                                  </span>
                                )}
                              </div>

                              <p className="text-sm text-gray-500">
                                Level: {c.level ?? "-"} · Published: {c.isPublished ? "Ja" : "Nein"}
                              </p>
                            </div>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Ausgewählt: <b>{actionableSelectedCount}</b>
                {accessMode === "grant" && (
                  <span className="ml-3 text-xs text-gray-400">
                    (Aktiv: {activeVisibleCount})
                  </span>
                )}
              </p>

              <button
                onClick={submitAccessChanges}
                disabled={accessBusy || accessLoading || actionableSelectedCount === 0}
                className={`px-5 py-2.5 rounded-lg font-medium text-white transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${accessMode === "grant"
                  ? "bg-lila-600 hover:bg-lila-700"
                  : "bg-red-600 hover:bg-red-700"
                  }`}
              >
                {accessBusy
                  ? accessMode === "grant"
                    ? "Wird gewährt..."
                    : "Wird entzogen..."
                  : accessMode === "grant"
                    ? "Gewähren"
                    : "Entziehen"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===================== SMALL COMPONENTS ===================== */

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white/10 rounded-xl p-3">
      <p className="text-xs text-white/70 font-medium">{label}</p>
      <p className="text-xl font-bold text-white mt-0.5">{value}</p>
    </div>
  );
}

function FilterPill({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors duration-150 ${active
        ? "bg-lila-600 text-white shadow-sm"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
    >
      {label}
    </button>
  );
}

function InfoRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
      <p className="text-xs text-gray-500 font-medium">{label}</p>
      <p
        className={`mt-1 text-sm font-semibold text-gray-900 break-all ${mono ? "font-mono" : ""
          }`}
      >
        {value}
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
      <div className="max-w-sm mx-auto">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Kein Benutzer ausgewählt
        </h3>
        <p className="text-gray-500">
          Wählen Sie einen Benutzer aus der Liste, um Details anzuzeigen.
        </p>
      </div>
    </div>
  );
}