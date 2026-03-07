import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import logoImage from "../assets/161081515_998561084216896_3793119470385069608_n.jpg";

const adminNavItems = [
  { label: "Kategorien und Kurse", to: "/admin/manage-structure" },
  { label: "Lektion erstellen", to: "/admin/post-lesson" },
  { label: "Kurse verwalten", to: "/admin/courses" },
  { label: "Benutzer verwalten", to: "/admin/accounts" },
];

const teacherNavItems = [
  { label: "Lektion erstellen", to: "/teacher/post-lesson" },
  { label: "Lektionen verwalten", to: "/teacher/courses" },
];

const studentNavItems = [
  { label: "Meine Kurse", to: "/student/my-courses" },
  { label: "Kurse kaufen", to: "/alle-kurse" },
];

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const navItems =
    user?.role === "Admin"
      ? adminNavItems
      : user?.role === "Teacher"
        ? teacherNavItems
        : user?.role === "Student"
          ? studentNavItems
          : [];

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-lg font-medium transition-all ${isActive
      ? "bg-lila-600 text-white shadow-lg"
      : "text-gray-700 hover:bg-lila-50 hover:text-lila-700"
    }`;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDesktopDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-md border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <button
            onClick={() => {
              if (!isAuthenticated) {
                navigate("/");
              } else if (user?.role === "Admin") {
                navigate("/admin/dashboard");
              } else if (user?.role === "Teacher") {
                navigate("/teacher/dashboard");
              } else {
                navigate("/student/dashboard");
              }
            }}
            className="flex items-center space-x-3 group"
          >
            <img
              src={logoImage}
              alt="Lila Deutsch Logo"
              className="w-[180px] aspect-[1064/473] object-contain"
            />

            <div>
              <span className="text-xl font-bold text-lila-700 block leading-tight">
                Deutsch
              </span>
              <span className="text-xs text-gray-500 block leading-tight">
                Sprachschule
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {!isAuthenticated && (
              <>
                <NavLink to="/alle-kurse" className={linkClass}>
                  Alle Kurse
                </NavLink>
                <NavLink to="/login" className={linkClass}>
                  Login
                </NavLink>
                <NavLink to="/register" className={linkClass}>
                  Register
                </NavLink>
              </>
            )}

            {isAuthenticated && (
              <>
                {(user?.role === "Admin" || user?.role === "Teacher" || user?.role === "Student") && (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setDesktopDropdownOpen((prev) => !prev)}
                      className="p-2 rounded-lg text-gray-700 hover:bg-lila-50 hover:text-lila-700 transition-all"
                      aria-label="Navigation öffnen"
                    >
                      <svg
                        className={`w-6 h-6 transition-transform ${desktopDropdownOpen}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16M4 12h16M4 18h16"
                        />
                      </svg>
                    </button>

                    {desktopDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden z-50">
                        <div className="py-2">
                          {navItems.map((item) => (
                            <button
                              key={item.to}
                              onClick={() => {
                                navigate(item.to);
                                setDesktopDropdownOpen(false);
                              }}
                              className="w-full text-left px-4 py-3 text-gray-700 hover:bg-lila-50 hover:text-lila-700 transition-colors"
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all"
                >
                  Logout
                </button>

                <div className="w-px h-8 bg-gray-200 mx-2" />

                <button className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-gradient-to-br from-lila-400 to-lila-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user?.userName?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-gray-700 font-medium">
                    {user?.userName}
                  </span>
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t space-y-2">
            {!isAuthenticated && (
              <>
                <NavLink
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-lila-50"
                >
                  Login
                </NavLink>

                <NavLink
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-lila-50"
                >
                  Register
                </NavLink>
              </>
            )}

            {isAuthenticated && (
              <>
                {(user?.role === "Admin" || user?.role === "Teacher") &&
                  navItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-lila-50"
                    >
                      {item.label}
                    </NavLink>
                  ))}

                {user?.role === "Student" && (
                  <NavLink
                    to="/student/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-lila-50"
                  >
                    Meine Kurse
                  </NavLink>
                )}

                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>

                <div className="pt-4 mt-4 border-t">
                  <div className="flex items-center space-x-3 px-4 py-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-lila-400 to-lila-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {user?.userName?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {user?.userName}
                      </p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}