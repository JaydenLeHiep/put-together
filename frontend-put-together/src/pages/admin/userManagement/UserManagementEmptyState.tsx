export default function UserManagementEmptyState() {
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