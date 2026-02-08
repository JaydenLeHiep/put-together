import DashboardCard from "./DashboardCard";
import { useAuth } from "../../hooks/useAuth";

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-lila-700 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">
          Willkommen zurück, {user?.userName || "Admin"}! Verwalten Sie Ihre
          Plattform.
        </p>
      </div>

      {/* Dashboard Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Manage Categories & Courses */}
        <DashboardCard
          title="Kategorien & Kurse"
          description="Kategorien erstellen und Kurse organisieren"
          navigateTo="/admin/manage-structure"
          iconBgColor="bg-gradient-to-br from-yellow-500 to-orange-500"
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
                d="M3 7h5l2 3h11M3 7v13h18V10M3 7l2-4h14l2 4"
              />
            </svg>
          }
        />

        {/* Card 2: Post Lesson */}
        <DashboardCard
          title="Lektion erstellen"
          description="Erstellen Sie eine neue Video-Lektion für Ihre Kurse"
          navigateTo="/admin/post-lesson"
          iconBgColor="bg-gradient-to-br from-blue-500 to-blue-600"
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
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          }
        />

        {/* Card 3: Manage Courses */}
        <DashboardCard
          title="Kurse verwalten"
          description="Erstellen, bearbeiten und organisieren Sie Ihre Kurse"
          navigateTo="/admin/courses"
          iconBgColor="bg-gradient-to-br from-green-500 to-green-600"
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

        {/* Card 4: Manage Courses shop */}
        <DashboardCard
          title="Veröffentlichte Kurse"
          description="Alle Lektionen anzeigen, bearbeiten und veröffentlichen"
          navigateTo="/admin/product-courses"
          iconBgColor="bg-gradient-to-br from-purple-500 to-purple-600"
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
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          }
        />

        {/* Card 5: Account Management */}
        <DashboardCard
          title="Benutzerverwaltung"
          description="Verwalten Sie Benutzer und gewähren Sie Zugriff"
          navigateTo="/admin/accounts"
          iconBgColor="bg-gradient-to-br from-red-500 to-red-600"
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
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          }
        />
      </div>

      {/* Quick Stats Section */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-lila-500 to-lila-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lila-100 text-sm font-medium mb-1">
                Gesamt Kurse
              </p>
              <p className="text-4xl font-bold">-</p>
            </div>
            <svg
              className="w-12 h-12 text-lila-200"
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
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">
                Gesamt Lektionen
              </p>
              <p className="text-4xl font-bold">-</p>
            </div>
            <svg
              className="w-12 h-12 text-blue-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium mb-1">
                Gesamt Benutzer
              </p>
              <p className="text-4xl font-bold">-</p>
            </div>
            <svg
              className="w-12 h-12 text-green-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}