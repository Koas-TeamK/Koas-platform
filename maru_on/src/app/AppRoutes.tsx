//AppRoutes.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "@/shared/ui/AppLayout";
import AppLayout_QR from "@/shared/ui/AppLayout_QR";
import MainPage from "@/pages/main/MainPage";
import MaruonSerialPage from "@/pages/serial/MaruonSerialPage";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AppLayout />}>
                    <Route path="/" element={<MainPage />} />
                </Route>
                {/* 오너십(시리얼 노출) 페이지*/}
                <Route element={<AppLayout_QR />}>
                    <Route path="/maruon" element={<MaruonSerialPage />} />
                    <Route path="/maruon/:serial" element={<MaruonSerialPage />} />
                    <Route path="/maruon/serial=:serial" element={<MaruonSerialPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}