import type {ReactNode} from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function MainLayout({children}: { children: ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col bg-lila-50">
            <Navbar/>
            <main className="flex-1 container mx-auto px-6 py-8">
                {children}
            </main>
            <Footer/>
        </div>
    );
}