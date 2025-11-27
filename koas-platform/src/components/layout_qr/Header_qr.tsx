// components/layout/Header.tsx
import { LanguageIcon } from "@heroicons/react/24/solid";
//import Menu from "@/components/menu/Menu";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function Header_qr() {
    //const [menuOpen, setMenuOpen] = useState(false);
    const [langHint, setLangHint] = useState<string | null>(null); // 배지 텍스트
    const { i18n, t } = useTranslation();

    // 지원 언어 순서와 배지 표기
    const LANG_ORDER = ["ko", "en", "zh"] as const;
    const LANG_LABEL: Record<string, string> = {
        ko: "한국어",
        en: "English",
        zh: "中文",
    };

    // html lang 속성 표준화(중국어는 보통 zh-CN로 표기)
    function toHtmlLang(lng: string) {
        if (lng.startsWith("zh")) return "zh-CN";
        if (lng.startsWith("en")) return "en";
        if (lng.startsWith("ko")) return "ko";
        return lng;
    }

    const toggleLang = async () => {
        const cur = i18n.language || "en";
        const idx = LANG_ORDER.findIndex((l) => cur.startsWith(l));
        const next = LANG_ORDER[(idx + 1) % LANG_ORDER.length];

        // i18next 변경
        await i18n.changeLanguage(next);

        // html lang (접근성/SEO)
        document.documentElement.lang = toHtmlLang(next);

        // 배지 텍스트
        setLangHint(LANG_LABEL[next] ?? "");

        // 다음 방문에서도 유지하고 싶으면(선택):
        try {
            localStorage.setItem("i18nextLng", next);
        } catch { }

        // 1.2초 뒤 숨김
        window.setTimeout(() => setLangHint(null), 1200);
    };

    return (
        <header className="fixed inset-x-0 top-0 z-[100] flex items-center justify-end">
            <div className="relative flex justify-end items-center gap-1">
                {/* 언어 토글 */}
                <button
                    type="button"
                    aria-label={t("changeLanguage")}
                    title={i18n.language.startsWith("ko") ? "한국어 → English" : "English → 한국어"}
                    onClick={toggleLang}
                    className="relative p-2 hover:opacity-80 active:opacity-60"
                >
                    <LanguageIcon className="w-8 h-8 fill-[#eed49d]" />
                    {/* 배지(클릭 즉시 현재 언어 표시) */}
                    {langHint && (
                        <span
                            className="absolute top-full left-1/2 -translate-x-1/2 mt-1
                            inline-block pointer-events-none z-50
                            whitespace-nowrap [word-break:keep-all] [writing-mode:horizontal-tb]
                            text-center leading-none rounded-full px-2 py-0.5 text-xs font-medium
                            bg-black/80 text-white shadow"
                        >
                            {langHint}
                        </span>
                    )}
                </button>

                {/* 메뉴 토글 */}
                {/* <button
                    type="button"
                    aria-label={t("menu")}
                    onClick={() => setMenuOpen(true)}
                    className="p-2 hover:opacity-80 active:opacity-60"
                >
                    <Bars3Icon className="w-8 h-8 fill-[#403736]" />
                </button> */}
            </div>

            {/* 스크린리더용 라이브 리전(시각적 표시는 없음) */}
            <div className="sr-only" aria-live="polite">
                {langHint ? `언어가 ${langHint}로 변경되었습니다.` : ""}
            </div>

            {/* <Menu open={menuOpen} onClose={() => setMenuOpen(false)} /> */}
        </header>
    );
}
