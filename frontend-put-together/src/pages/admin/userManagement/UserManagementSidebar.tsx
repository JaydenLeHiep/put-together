import type { UserReadDto } from "../../../types/user";
import { rolePillClass } from "./useUserManagementPage";

type UserManagementSidebarProps = {
  users: UserReadDto[];
  filteredUsers: UserReadDto[];
  selected: UserReadDto | null;
  search: string;
  roleFilter: string;
  availableRoles: string[];
  error: string | null;
  stats: {
    total: number;
    admins: number;
    teachers: number;
    students: number;
  };
  onSearchChange: (value: string) => void;
  onRoleFilterChange: (value: string) => void;
  onReload: () => void;
  onSelect: (user: UserReadDto) => void;
};

export default function UserManagementSidebar({
  users,
  filteredUsers,
  selected,
  search,
  roleFilter,
  availableRoles,
  error,
  stats,
  onSearchChange,
  onRoleFilterChange,
  onReload,
  onSelect,
}: UserManagementSidebarProps) {
  return (
    <aside className="lg:col-span-4">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-lila-600 to-lila-700 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white">Benutzerverwaltung</h2>
              <p className="text-white/80 text-sm mt-1">
                Admin: alle Konten anzeigen
              </p>
            </div>

            <button
              onClick={onReload}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-150"
            >
              Neu laden
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-5">
            <Stat label="Gesamt" value={stats.total} />
            <Stat label="Admins" value={stats.admins} />
            <Stat label="Lehrer" value={stats.teachers} />
            <Stat label="Schüler" value={stats.students} />
          </div>
        </div>

        <div className="p-4 border-b border-gray-100 space-y-3">
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Suche: Benutzername, E-Mail, Rolle..."
            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-lila-500 focus:border-transparent"
          />

          <div className="flex items-center gap-2 flex-wrap">
            <FilterPill
              active={roleFilter === "All"}
              onClick={() => onRoleFilterChange("All")}
              label="Alle"
            />

            {availableRoles.map((r) => (
              <FilterPill
                key={r}
                active={roleFilter.trim().toLowerCase() === r.trim().toLowerCase()}
                onClick={() => onRoleFilterChange(r)}
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
                  onClick={() => onSelect(u)}
                  className={`w-full text-left px-5 py-4 transition-colors duration-150 ${
                    active ? "bg-lila-50" : "hover:bg-gray-50"
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
  );
}

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
      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors duration-150 ${
        active
          ? "bg-lila-600 text-white shadow-sm"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {label}
    </button>
  );
}