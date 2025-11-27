// src/shared/hooks/usePageTheme.ts
import { useEffect } from "react";

export function usePageTheme(color: string) {
    useEffect(() => {
        // 1) theme-color 설정
        let meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
        const created = !meta;
        if (!meta) {
            meta = document.createElement("meta");
            meta.setAttribute("name", "theme-color");
            document.head.appendChild(meta);
        }
        const prevTheme = meta.getAttribute("content");
        meta.setAttribute("content", color);

        // 2) body 배경 (이 페이지만)
        const prevBodyBg = document.body.style.backgroundColor;
        document.body.style.backgroundColor = color;

        // 3) iOS 안전영역 덮개 (필요 시)
        const cover = document.createElement("div");
        cover.style.position = "fixed";
        cover.style.top = "0";
        cover.style.left = "0";
        cover.style.right = "0";
        cover.style.height = "env(safe-area-inset-top)";
        cover.style.background = color;
        cover.style.zIndex = "9999";
        cover.style.pointerEvents = "none";
        document.body.appendChild(cover);

        return () => {
            // 원복
            if (prevTheme != null) meta!.setAttribute("content", prevTheme);
            else if (created && meta) meta.remove();

            document.body.style.backgroundColor = prevBodyBg;
            cover.remove();
        };
    }, [color]);
}
