// src/components/news/NewsSection.tsx
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
import "./NewSection.css"
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
    const DURATION = 900;   // 더 부드럽게
    const SHOW_MS = 5000;

    // 데이터/상태
    const list: NewsSummary = data ?? [];
    const [idx, setIdx] = useState(0);
    const [isSliding, setIsSliding] = useState(false);
    const [noTrans, setNoTrans] = useState(false); // 리셋 시 transition 끄기
    const nextIdx = list.length ? (idx + 1) % list.length : 0;

    // 5초 대기 후 슬라이드 시작
    useEffect(() => {
        if (list.length <= 1) return;
        const t = setTimeout(() => setIsSliding(true), SHOW_MS);
        return () => clearTimeout(t);
    }, [idx, list.length]);

    // 슬라이드 종료 → 인덱스 확정 + transition 없이 트랙을 0으로 리셋
    useEffect(() => {
        if (!isSliding) return;
        const t = setTimeout(() => {
            // 1) transition 잠깐 끄기
            setNoTrans(true);
            // 2) 콘텐츠 다음으로 확정
            setIdx(nextIdx);
            // 3) 트랙 위치 원복(translate-x-0 상태가 되도록)
            setIsSliding(false);
            // 4) 다음 프레임에 transition 다시 켜기(깜빡임 방지용 두 번의 RAF)
            requestAnimationFrame(() => {
                requestAnimationFrame(() => setNoTrans(false));
            });
        }, DURATION);
        return () => clearTimeout(t);
    }, [isSliding, nextIdx]);

    // 임시 이미지
    const tempImg = "/img/temp/koas.avif"

    // 다음 썸네일 미리 디코드(이미지 로딩으로 인한 끊김 최소화)
    useEffect(() => {
        const url = list[nextIdx]?.thumbnailUrl;
        if (!url) return;
        const img = new Image();
        img.src = url;
        // modern 브라우저는 decode 제공
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        img.decode?.().catch(() => {/* ignore */ });
    }, [nextIdx, list]);

    // ─────────────────────────────────────────────────────────────
    // 링크 이동: 외부면 새창, 내부면 navigate
    const isExternal = (href?: string) => !!href && /^https?:\/\//i.test(href);
    const goDetail = (href?: string) => {
        if (!href) return;
        if (isExternal(href)) {
            window.open(href, "_blank", "noopener,noreferrer"); // 새창
        } else {
            navigate(href);
        }
    };
    // 현재 화면에 보이는 기사(슬라이드 중이면 next가 보임)
    const activeIdx = isSliding ? nextIdx : idx;
    // ─────────────────────────────────────────────────────────────

    // 홈페이지 (새 창)
    const openHomepage = useCallback(() => {
        window.open("https://www.ikoas.com/news/", "_blank", "noopener,noreferrer");
    }, []);

    //body
    const sectionRef = useRef<HTMLElement | null>(null);
    useBodyBgWhileInView(sectionRef, "#afa49d");

    return (
        <section className="w-full h-full flex flex-col lg:flex-row bg-[#afa49d]" ref={sectionRef}>
            {/* 왼쪽: News 설명 문구 */}
            <div className="
                w-full lg:w-1/2 h-full
                flex flex-col items-center justify-center lg:items-start lg:justify-center 
                lg:pl-20 gap-y-4
                text-[#403736]
                //border border-red-500
            ">
                <div className="
                    2xl:text-8xl xl:text-7xl lg:text-6xl md:text-5xl text-4xl
                    text-center sm:text-left font-bold
                ">
                    Koas News
                </div>
                <div>
                    <Trans ns="common" i18nKey="news.desc" components={{ br: <br /> }} />
                </div>
                <div className="flex">
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
                //border border-red-500
            ">
                {/* 뉴스 내용 */}
                {!loading && list.length > 0 && (
                    <div
                        className="
                            relative lg:w-[100%] w-[92%]
                            overflow-hidden
                            min-h-[260px] md:min-h-[320px] lg:min-h-[380px]
                            mb-10 lg:mb-3
                            cursor-pointer
                            flex flex-col justify-center
                            //border border-white
                        "
                        role="button"
                        tabIndex={0}
                        onClick={() => goDetail(list[activeIdx]?.link)}
                        onKeyDown={(e) => e.key === "Enter" && goDetail(list[activeIdx]?.link)}
                    >
                        {/* 트랙(200%)을 좌우로 이동시켜 전환 */}
                        <div
                            className={[
                                "flex w-[200%] will-change-transform transform-gpu",
                                noTrans
                                    ? "transition-none"
                                    : "transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                                isSliding ? "-translate-x-1/2" : "translate-x-0",
                            ].join(" ")}
                        >
                            {/* 패널 1: 현재 기사 */}
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
                                            src={(list[idx]?.thumbnailUrl ?? tempImg)}
                                            alt={list[idx]?.title ?? ""}
                                            className="w-full h-full object-cover"
                                            draggable={false}
                                        />
                                    </div>
                                    {/* 제목: 2줄 기준 최소 높이 */}
                                    <h3
                                        className="
                                            text-[#403736]
                                            2xl:text-4xl xl:text-3xl lg:text-2xl md:text-xl text-base
                                            leading-snug line-clamp-2
                                            min-h-[3.25rem] md:min-h-[3.6rem] lg:min-h-[3.8rem]
                                        "
                                    >
                                        {list[idx]?.title}
                                    </h3>
                                    {/* 날짜 */}
                                    <div className="text-black/25 leading-6 min-h-[1.5rem]">
                                        {formatDateSafe(list[idx]?.date ?? "")}
                                    </div>
                                </article>
                            </div>

                            {/* 패널 2: 다음 기사 (오른쪽에 대기) */}
                            <div className="w-1/2 px-3 md:px-5">
                                <article
                                    className="
                                        grid min-w-0 grid-rows-[auto_auto_auto] gap-4
                                        justify-items-center text-center
                                        lg:justify-items-start lg:text-left
                                        h-full
                                    "
                                >
                                    <div className="w-full aspect-[16/9] overflow-hidden rounded">
                                        <img
                                            src={(list[nextIdx]?.thumbnailUrl ?? tempImg)}
                                            alt={list[nextIdx]?.title ?? ""}
                                            className="w-full h-full object-cover"
                                            draggable={false}
                                        />
                                    </div>
                                    <h3
                                        className="
                                                text-[#403736]
                                                2xl:text-4xl xl:text-3xl lg:text-2xl md:text-xl text-base
                                                leading-snug line-clamp-2
                                                min-h-[3.25rem] md:min-h-[3.6rem] lg:min-h-[3.8rem]
                                            "
                                    >
                                        {list[nextIdx]?.title}
                                    </h3>
                                    <div className="text-black/25 leading-6 min-h-[1.5rem]">
                                        {formatDateSafe(list[nextIdx]?.date ?? "")}
                                    </div>
                                </article>
                            </div>
                        </div>
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
        </section >
    );
}

function formatDateSafe(v: string) {
    const d = new Date(v);
    if (!isNaN(d.getTime())) return d.toLocaleDateString();
    return v;
}
