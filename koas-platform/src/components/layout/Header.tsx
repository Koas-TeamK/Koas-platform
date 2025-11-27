// components/layout/Header.tsx
import { LanguageIcon } from "@heroicons/react/24/solid";
//import Menu from "@/components/menu/Menu";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useSectionVisible } from "@/shared/hooks/useSectionVisible"; // ✅ APEC 섹션 감지 훅 추가
import "./Header.css";

export default function Header() {
    //const [menuOpen, setMenuOpen] = useState(false);
    const [langHint, setLangHint] = useState<string | null>(null);
    const { i18n, t } = useTranslation();

    // APEC 섹션이 뷰포트에 보이는지 감지 (섹션 id: apec-section, threshold 0.4)
    const isApecVisible = useSectionVisible("apec-section", 0.4);

    const LANG_ORDER = ["en", "ko", "zh"] as const;
    const LANG_LABEL: Record<string, string> = { en: "English", ko: "한국어", zh: "中文" };

    const currentLang = useMemo<"en" | "ko" | "zh">(() => {
        const cur = i18n.language || "en";
        if (cur.startsWith("ko")) return "ko";
        if (cur.startsWith("zh")) return "zh";
        return "en";
    }, [i18n.language]);

    const toHtmlLang = (lng: "en" | "ko" | "zh") => (lng === "zh" ? "zh-CN" : lng);

    const setLanguage = useCallback(
        async (next: "en" | "ko" | "zh") => {
            await i18n.changeLanguage(next);
            document.documentElement.lang = toHtmlLang(next);
            setLangHint(LANG_LABEL[next]);
            try {
                localStorage.setItem("i18nextLng", next);
            } catch { }
            window.setTimeout(() => setLangHint(null), 1200);
        },
        [i18n]
    );

    const toggleLang = useCallback(() => {
        const idx = LANG_ORDER.findIndex((l) => l === currentLang);
        const next = LANG_ORDER[(idx + 1) % LANG_ORDER.length];
        setLanguage(next);
    }, [currentLang, setLanguage]);

    useEffect(() => {
        document.documentElement.lang = toHtmlLang(currentLang);
        setLangHint(LANG_LABEL[currentLang]);
        const id = window.setTimeout(() => setLangHint(null), 1200);
        return () => window.clearTimeout(id);
    }, [currentLang]);

    // APEC 가시성에 따라 로고 색상 전환
    const logoSrc = isApecVisible ? "/logo/maruon-white.png" : "/logo/maruon-logo.png";

    return (
        <header
            className={
                [
                    "fixed inset-x-0 top-0 z-[100]",
                    // 모바일: [1fr auto 1fr] → 로고가 가운데로 정렬되도록
                    // 데스크탑(md~): [auto 1fr auto] → 좌측 여백을 최소화해 로고를 왼쪽으로 붙일 수 있게
                    "grid grid-cols-[1fr_auto_1fr] md:grid-cols-[auto_1fr_auto]",
                    "items-center p-5",
                    "transition-all duration-300",
                ].join(" ")
            }
        >
            {/* 왼쪽 스페이서: 모바일에선 유지(가운데 정렬 균형), 데스크탑에선 숨김 → 로고가 왼쪽으로 이동 */}
            <div className="justify-self-start lg:hidden" />

            {/* 중앙 로고 (모바일=가운데 / 데스크탑=왼쪽) */}
            <div
                className={
                    [
                        "justify-self-center", // 모바일: 가운데
                        "md:justify-self-start", // 데스크탑: 왼쪽
                    ].join(" ")
                }
            >
                <img
                    src={logoSrc}
                    alt="MARUON"
                    className="w-11 h-auto max-h-full lg:w-18 mt-2 transition-all duration-300"
                />
            </div>

            {/* 오른쪽 컨트롤 (그대로 유지) */}
            <div className="justify-self-end flex items-center gap-2">
                {/* >= sm: 라디오(글래스 토글) — ★ ID는 CSS와 동일하게 유지 */}
                <div className="hidden sm:block">
                    <div
                        className={[
                            "glass-radio-group",
                            isApecVisible ? "apec" : "", // APEC이면 테마 변경
                        ].join(" ")}
                    >
                        {/* silver => English */}
                        <input
                            type="radio"
                            name="lang"
                            id="glass-silver"
                            checked={currentLang === "en"}
                            onChange={() => setLanguage("en")}
                        />
                        <label htmlFor="glass-silver">English</label>

                        {/* gold => 한국어 */}
                        <input
                            type="radio"
                            name="lang"
                            id="glass-gold"
                            checked={currentLang === "ko"}
                            onChange={() => setLanguage("ko")}
                        />
                        <label htmlFor="glass-gold">한국어</label>

                        {/* platinum => 中文 */}
                        <input
                            type="radio"
                            name="lang"
                            id="glass-platinum"
                            checked={currentLang === "zh"}
                            onChange={() => setLanguage("zh")}
                        />
                        <label htmlFor="glass-platinum">中文</label>

                        {/* 글라이더: 반드시 마지막 형제여야 함 */}
                        <div className="glass-glider" />
                    </div>
                </div>

                {/* < sm: 아이콘 버튼(순환) */}
                <div className="relative flex justify-end items-center gap-1 sm:hidden">
                    <button
                        type="button"
                        aria-label={t("changeLanguage", "Change language")}
                        title={`${LANG_LABEL[currentLang]
                            } → ${LANG_LABEL[
                            LANG_ORDER[(LANG_ORDER.indexOf(currentLang) + 1) % LANG_ORDER.length]
                            ]
                            }`}
                        onClick={toggleLang}
                        className="relative p-2 hover:opacity-80 active:opacity-60"
                    >
                        {/* APEC 가시성에 따라 아이콘 색상도 전환 */}
                        <LanguageIcon className={`w-6 h-6 transition-colors duration-300 ${isApecVisible ? "fill-white" : "fill-[#403736]"}`} />
                        {langHint && (
                            <span
                                className="absolute top-full left-1/2 -translate-x-1/2 mt-1
                           inline-block pointer-events-none z-50
                           whitespace-nowrap [word-break:keep-all]
                           text-center leading-none rounded-full px-2 py-0.5 text-xs font-medium
                           bg-black/80 text-white shadow"
                            >
                                {langHint}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* 스크린리더 알림 */}
            <div className="sr-only" aria-live="polite">
                {langHint ? `언어가 ${langHint}로 변경되었습니다.` : ""}
            </div>

            {/* 
      <Menu open={menuOpen} onClose={() => setMenuOpen(false)} /> 
      */}
        </header>
    );
}
