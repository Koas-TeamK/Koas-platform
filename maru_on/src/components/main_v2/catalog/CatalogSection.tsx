import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useTranslation, Trans } from "react-i18next";
import { motion, type Variants, type Transition } from "framer-motion";
import "./CatalogSection.css";

export default function CatalogSection({ lang }: { lang: string }) {
    const { t } = useTranslation("common");

    // 언어별 pdf
    const pdfHref = useMemo(() => {
        const map: Record<string, "(ko)" | "(en)" | "(zh)"> = { ko: "(ko)", en: "(en)", zh: "(zh)" };
        const prefix = lang?.toLowerCase().split("-")[0] || "en";
        const suffix = map[prefix] ?? "(en)";
        return encodeURI(`/catalog/maruon_catalog${suffix}.pdf`);
    }, [lang]);

    // 언어별 이미지
    const imgSrc = useMemo(() => {
        const map: Record<string, "(ko)" | "(en)" | "(zh)"> = { ko: "(ko)", en: "(en)", zh: "(zh)" };
        const prefix = lang?.toLowerCase().split("-")[0] || "en";
        const suffix = map[prefix] ?? "(en)";
        return encodeURI(`/img/catalog/catalog${suffix}.png`);
    }, [lang]);

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

    const onTouch = useCallback(() => {
        !revealed ? show() : hide();
    }, [revealed, show, hide]);

    const openPdf = useCallback(() => {
        window.open(pdfHref, "_blank", "noopener,noreferrer");
        hide();
    }, [pdfHref, hide]);

    useEffect(() => () => clearHideTimer(), [clearHideTimer]);

    /* ========= 모션 타입 안전 설정 ========= */
    const softEase: Transition = {
        duration: 1.2,
        ease: "easeInOut", // 커브 배열 쓰려면: ease: [0.16, 1, 0.3, 1] as any
    };

    const container: Variants = {
        hidden: {},
        show: {
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2,
            },
        },
    };

    const fadeUp: Variants = {
        hidden: { opacity: 0, y: 20 },
        show: {
            opacity: 1,
            y: 0,
            transition: softEase,
        },
    };

    return (
        <section className="w-full h-full">
            <div className="
                group relative w-full h-full overflow-hidden z-0 
                bg-cover bg-no-repeat 
                2xl:bg-[position:40%_50%]  lg:bg-[position:40%_50%] md:bg-[position:50%_30%] sm:bg-[position:50%_50%] bg-[position:50%_30%] 
                2xl:bg-size-[auto_2800px] lg:bg-size-[auto_2400px] md:bg-size-[auto_2000px] sm:bg-size-[auto_1600px] bg-size-[auto_1200px] 
                transition-[background-position] duration-500
            "
                style={{ backgroundImage: `url("${imgSrc}")` }}
                onMouseEnter={show}
                onMouseLeave={hide}
                onFocus={show}
                onBlur={hide}
                onTouchStart={onTouch}
            >
                <motion.div
                    className="
                    flex flex-col lg:w-1/2 lg:h-full text-[#403736]
                    justify-center items-center sm:items-start 
                    lg:ml-25 sm:ml-10
                    mt-5 lg:mt-5
                    //border border-red-500
                "
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: false, amount: 0.35 }}
                >
                    <motion.h1
                        variants={fadeUp}
                        className="
                        lg:text-8xl md:text-8xl text-6xl
                        text-center sm:text-left font-bold
                        mt-20 lg:mt-0
                        "
                    >
                        Cat.
                    </motion.h1>

                    <motion.div variants={fadeUp} className="hidden sm:flex mt-7">
                        <Trans ns="common" i18nKey="catalog.desc" components={{ br: <br /> }} />
                    </motion.div>

                    <motion.div variants={fadeUp} className="md:hidden mt-5">
                        <Trans ns="common" i18nKey="catalog.descM" components={{ br: <br /> }} />
                    </motion.div>

                    <motion.div variants={fadeUp} className="sm:mt-10 mt-5">
                        <motion.button
                            whileTap={{ scale: 0.97 }}
                            whileHover={{ x: 2 }}
                            onClick={openPdf}
                            className="catalog-button"
                        >
                            <p data-text={t("catalog.open", "Open Catalog")}>
                                {t("catalog.open", "Open Catalog")}
                            </p>
                            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </motion.button>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
