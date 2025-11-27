// src/components/MobileShell.tsx
import type { ReactNode } from "react";

export default function MobileShell({ children }: { children: ReactNode }) {
    return (
        <div className="w-dvw min-h-dvh bg-[#0b0b0f] md:grid md:place-items-center">
            {/* ✅ 모바일: 전체화면 덮기, 데스크탑: 고정폭 박스 */}
            <div className="w-full h-dvh md:h-auto md:w-[390px] md:min-h-[844px] bg-white md:rounded-3xl md:shadow-2xl md:overflow-hidden">
                {children}
            </div>
        </div>
    );
}
