// ProductTile.tsx
import { useRef, useState, useEffect, useCallback } from "react";
import { Trans, useTranslation } from "react-i18next";

type ProductTileProps = {
    className?: string;
    imgSrc: string;
    titleKey: string;
    altKey: string;
    href: string;
};

export default function ProductTile({
    className = "",
    imgSrc,
    titleKey,
    altKey,
    href,
}: ProductTileProps) {
    const { t } = useTranslation("common");
    const [revealed, setRevealed] = useState(false);
    const hideTimer = useRef<number | null>(null);

    const titleRaw = t(titleKey);
    const alt = t(altKey);
    const ariaTitle = titleRaw.replace(/<br\s*\/?>/gi, " ");

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

    // 모바일: 화면 터치로만 토글
    const toggleReveal = useCallback((e?: React.SyntheticEvent) => {
        e?.preventDefault?.();
        e?.stopPropagation?.();
        setRevealed(prev => {
            const next = !prev;
            clearHideTimer();
            if (next) armAutoHide();
            return next;
        });
    }, [armAutoHide, clearHideTimer]);

    const onClickBuy = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        window.open(href, "_blank", "noopener,noreferrer");
        setRevealed(false);
    }, [href]);

    useEffect(() => () => clearHideTimer(), [clearHideTimer]);

    return (
        <div
            className={[
                "group relative w-full h-full overflow-hidden select-none",
                className || "",
            ].join(" ")}
            // 데스크탑: hover로 제어
            onMouseEnter={show}
            onMouseLeave={hide}
            onFocus={show}
            onBlur={hide}
            aria-label={ariaTitle}
        >
            {/* 모바일: 전면 토글 레이어(닫기 버튼 없음) */}
            <button
                type="button"
                aria-label={`${ariaTitle} ${t("purchase.show", "버튼 표시")}`}
                className="md:hidden absolute inset-0 z-10 bg-transparent touch-manipulation"
                onPointerDown={toggleReveal}
            />

            {/* 이미지(바닥 정렬) */}
            <img
                src={imgSrc}
                alt={alt}
                className={[
                    "absolute inset-x-0 bottom-5 w-full h-full object-contain object-bottom",
                    "block transition-transform duration-300 ease-out will-change-transform",
                    "md:group-hover:scale-105",
                    revealed ? "scale-105 md:scale-100" : "scale-100",
                ].join(" ")}
            />

            {/* 어둡게 오버레이 */}
            <div
                className={[
                    "absolute inset-0 transition-colors duration-200 pointer-events-none",
                    revealed ? "bg-black/60" : "bg-transparent",
                    "md:bg-transparent md:group-hover:bg-black/45",
                ].join(" ")}
            />

            {/* 문구 + 구매 버튼*/}
            <div
                className={[
                    "absolute inset-0 z-20 flex items-center justify-center p-6 text-center transition-opacity duration-200",
                    revealed ? "opacity-100" : "opacity-0",
                    "md:opacity-0 md:group-hover:opacity-100",
                ].join(" ")}
            >
                <div className="pointer-events-auto text-[#eed49d] flex flex-col items-center gap-8 md:gap-10">
                    {/* 문구 */}
                    <div className="text-sm md:text-lg font-semibold leading-relaxed">
                        <Trans ns="common" i18nKey={titleKey} components={{ br: <br /> }} />
                    </div>

                    {/* 구매 버튼 */}
                    <button
                        type="button"
                        onClick={onClickBuy}
                        className="inline-flex items-center gap-2 border border-white/30 bg-white/10 px-5 py-2 text-sm md:text-base hover:bg-white/15 transition rounded"
                    >
                        {t("purchase.buy")}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M13.172 12 8.222 7.05l1.414-1.414L16 12l-6.364 6.364-1.414-1.414z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
