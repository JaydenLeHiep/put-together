import DashboardCard from "../../../components/cards/DashboardCard";
import { useAuth } from "../../../hooks/useAuth";

export default function StudentDashboard() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-lila-700 mb-2">
          Student Dashboard
        </h1>
        <p className="text-gray-600">
          Willkommen zurück, {user?.userName ?? "Student"}!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardCard
          title="Meine Kurse"
          description="Greifen Sie auf Ihre freigeschalteten Kurse und Lektionen zu."
          navigateTo="/student/my-courses"
          iconBgColor="bg-gradient-to-br from-lila-600 to-lila-700"
          icon={
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          }
        />

        <DashboardCard
          title="Kurse entdecken"
          description="Entdecken Sie alle veröffentlichten Kurse. (Warenkorb/Bezahlung folgt später.)"
          navigateTo="/student/buy-courses"
          iconBgColor="bg-gradient-to-br from-emerald-500 to-emerald-600"
          icon={
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.2 6h12.4M10 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z"
              />
            </svg>
          }
        />
      </div>
    </div>
  );
}