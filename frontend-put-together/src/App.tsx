import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AdminRoute } from "./components/auth/AdminRoute";
import { StudentRoute } from "./components/auth/StudentRoute";
import { TeacherRoute } from "./components/auth/TeacherRoute";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { EmailVerifyPage } from "./pages/EmailVerifyPage";
import ResendVerifyPage from "./pages/ResendVerifyPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";

// Admin
import AdminDashboard from "./pages/admin/dashboard/AdminDashboard";
import AdminPostLessonPage from "./pages/admin/postLesson/AdminPostLessonPage";
import AdminCoursesPage from "./pages/admin/courses/AdminCoursesPage";
import ManageStructurePage from "./pages/admin/manageStructure/ManageStructurePage";
import UserManagement from "./pages/admin/userManagement/UserManagement";
import { AdminEditLesson } from "./pages/admin/editLesson/AdminEditLesson";

// Student
import StudentDashboard from "./pages/student/dashboard/StudentDashboard";
import { StudentMyCoursesPage } from "./pages/student/StudentMyCoursesPage";

// Teacher
import TeacherDashboard from "./pages/teacher/dashboard/TeacherDashboard";

import PublicCoursesPage from "./pages/publicCourses/PublicCoursesPage";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<EmailVerifyPage />} />
        <Route path="/resend-verify" element={<ResendVerifyPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/alle-kurse" element={<PublicCoursesPage />} />

        {/* Authenticated */}
        <Route element={<ProtectedRoute />}>
          {/* Redirect helpers */}
          <Route
            path="/admin"
            element={<Navigate to="/admin/dashboard" replace />}
          />
          <Route
            path="/teacher"
            element={<Navigate to="/teacher/dashboard" replace />}
          />
          <Route
            path="/student"
            element={<Navigate to="/student/dashboard" replace />}
          />

          {/* Admin */}
          <Route element={<AdminRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route
              path="/admin/post-lesson"
              element={<AdminPostLessonPage />}
            />
            <Route path="/admin/courses" element={<AdminCoursesPage />} />
            <Route
              path="/admin/manage-structure"
              element={<ManageStructurePage />}
            />
            <Route path="/admin/accounts" element={<UserManagement />} />
            <Route
              path="/admin/lessons/:lessonId/edit"
              element={<AdminEditLesson />}
            />
          </Route>

          {/* Student */}
          <Route element={<StudentRoute />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route
              path="/student/my-courses"
              element={<StudentMyCoursesPage />}
            />
            <Route
              path="/student/buy-courses"
              element={<PublicCoursesPage />}
            />
          </Route>

          {/* Teacher */}
          <Route element={<TeacherRoute />}>
            <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
            <Route
              path="/teacher/post-lesson"
              element={<AdminPostLessonPage />}
            />
            <Route path="/teacher/courses" element={<AdminCoursesPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
