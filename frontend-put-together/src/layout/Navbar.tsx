import { NavLink } from "react-router-dom";

export default function Navbar() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "text-lila-700 font-semibold"
      : "text-gray-600 hover:text-lila-600";

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <span className="text-xl font-bold text-lila-700">
          Lila Deutsch Sprachzentrum
        </span>

        <div className="flex gap-6">
          <NavLink to="/" className={linkClass}>
            Kurse
          </NavLink>
          <NavLink to="/admin" className={linkClass}>
            Admin
          </NavLink>
        </div>
      </div>
    </nav>
  );
}