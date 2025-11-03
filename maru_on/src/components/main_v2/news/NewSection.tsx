import { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import {
    newsSummaryRequest,
    selectNews,
} from "@/features/news/newsSlice";
import type { NewsSummary } from "@/features/news/newsSlice";
import { useTranslation, Trans } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "./NewSection.css";
import { useBodyBgWhileInView } from "@/shared/hooks/useBodyBgWhileInView";

export default function NewsSection() {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const summary = useSelector((s: RootState) => selectNews(s));
    const { loading, data, error } = summary;

    useEffect(() => {
        if (!data && !loading && !error) {
            dispatch(newsSummaryRequest());
        }
    }, [data, loading, error, dispatch]);

    // 전환 타이밍
    const DURATION = 900; // ms
    const SHOW_MS = 5000;

    // 데이터/상태
    const list: NewsSummary = data ?? [];
    const [idx, setIdx] = useState(0);

    // 슬라이드 제어
    // direction: 1(다음으로 왼쪽 슬라이드) / -1(이전으로 오른쪽 슬라이드)
    const [direction, setDirection] = useState<1 | -1>(1);
    const [isSliding, setIsSliding] = useState(false);
    const [noTrans, setNoTrans] = useState(false); // 리셋 시 transition 끄기

    const len = list.length;
    const nextIdx = len ? (idx + 1) % len : 0;
    const prevIdx = len ? (idx - 1 + len) % len : 0;

    // 현재 화면에 보이는 기사 인덱스(슬라이드 중이면 target이 보임)
    const targetIdx = direction === 1 ? nextIdx : prevIdx;
    const activeIdx = isSliding ? targetIdx : idx;

    // 자동 슬라이드 타이머
    useEffect(() => {
        if (len <= 1) return;
        const t = setTimeout(() => {
            if (!isSliding) {
                setDirection(1);
                setIsSliding(true);
            }
        }, SHOW_MS);
        return () => clearTimeout(t);
    }, [idx, isSliding, len]);

    // 슬라이드 종료 → 인덱스 확정 + transition 없이 트랙을 초기 위치로 리셋
    useEffect(() => {
        if (!isSliding) return;
        const t = setTimeout(() => {
            // 1) transition 잠깐 끄기
            setNoTrans(true);
            // 2) 콘텐츠 인덱스 확정
            setIdx(targetIdx);
            // 3) 트랙 위치 원복(기본 위치로)
            setIsSliding(false);
            // 4) 다음 프레임에 transition 다시 켜기
            requestAnimationFrame(() => {
                requestAnimationFrame(() => setNoTrans(false));
            });
        }, DURATION);
        return () => clearTimeout(t);
    }, [isSliding, targetIdx]);

    // 임시 이미지
    const tempImg = "/img/temp/koas.avif";

    // 다음/이전 썸네일 미리 디코드(이미지 로딩으로 인한 끊김 최소화)
    useEffect(() => {
        const url = list[targetIdx]?.thumbnailUrl;
        if (!url) return;
        const img = new Image();
        img.src = url;
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        img.decode?.().catch(() => {/* ignore */ });
    }, [targetIdx, list]);

    // ─────────────────────────────────────────────────────────────
    // 링크 이동: 외부면 새창, 내부면 navigate
    const isExternal = (href?: string) => !!href && /^https?:\/\//i.test(href);
    const goDetail = (href?: string) => {
        if (!href) return;
        if (isExternal(href)) {
            window.open(href, "_blank", "noopener,noreferrer");
        } else {
            navigate(href);
        }
    };
    // ─────────────────────────────────────────────────────────────

    // 홈페이지 (새 창)
    const openHomepage = useCallback(() => {
        window.open("https://www.ikoas.com/news/", "_blank", "noopener,noreferrer");
    }, []);

    //body
    const sectionRef = useRef<HTMLElement | null>(null);
    useBodyBgWhileInView(sectionRef, "#afa49d");

    // 수동 제어 (중복 트리거 방지)
    const canSlide = len > 1 && !isSliding;

    const goNext = useCallback(() => {
        if (!canSlide) return;
        setDirection(1);
        setIsSliding(true);
    }, [canSlide]);

    const goPrev = useCallback(() => {
        if (!canSlide) return;
        setDirection(-1);
        setIsSliding(true);
    }, [canSlide]);

    // 키보드 좌/우
    const cardRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        const el = cardRef.current;
        if (!el) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") goNext();
            if (e.key === "ArrowLeft") goPrev();
        };
        el.addEventListener("keydown", onKey);
        return () => el.removeEventListener("keydown", onKey);
    }, [goNext, goPrev]);

    // 트랙 위치: 방향에 따라 기본 위치/슬라이딩 위치 다르게
    // direction === 1 (다음): [현재 | 타겟], 기본은 0 → 슬라이드 시 -1/2
    // direction === -1(이전): [타겟 | 현재], 기본은 -1/2 → 슬라이드 시 0
    const baseTranslate = direction === 1 ? "translate-x-0" : "-translate-x-1/2";
    const slidingTranslate = direction === 1 ? "-translate-x-1/2" : "translate-x-0";

    // 패널 렌더 순서
    const leftPanelIdx = direction === 1 ? idx : targetIdx;
    const rightPanelIdx = direction === 1 ? targetIdx : idx;

    return (
        <section className="w-full h-full flex flex-col lg:flex-row bg-[#afa49d]" ref={sectionRef}>
            {/* 왼쪽: News 설명 문구 */}
            <div className="
                w-full lg:w-1/2 h-full
                flex flex-col items-center justify-center lg:items-start lg:justify-center 
                lg:pl-20 gap-y-4
                mt-10 lg:mt-0
                text-[#403736]
            ">
                <div className="
                    2xl:text-8xl xl:text-7xl lg:text-6xl md:text-5xl text-3xl
                    text-center sm:text-left font-bold tracking-[-0.02em]
                ">
                    KOAS News
                </div>
                <div>
                    <Trans ns="common" i18nKey="news.desc" components={{ br: <br /> }} />
                </div>
                <div className="flex lg:mt-5">
                    <button
                        type="button"
                        className="catalog-button"
                        onClick={openHomepage}
                    >
                        <p data-text={t("news.button", "Open News")}>
                            {t("news.button", "Open News")}
                        </p>
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* 오른쪽: 실제 뉴스 */}
            <div className="
                w-full lg:w-1/2 h-full
                lg:mr-[10rem]
                flex items-center justify-center lg:justify-start
            ">
                {/* 뉴스 내용 */}
                {!loading && list.length > 0 && (
                    <div
                        ref={cardRef}
                        className="
                            relative lg:w-[100%] w-[92%]
                            overflow-hidden
                            min-h-[260px] md:min-h-[320px] lg:min-h-[380px]
                            mb-10 lg:mb-3
                            cursor-pointer
                            flex flex-col justify-center
                            bg-white/80 rounded-md
                            px-5 py-10
                            outline-none
                            tracking-[-0.02em]
                            shadow-lg shadow-black/50
                            overflow-hidden
                        "
                        role="button"
                        tabIndex={0}
                        onClick={() => goDetail(list[activeIdx]?.link)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") goDetail(list[activeIdx]?.link);
                        }}
                    >
                        {/* 트랙(200%) */}
                        <div
                            className={[
                                "flex w-[200%] will-change-transform transform-gpu ",
                                noTrans
                                    ? "transition-none"
                                    : "transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                                isSliding ? slidingTranslate : baseTranslate,
                            ].join(" ")}
                        >
                            {/* 왼쪽 패널 */}
                            <Panel
                                item={list[leftPanelIdx]}
                                tempImg={tempImg}
                            />
                            {/* 오른쪽 패널 */}
                            <Panel
                                item={list[rightPanelIdx]}
                                tempImg={tempImg}
                            />
                        </div>

                        {/* ← → 화살표 (접근성 + 모바일 탭 영역 넉넉히) */}
                        {len > 1 && (
                            <>
                                <ArrowButton
                                    side="left"
                                    onClick={(e) => { e.stopPropagation(); goPrev(); }}
                                    disabled={!canSlide}
                                />
                                <ArrowButton
                                    side="right"
                                    onClick={(e) => { e.stopPropagation(); goNext(); }}
                                    disabled={!canSlide}
                                />
                            </>
                        )}
                    </div>
                )}

                {/* 로딩 */}
                {loading && (
                    <ul className="space-y-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <li key={i} className="animate-pulse rounded-lg border border-white/15 p-4">
                                <div className="flex gap-3">
                                    <div className="h-16 w-24 bg-white/10 rounded" />
                                    <div className="flex-1">
                                        <div className="h-4 w-3/5 bg-white/10 rounded mb-2" />
                                        <div className="h-3 w-2/5 bg-white/10 rounded" />
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                {/* 빈 상태 */}
                {!loading && list.length === 0 && !error && (
                    <div className="rounded-md border border-white/15 p-4 text-sm opacity-80">
                        표시할 뉴스가 없습니다.
                    </div>
                )}
            </div>
        </section>
    );
}

