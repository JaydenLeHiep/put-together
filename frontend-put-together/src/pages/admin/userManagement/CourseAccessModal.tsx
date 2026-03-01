import type { Course } from "../../../types/course";
import type { UserReadDto } from "../../../types/user";

type CourseAccessModalProps = {
  isOpen: boolean;
  selected: UserReadDto | null;
  currentRoleName?: string;
  isTargetStudent: boolean;
  accessMode: "grant" | "revoke";
  accessLoading: boolean;
  accessBusy: boolean;
  accessError: string | null;
  courseQuery: string;
  visibleList: Course[];
  activeCourses: Course[];
  activeCourseIdSet: Set<string>;
  checkedCourseIds: Set<string>;
  actionableSelectedCount: number;
  activeVisibleCount: number;
  onClose: () => void;
  onModeChange: (mode: "grant" | "revoke") => void;
  onCourseQueryChange: (value: string) => void;
  onToggleChecked: (courseId: string) => void;
  onSubmit: () => void;
};

export default function CourseAccessModal({
  isOpen,
  selected,
  currentRoleName,
  isTargetStudent,
  accessMode,
  accessLoading,
  accessBusy,
  accessError,
  courseQuery,
  visibleList,
  activeCourses,
  activeCourseIdSet,
  checkedCourseIds,
  actionableSelectedCount,
  activeVisibleCount,
  onClose,
  onModeChange,
  onCourseQueryChange,
  onToggleChecked,
  onSubmit,
}: CourseAccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Kurszugriff verwalten
            </h3>
            <p className="text-sm text-gray-500">
              Benutzer: <span className="font-semibold">{selected?.userName}</span> (
              {selected?.email})
            </p>
          </div>

          <button
            onClick={onClose}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-lg font-medium"
          >
            Schließen
          </button>
        </div>

        <div className="p-6 space-y-4">
          {!isTargetStudent && (
            <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-3 text-sm text-yellow-800">
              Hinweis: Kurszugriff ist normalerweise für <b>Student</b>. Aktuelle
              Rolle: <b>{currentRoleName}</b>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => onModeChange("grant")}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                accessMode === "grant"
                  ? "bg-lila-600 text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              Zugriff gewähren
            </button>

            <button
              onClick={() => onModeChange("revoke")}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                accessMode === "revoke"
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              Zugriff entziehen
            </button>
          </div>

          <input
            value={courseQuery}
            onChange={(e) => onCourseQueryChange(e.target.value)}
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

                  const checked =
                    accessMode === "grant"
                      ? hasAccess || checkedCourseIds.has(c.id)
                      : checkedCourseIds.has(c.id);

                  const disabled =
                    accessBusy ||
                    accessLoading ||
                    (accessMode === "grant" && hasAccess);

                  return (
                    <li
                      key={c.id}
                      className={`px-5 py-4 hover:bg-gray-50 ${
                        disabled ? "opacity-60" : ""
                      }`}
                    >
                      <label
                        className={`flex items-start gap-3 ${
                          disabled ? "cursor-not-allowed" : "cursor-pointer"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={disabled}
                          onChange={() => {
                            if (disabled) return;
                            onToggleChecked(c.id);
                          }}
                          className="mt-1 h-4 w-4"
                        />

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-semibold text-gray-900 truncate">
                              {c.title}
                            </p>

                            {accessMode === "grant" && hasAccess && (
                              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-700">
                                Hat Zugriff
                              </span>
                            )}
                          </div>

                          <p className="text-sm text-gray-500">
                            Level: {c.level ?? "-"} · Published:{" "}
                            {c.isPublished ? "Ja" : "Nein"}
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
            onClick={onSubmit}
            disabled={accessBusy || accessLoading || actionableSelectedCount === 0}
            className={`px-5 py-2.5 rounded-lg font-medium text-white transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${
              accessMode === "grant"
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
  );
}