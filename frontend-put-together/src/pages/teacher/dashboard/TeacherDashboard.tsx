import DashboardCard from "../../../components/cards/DashboardCard";
import { useAuth } from "../../../hooks/useAuth";
import { teacherDashboardCards } from "./teacherDashboardCards";

export default function TeacherDashboard() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-lila-700 mb-2">Teacher Dashboard</h1>
        <p className="text-gray-600">
          Willkommen zurück, {user?.userName || "Teacher"}! Verwalten Sie Ihre Lektionen.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teacherDashboardCards.map((card) => (
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
    </div>
  );
}