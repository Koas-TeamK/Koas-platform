// src/components/main/ApecSection.tsx
import { useEffect, useRef, useCallback, useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import "./ApecSection.css";
import { useBodyBgWhileInView } from "@/shared/hooks/useBodyBgWhileInView";

export default function ApecSection({ lang }: { lang: string }) {
    const HREF = "/leaflet/apec%20leaflet.pdf";
    const { t } = useTranslation();

    const [showMobileBtn, setShowMobileBtn] = useState(false);
    const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // body
    const sectionRef = useRef<HTMLElement | null>(null);
    useBodyBgWhileInView(sectionRef, "#1E2950");

    const clearHideTimer = useCallback(() => {
        if (hideTimer.current) {
            clearTimeout(hideTimer.current);
            hideTimer.current = null;
        }
    }, []);

    const isBelowLg = () => window.matchMedia("(max-width: 1023.98px)").matches;

    const onSectionClick = useCallback(() => {
        if (!isBelowLg()) return;
        if (showMobileBtn) {
            clearHideTimer();
            setShowMobileBtn(false);
        } else {
            setShowMobileBtn(true);
            clearHideTimer();
            hideTimer.current = setTimeout(() => setShowMobileBtn(false), 2500);
        }
    }, [showMobileBtn, clearHideTimer]);

    const openSite = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        window.open(HREF, "_blank", "noopener,noreferrer");
    }, []);

    useEffect(() => () => clearHideTimer(), [clearHideTimer]);

    const imgSrc = useMemo(() => {
        const prefix = lang?.toLowerCase().split("-")[0] || "en";
        const map: Record<string, "(ko)" | "(en)" | "(zh)"> = { ko: "(ko)", en: "(en)", zh: "(zh)" };
        const suffix = map[prefix] ?? "(en)";
        return encodeURI(`/img/apec/apec${suffix}.png`);
    }, [lang]);

    return (
        <section
            onClick={onSectionClick}
            className={[
                "relative w-full min-h-[100svh]  overflow-hidden [overflow:clip]",
                "bg-[#1E2950]",
            ].join(" ")}
            aria-label="APEC Leaflet Section"
            id="apec-section"
            ref={sectionRef}
        >
            {/* 배경: 단청 (뒤로) */}
            <div
                className="absolute inset-0 z-10 bg-no-repeat pointer-events-none"
                style={{
                    backgroundImage: "url('/img/apec/danchung.png')",
                    backgroundPosition: "center -400px", // ← 위쪽 200px 잘림
                }}
            ></div>

            {/* 내용 */}
            <div
                className="
          w-full min-h-[100svh]
          grid lg:grid-cols-2 grid-cols-1
          place-items-center
        "
            >
                {/* 왼쪽: 문구 이미지 — lg 미만에서 화면 정중앙 */}
                <div className="w-full h-full grid place-items-center">
                    <div
                        className="
              w-full
              2xl:w-[60rem] lg:w-[50rem] md:w-[40rem] sm:w-[30rem]
              aspect-[16/9]
              bg-no-repeat bg-contain bg-center
            "
                        style={{ backgroundImage: `url("${imgSrc}")` }}
                        aria-label="APEC Slogan"
                    />
                </div>

                {/* 오른쪽: 버튼 — lg 미만에서는 컬럼 자체 제거 */}
                <div className="hidden lg:grid w-full h-full place-items-center p-4">
                    <button type="button" onClick={openSite} className="apec-button flex">
                        <p className="text-sm md:text-base text-center" data-text={t("apec.button", "View Leaflet")}>
                            <Trans ns="common" i18nKey="apec.button" components={{ br: <br /> }} />
                        </p>
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* 모바일(<lg): 버튼은 화면 중앙에 띄우고, 배경 어둡게 */}
            {showMobileBtn && (
                <>
                    <div
                        className="fixed inset-0 lg:hidden bg-black/60 z-40 transition-opacity duration-300"
                        onClick={(e) => {
                            e.stopPropagation();
                            clearHideTimer();
                            setShowMobileBtn(false);
                        }}
                    />
                    <div className="lg:hidden fixed inset-0 z-50 grid place-items-center">
                        <button type="button" onClick={openSite} className="apec-button flex">
                            <p className="text-sm text-center" data-text={t("apec.button", "View Leaflet")}>
                                <Trans ns="common" i18nKey="apec.button" />
                            </p>
                            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </>
            )}
        </section>
    );
}