function Panel({ item, tempImg }: { item: NewsSummary[number] | undefined, tempImg: string }) {
    return (
        <div className="w-1/2 px-3 md:px-5">
            <article
                className="
                    grid min-w-0 grid-rows-[auto_auto_auto] gap-4
                    justify-items-center text-center
                    lg:justify-items-start lg:text-left
                    h-full
                "
            >
                {/* 이미지 고정비율 */}
                <div className="w-full aspect-[16/9] overflow-hidden rounded">
                    <img
                        src={(item?.thumbnailUrl ?? tempImg)}
                        alt={item?.title ?? ""}
                        className="w-full h-full object-cover"
                        draggable={false}
                    />
                </div>
                {/* 경계선 */}
                <div className="my-3 h-px w-full bg-black/20" aria-hidden />
                {/* 제목 */}
                <h3
                    className="
                        text-[#403736]
                        2xl:text-4xl xl:text-3xl lg:text-2xl md:text-xl text-base
                        leading-snug line-clamp-2 font-bold
                        min-h-[3.25rem] md:min-h-[3.6rem] lg:min-h-[3.8rem]
                    "
                >
                    {item?.title}
                </h3>
                {/* 날짜 */}
                <div className="text-black/25 leading-6 min-h-[1.5rem]">
                    {formatDateSafe(item?.date ?? "")}
                </div>
            </article>
        </div>
    );
}

function ArrowButton({
    side,
    onClick,
    disabled,
}: {
    side: "left" | "right";
    onClick: (e: React.MouseEvent) => void;
    disabled?: boolean;
}) {
    const isLeft = side === "left";
    return (
        <button
            type="button"
            aria-label={isLeft ? "Previous news" : "Next news"}
            onClick={onClick}
            disabled={disabled}
            className={[
                "group absolute top-1/2 -translate-y-1/2",
                isLeft ? "left-2" : "right-2",
                "h-6 w-6 rounded-full bg-black/35 hover:bg-black/50",
                "backdrop-blur-sm text-white",
                "grid place-items-center",
                "transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-white/60",
            ].join(" ")}
        >
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                className="h-5 w-5"
            >
                {isLeft ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                )}
            </svg>
        </button>
    );
}

function formatDateSafe(v: string) {
    const d = new Date(v);
    if (!isNaN(d.getTime())) return d.toLocaleDateString();
    return v;
}
