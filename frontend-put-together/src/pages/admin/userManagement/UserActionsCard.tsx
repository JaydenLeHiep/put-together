type UserActionsCardProps = {
  loadingDetails: boolean;
  actionBusy: boolean;
  isTargetAdmin: boolean;
  isActive: boolean;
  roleDraft: "Student" | "Teacher";
  onRoleDraftChange: (value: "Student" | "Teacher") => void;
  onSaveRole: () => void;
  onDeactivate: () => void;
  onActivate: () => void;
  pwDraft: string;
  pwRepeat: string;
  onPwDraftChange: (value: string) => void;
  onPwRepeatChange: (value: string) => void;
  showPwNew: boolean;
  showPwRepeat: boolean;
  onToggleShowPwNew: () => void;
  onToggleShowPwRepeat: () => void;
  canResetPw: boolean;
  pwTooShort: boolean;
  pwMismatch: boolean;
  onResetPassword: () => void;
};

export default function UserActionsCard({
  loadingDetails,
  actionBusy,
  isTargetAdmin,
  isActive,
  roleDraft,
  onRoleDraftChange,
  onSaveRole,
  onDeactivate,
  onActivate,
  pwDraft,
  pwRepeat,
  onPwDraftChange,
  onPwRepeatChange,
  showPwNew,
  showPwRepeat,
  onToggleShowPwNew,
  onToggleShowPwRepeat,
  canResetPw,
  pwTooShort,
  pwMismatch,
  onResetPassword,
}: UserActionsCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-xl font-bold text-gray-900">Aktionen</h3>
        <span className="text-sm text-gray-500">(nur Schüler ↔ Lehrer)</span>
      </div>

      {isTargetAdmin && (
        <div className="mt-4 bg-yellow-50 border border-yellow-100 rounded-xl p-4 text-sm text-yellow-800">
          Dieses Konto ist <b>Admin</b>. Rollenwechsel / Deaktivierung ist
          gesperrt.
        </div>
      )}

      <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-6 bg-gray-50 border border-gray-100 rounded-xl p-4">
          <p className="text-sm font-bold text-gray-900 mb-2">Rolle ändern</p>

          <div className="flex items-center gap-3">
            <select
              value={roleDraft}
              onChange={(e) =>
                onRoleDraftChange(e.target.value as "Student" | "Teacher")
              }
              disabled={loadingDetails || actionBusy || isTargetAdmin}
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-lila-500 disabled:opacity-50"
            >
              <option value="Student">Schüler</option>
              <option value="Teacher">Lehrer</option>
            </select>

            <button
              disabled={loadingDetails || actionBusy || isTargetAdmin}
              onClick={onSaveRole}
              className="bg-lila-600 hover:bg-lila-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors duration-150 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Speichern
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-2">
            Backend erlaubt nur Schüler/Lehrer.
          </p>
        </div>

        <div className="lg:col-span-6 bg-gray-50 border border-gray-100 rounded-xl p-4">
          <p className="text-sm font-bold text-gray-900 mb-2">Kontostatus</p>

          <div className="flex items-center gap-3">
            {isActive ? (
              <button
                disabled={loadingDetails || actionBusy || isTargetAdmin}
                onClick={onDeactivate}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors duration-150 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Deaktivieren
              </button>
            ) : (
              <button
                disabled={loadingDetails || actionBusy}
                onClick={onActivate}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors duration-150 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Aktivieren
              </button>
            )}

            <p className="text-sm text-gray-600">
              Status: <span className="font-semibold">{isActive ? "Aktiv" : "Inaktiv"}</span>
            </p>
          </div>

          <p className="text-xs text-gray-500 mt-2">
            Deaktivieren setzt „Gelöscht am“ (Soft Delete).
          </p>
        </div>

        <div className="lg:col-span-12 bg-gray-50 border border-gray-100 rounded-xl p-4">
          <p className="text-sm font-bold text-gray-900 mb-2">
            Passwort zurücksetzen
          </p>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <input
                value={pwDraft}
                onChange={(e) => onPwDraftChange(e.target.value)}
                type={showPwNew ? "text" : "password"}
                placeholder="Neues Passwort (mind. 8 Zeichen)"
                disabled={loadingDetails || actionBusy}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-lila-500 disabled:opacity-50"
              />

              <button
                type="button"
                onClick={onToggleShowPwNew}
                className="bg-white hover:bg-gray-100 text-gray-900 px-3 py-2.5 rounded-lg border border-gray-200 font-medium"
              >
                {showPwNew ? "Verbergen" : "Anzeigen"}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <input
                value={pwRepeat}
                onChange={(e) => onPwRepeatChange(e.target.value)}
                type={showPwRepeat ? "text" : "password"}
                placeholder="Passwort wiederholen"
                disabled={loadingDetails || actionBusy}
                className={`flex-1 border rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-lila-500 disabled:opacity-50 ${
                  pwMismatch ? "border-red-300" : "border-gray-200"
                }`}
              />

              <button
                type="button"
                onClick={onToggleShowPwRepeat}
                className="bg-white hover:bg-gray-100 text-gray-900 px-3 py-2.5 rounded-lg border border-gray-200 font-medium"
              >
                {showPwRepeat ? "Verbergen" : "Anzeigen"}
              </button>
            </div>

            <button
              disabled={!canResetPw}
              onClick={onResetPassword}
              className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors duration-150 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Zurücksetzen
            </button>

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
  );
}