import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import logoImage from "../assets/161081515_998561084216896_3793119470385069608_n.jpg";

const adminNavItems = [
  { label: "Lektion erstellen", to: "/admin/post-lesson" },
  { label: "Lektionen verwalten", to: "/admin/courses" },
  { label: "Produkte", to: "/admin/product-courses" },
  { label: "Benutzer", to: "/admin/accounts" },
];

const teacherNavItems = [
  { label: "Dashboard", to: "/teacher/dashboard" },
  { label: "Lektion erstellen", to: "/teacher/post-lesson" },
  { label: "Lektionen verwalten", to: "/teacher/courses" },
  { label: "Produkte", to: "/teacher/product-courses" },
];

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-lg font-medium transition-all ${isActive
      ? "bg-lila-600 text-white shadow-lg"
      : "text-gray-700 hover:bg-lila-50 hover:text-lila-700"
    }`;

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
                navigate("/course");
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
            <div className="hidden md:flex items-center space-x-2">
              {!isAuthenticated && (
                <>
                  <NavLink to="/product-courses" className={linkClass}>
                    Entdeckt
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
                  {user?.role === "Admin" && (
                    <>
                      {adminNavItems.map((item) => (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          className={linkClass}
                        >
                          {item.label}
                        </NavLink>
                      ))}
                    </>
                  )}

                  {user?.role === "Teacher" && (
                    <>
                      {teacherNavItems.map((item) => (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          className={linkClass}
                        >
                          {item.label}
                        </NavLink>
                      ))}
                    </>
                  )}

                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all"
                  >
                    Logout
                  </button>

                  <div className="w-px h-8 bg-gray-200 mx-2"></div>

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

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
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
                  <NavLink
                    to="/course"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-lila-50"
                  >
                    Kurse
                  </NavLink>

                  {user?.role === "Admin" && (
                    <>
                      {adminNavItems.map((item) => (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-lila-50"
                        >
                          {item.label}
                        </NavLink>
                      ))}
                    </>
                  )}

                  {user?.role === "Teacher" && (
                    <>
                      {teacherNavItems.map((item) => (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-lila-50"
                        >
                          {item.label}
                        </NavLink>
                      ))}
                    </>
                  )}

                  <button
                    onClick={() => {
                      logout();
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
      </div>
    </nav>
  );
}
