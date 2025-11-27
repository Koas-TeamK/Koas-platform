// AppLayout.tsx
import { Outlet } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SnsTab from "@/components/SnsTab";

export default function AppLayout() {
    return (
        <div
            className="w-full h-full flex flex-col overflow-x-hidden overflow-y-auto"
            style={{ WebkitOverflowScrolling: "touch" }}
        >
            <Header />

            <main className="flex-1 min-h-0 pt-[env(safe-area-inset-top)]">
                <Outlet />
            </main>

            <footer className="shrink-0 relative z-20">
                <Footer />
            </footer>

            <SnsTab />
        </div>
    );
}
