import {BrowserRouter, Routes, Route} from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import CoursePage from "./pages/CoursePage";
import AdminPage from "./pages/AdminPage";
import {LessonProvider} from "./contexts/LessonContext";

export default function App() {
    return (
        <BrowserRouter>
            <LessonProvider>
                <MainLayout>
                    <Routes>
                        <Route path="/" element={<CoursePage/>}/>
                        <Route path="/admin" element={<AdminPage/>}/>
                    </Routes>
                </MainLayout>
            </LessonProvider>
        </BrowserRouter>
    );
}