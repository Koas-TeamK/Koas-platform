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
            {/* 헤더가 fixed가 아니라면 shrink-0만 주면 됨 */}
            <Header />

            {/* 메인: 스크롤은 여기서 담당 */}
            <main className="flex-1 min-h-0 pt-[env(safe-area-inset-top)]">
                <Outlet />
            </main>

            {/* 푸터: 항상 바닥에 노출 */}
            <footer className="shrink-0 relative z-20">
                <Footer />
            </footer>

            {/* 고정 탭이 겹치면 z-index를 푸터보다 낮게 */}
            <SnsTab />
        </div>
    );
}
