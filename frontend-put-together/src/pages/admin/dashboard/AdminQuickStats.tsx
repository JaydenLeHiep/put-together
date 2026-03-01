type AdminQuickStatsProps = {
  statsLoading: boolean;
  statsError: string | null;
  totalCourses: number;
  totalLessons: number;
  totalUsers: number;
};

type StatCardProps = {
  label: string;
  value: number;
  statsLoading: boolean;
  statsError: string | null;
  className: string;
  errorClassName: string;
  icon: React.ReactNode;
};

function StatCard({
  label,
  value,
  statsLoading,
  statsError,
  className,
  errorClassName,
  icon,
}: StatCardProps) {
  return (
    <div className={`${className} rounded-2xl p-6 text-white shadow-lg`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium mb-1">{label}</p>
          <p className="text-4xl font-bold">{statsLoading ? "-" : value}</p>
          {statsError && <p className={`mt-2 text-xs ${errorClassName}`}>{statsError}</p>}
        </div>
        {icon}
      </div>
    </div>
  );
}

export default function AdminQuickStats({
  statsLoading,
  statsError,
  totalCourses,
  totalLessons,
  totalUsers,
}: AdminQuickStatsProps) {
  return (
    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        label="Gesamt Kurse"
        value={totalCourses}
        statsLoading={statsLoading}
        statsError={statsError}
        className="bg-gradient-to-br from-lila-500 to-lila-600"
        errorClassName="text-lila-100"
        icon={
          <svg className="w-12 h-12 text-lila-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        }
      />

      <StatCard
        label="Gesamt Lektionen"
        value={totalLessons}
        statsLoading={statsLoading}
        statsError={statsError}
        className="bg-gradient-to-br from-blue-500 to-blue-600"
        errorClassName="text-blue-100"
        icon={
          <svg className="w-12 h-12 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        }
      />

      <StatCard
        label="Gesamt Benutzer"
        value={totalUsers}
        statsLoading={statsLoading}
        statsError={statsError}
        className="bg-gradient-to-br from-green-500 to-green-600"
        errorClassName="text-green-100"
        icon={
          <svg className="w-12 h-12 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        }
      />
    </div>
  );
}