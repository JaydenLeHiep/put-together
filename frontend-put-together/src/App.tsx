import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AdminRoute } from "./components/auth/AdminRoute";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AfterLoginRedirect from "./components/auth/AfterLoginRedirect";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPostLessonPage from "./pages/admin/AdminPostLessonPage";
import AdminCoursesPage from "./pages/admin/AdminCoursesPage";
import AdminProductCoursesPage from "./pages/admin/AdminProductCoursesPage";
import ManageStructurePage from "./pages/admin/ManageStructurePage";
import UserManagement from "./pages/admin/UserManagement";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout */}
        <Route element={<MainLayout />}>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Authenticated */}
          <Route element={<ProtectedRoute />}>
            <Route path="/after-login" element={<AfterLoginRedirect />} />
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

            <Route element={<AdminRoute />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/post-lesson" element={<AdminPostLessonPage />} />
              <Route path="/admin/courses" element={<AdminCoursesPage />} />
              <Route path="/admin/product-courses" element={<AdminProductCoursesPage />} />
              <Route path="/admin/manage-structure" element={<ManageStructurePage />} />
              <Route path="/admin/accounts" element={<UserManagement />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}