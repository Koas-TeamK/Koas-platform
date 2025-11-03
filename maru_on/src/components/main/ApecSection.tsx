// ApecSection.tsx
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";

export default function ApecSection({ lang }: { lang: string }) {
    //console.log("[lang]", lang);
    const HREF = "/leaflet/apec%20leaflet.pdf";
    const { t } = useTranslation("common");

    const [revealed, setRevealed] = useState(false);
    const hideTimer = useRef<number | null>(null);

    const clearHideTimer = useCallback(() => {
        if (hideTimer.current) {
            clearTimeout(hideTimer.current);
            hideTimer.current = null;
        }
    }, []);

    const armAutoHide = useCallback(() => {
        clearHideTimer();
        hideTimer.current = window.setTimeout(() => setRevealed(false), 2500);
    }, [clearHideTimer]);

    const show = useCallback(() => {
        setRevealed(true);
        armAutoHide();
    }, [armAutoHide]);

    const hide = useCallback(() => {
        clearHideTimer();
        setRevealed(false);
    }, [clearHideTimer]);

    const toggleReveal = useCallback((e?: React.SyntheticEvent) => {
        if (e) {
            // 터치→클릭 중복 방지 + 부모로 버블링 방지
            e.preventDefault?.();
            e.stopPropagation?.();
        }
        setRevealed(prev => {
            const next = !prev;
            clearHideTimer();
            if (next) armAutoHide();
            return next;
        });
    }, [armAutoHide, clearHideTimer]);

    const openSite = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        window.open(HREF, "_blank", "noopener,noreferrer");
        setRevealed(false);
    }, []);

    useEffect(() => () => clearHideTimer(), [clearHideTimer]);

    //언어별 이미지 변경
    const imgSrc = useMemo(() => {
        const prefix = lang?.toLowerCase().split("-")[0] || "en";
        const map: Record<string, "(ko)" | "(en)" | "(zh)"> = { ko: "(ko)", en: "(en)", zh: "(zh)" };
        const suffix = map[prefix] ?? "(en)";
        return encodeURI(`/img/apec/apec${suffix}.png`);
    }, [lang]);

    return (
        <section
            className={[
                "group relative w-full h-full overflow-hidden",
                "bg-no-repeat bg-cover",
                "bg-[position:50%_50%] transition-[background-position] duration-500",
                "hover:bg-[position:50%_30%] focus:bg-[position:50%_30%]"
            ].join(" ")}
            style={{ backgroundImage: `url("${imgSrc}")` }}  //동적 URL은 inline style로
            onMouseEnter={show}
            onMouseLeave={hide}
            onFocus={show}
            onBlur={hide}
        >
            {/* BG 이미지 레이어 */}
            <div
                className={[
                    "absolute inset-0 pointer-events-none",
                    "bg-[url('/img/koas-apec-hover.jpg')] bg-cover bg-[position:60%_50%] bg-no-repeat",
                    "opacity-0 transition-opacity duration-300",
                    revealed ? "opacity-100" : "opacity-0",
                    "md:group-hover:opacity-100",
                ].join(" ")}
            />

            {/* 어둡게 레이어 */}
            <div
                className={[
                    "absolute inset-0 pointer-events-none",
                    "bg-black/60",
                    "opacity-0 transition-opacity duration-300",
                    revealed ? "opacity-100" : "opacity-0",
                    "md:group-hover:opacity-100",
                ].join(" ")}
            />

            {/* 모바일 토글 영역(같은 래퍼 안에서 절대배치) */}
            <button
                type="button"
                aria-label={t("apec.showButton", "APEC 버튼 표시")}
                className="md:hidden absolute inset-0 z-10 bg-transparent touch-manipulation"
                onPointerDown={toggleReveal}
            />

            {/* CTA 버튼 */}
            <button
                type="button"
                onClick={openSite}
                className={[
                    "absolute z-20 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
                    "inline-flex items-center gap-2 px-5 py-2 rounded",
                    "text-[#eed49d] border border-white/30 bg-white/10 hover:bg-white/15",
                    "text-sm md:text-base font-medium transition-opacity duration-200 select-none",
                    revealed ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
                    "md:opacity-0 md:pointer-events-none md:group-hover:opacity-100 md:group-hover:pointer-events-auto",
                ].join(" ")}
            >
                <span className="text-sm md:text-base text-center">
                    <Trans ns="common" i18nKey="apec.button" components={{ br: <br /> }} />
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13.172 12 8.222 7.05l1.414-1.414L16 12l-6.364 6.364-1.414-1.414z" />
                </svg>
            </button>
        </section>
    );
}
