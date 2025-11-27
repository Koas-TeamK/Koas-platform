import { Outlet } from "react-router-dom";
import Header from "@/components/layout_qr/Header_qr";
import Footer from "@/components/layout_qr/Footer_qr";

export default function AppLayout_QR() {
    return (
        <div>
            <Header />
            {/* 헤더 높이 + 노치 영역만큼 상단 여백 */}
            {/* SnsTab(고정 하단 버튼류) 높이까지 하단 여백 */}
            <main className="pt-[calc(env(safe-area-inset-top)+4rem)]">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
