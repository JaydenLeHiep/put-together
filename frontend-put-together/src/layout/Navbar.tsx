import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-lg font-medium transition-all ${
      isActive
        ? "bg-lila-600 text-white shadow-lg"
        : "text-gray-700 hover:bg-lila-50 hover:text-lila-700"
    }`;

  return (
    <nav className="bg-white shadow-md border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <NavLink to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-lila-600 to-lila-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <svg
                className="w-7 h-7 text-white"
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
            <div>
              <span className="text-xl font-bold text-lila-700 block leading-tight">
                Lila Deutsch
              </span>
              <span className="text-xs text-gray-500 block leading-tight">
                Sprachzentrum
              </span>
            </div>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <div className="hidden md:flex items-center space-x-2">
              {!isAuthenticated && (
                <>
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
                  <NavLink to="/course" className={linkClass}>
                    Kurse
                  </NavLink>

                  <NavLink to="/admin" className={linkClass}>
                    Admin
                  </NavLink>

                  <button
                    onClick={logout}
                    className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all"
                  >
                    Logout
                  </button>

                  <div className="w-px h-8 bg-gray-200 mx-2"></div>

                  {/* Profile */}
                  <button className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-8 h-8 bg-gradient-to-br from-lila-400 to-lila-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      A
                    </div>
                    <span className="text-gray-700 font-medium">Admin</span>
                  </button>
                </>
              )}
            </div>

            {isAuthenticated && <button onClick={handleLogout}>Logout</button>}

            <div className="w-px h-8 bg-gray-200 mx-2"></div>

            {/* User Profile Button */}
            <button className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-8 h-8 bg-gradient-to-br from-lila-400 to-lila-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                A
              </div>
              <span className="text-gray-700 font-medium">Admin</span>
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>

          {/* Mobile Menu Button */}
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

                <NavLink
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-lila-50"
                >
                  Admin
                </NavLink>

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
                      A
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Admin</p>
                      <p className="text-sm text-gray-500">
                        admin@lila-deutsch.de
                      </p>
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
