import { useNavigate } from "react-router-dom";

type DashboardCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  navigateTo: string;
  iconBgColor: string;
};

export default function DashboardCard({
  title,
  description,
  icon,
  navigateTo,
  iconBgColor,
}: DashboardCardProps) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(navigateTo)}
      className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all transform hover:-translate-y-1 text-left w-full group"
    >
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Icon */}
        <div
          className={`w-20 h-20 ${iconBgColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}
        >
          {icon}
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-gray-900">{title}</h3>

        {/* Description */}
        <p className="text-gray-600">{description}</p>

        {/* Arrow */}
        <div className="pt-2">
          <svg
            className="w-6 h-6 text-lila-600 group-hover:translate-x-2 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </div>
      </div>
    </button>
  );
}