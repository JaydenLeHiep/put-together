import DashboardCard from "../../../components/cards/DashboardCard";
import { useAuth } from "../../../hooks/useAuth";

import { adminDashboardCards } from "./adminDashboardCards";
import { useAdminDashboardStats } from "./useAdminDashboardStats";
import AdminQuickStats from "./AdminQuickStats";

export default function AdminDashboard() {
  const { user } = useAuth();

  const {
    statsLoading,
    statsError,
    totalCourses,
    totalLessons,
    totalUsers,
  } = useAdminDashboardStats();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-lila-700 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">
          Willkommen zurück, {user?.userName || "Admin"}! Verwalten Sie Ihre Plattform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {adminDashboardCards.map((card) => (
          <DashboardCard
            key={card.navigateTo}
            title={card.title}
            description={card.description}
            navigateTo={card.navigateTo}
            iconBgColor={card.iconBgColor}
            icon={card.icon}
          />
        ))}
      </div>

      <AdminQuickStats
        statsLoading={statsLoading}
        statsError={statsError}
        totalCourses={totalCourses}
        totalLessons={totalLessons}
        totalUsers={totalUsers}
      />
    </div>
  );
}