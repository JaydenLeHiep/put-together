import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import CoursePage from "./pages/CoursePage";
import AdminPage from "./pages/AdminPage";

export default function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<CoursePage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}