import type { UserReadDto } from "../../../types/user";
import type { UserDetailsDto } from "../../../services/userService";

type UserDetailsCardProps = {
  selected: UserReadDto;
  details: UserDetailsDto | null;
  loadingDetails: boolean;
  selectedInitial: string;
  isActive: boolean;
  onCopyId: () => void;
  onCopyEmail: () => void;
  onOpenAccessModal: () => void;
  showAccessButton: boolean;
  actionBusy: boolean;
  formatDate: (value: string | null | undefined) => string;
};

export default function UserDetailsCard({
  selected,
  details,
  loadingDetails,
  selectedInitial,
  isActive,
  onCopyId,
  onCopyEmail,
  onOpenAccessModal,
  showAccessButton,
  actionBusy,
  formatDate,
}: UserDetailsCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-lila-600 to-lila-700 p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-white/15 text-white flex items-center justify-center font-bold text-xl shadow-sm">
            {selectedInitial}
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">{selected.userName}</h1>
            <p className="text-white/80">{selected.email}</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/15 text-white">
              {loadingDetails ? "Wird geladen..." : details?.roleName ?? selected.roleName}
            </span>

            <span
              className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                isActive
                  ? "bg-green-500/20 text-white"
                  : "bg-yellow-500/20 text-white"
              }`}
              title={
                details?.deletedAt ? `Gelöscht am: ${formatDate(details.deletedAt)}` : ""
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
            <InfoRow label="Rolle" value={details?.roleName ?? selected.roleName} />
            <InfoRow label="Gelöscht am" value={formatDate(details?.deletedAt)} />
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onCopyId}
            className="bg-gray-50 hover:bg-gray-100 text-gray-900 px-4 py-2.5 rounded-lg font-medium transition-colors duration-150 border border-gray-200 shadow-sm"
          >
            ID kopieren
          </button>

          <button
            onClick={onCopyEmail}
            className="bg-gray-50 hover:bg-gray-100 text-gray-900 px-4 py-2.5 rounded-lg font-medium transition-colors duration-150 border border-gray-200 shadow-sm"
          >
            E-Mail kopieren
          </button>

          {showAccessButton && (
            <button
              onClick={onOpenAccessModal}
              disabled={loadingDetails || actionBusy}
              className="bg-lila-600 hover:bg-lila-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors duration-150 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Kurszugriff
            </button>
          )}
        </div>
      </div>
    </div>
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
        className={`mt-1 text-sm font-semibold text-gray-900 break-all ${
          mono ? "font-mono" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}