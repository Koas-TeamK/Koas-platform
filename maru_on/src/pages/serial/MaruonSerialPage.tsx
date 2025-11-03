// src/pages/MaruonSerialPage.tsx
import './MaruonSerialPage.module.css'
import { useEffect, useMemo, useState } from "react";
import { parseNameSerialToken } from "@/shared/lib/qr";
import { Trans, useTranslation } from "react-i18next";
import { usePageTheme } from "@/shared/hooks/usePageTheme";

export default function MaruonSerialPage() {
    usePageTheme("#403736");
    const { name, serial, token } = useMemo(() => parseNameSerialToken(), []);
    const { i18n } = useTranslation("common");

    const [serialNum, setSerialNum] = useState<string | number | null>(null);
    const [date, setDate] = useState<string | number | null>(null);

    useEffect(() => {
        if (!name || !serial || !token) return;
        (async () => {
            try {
                const qs = new URLSearchParams({ name, serial, token }).toString();
                const url = `http://13.211.211.70:8080/api/qr/check?${qs}`;
                const res = await fetch(url, { headers: { Accept: "application/json" } });
                if (!res.ok) return;
                const json = await res.json();
                //console.log("[MaruonSeiralPage] qr ", json);
                setSerialNum(json?.serial ?? null);
                setDate(json?.createdDate ?? null);
            } catch {
                // noop
            }
        })();
    }, [name, serial, token]);

    function formatSerialKeepZeros(v: string | number | null | undefined) {
        if (v == null) return "—";
        const s = String(v)
            // 풀폭 숫자 → ASCII 숫자
            .replace(/[０-９]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0xFF10 + 0x30));
        const m = s.match(/\d+/);
        return m ? m[0] : "—";
    }

    // 날짜 포맷
    function formatDateYMDDots(v: string | number | null | undefined) {
        if (v == null) return "—";
        const s = String(v).trim();

        // 1) ISO 또는 타임스탬프 시도
        let d = new Date(s);
        if (Number.isFinite(Number(s))) d = new Date(Number(s)); // epoch(ms) 혹은 숫자 문자열

        // 2) Date가 유효하면 사용
        if (!Number.isNaN(d.getTime())) {
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, "0");
            const dd = String(d.getDate()).padStart(2, "0");
            return `${yyyy}.${mm}.${dd}`;
        }

        // 3) 문자열에서 yyyy-mm-dd / yyyy/mm/dd / yyyy.mm.dd 패턴 추출
        const m = s.match(/(\d{4})[.\-\/](\d{1,2})[.\-\/](\d{1,2})/);
        if (m) {
            const yyyy = m[1];
            const mm = m[2].padStart(2, "0");
            const dd = m[3].padStart(2, "0");
            return `${yyyy}.${mm}.${dd}`;
        }

        // 실패 시 원문 반환
        return s;
    }

    return (
        <div className="relative min-h-[100dvh]">
            {/* 1) 패턴 배경: 뷰포트 고정 (z-0) */}
            <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
                <div className="absolute inset-0 bg-[url('/img/background/background.png')] bg-[length:390px_844px] bg-repeat" />
            </div>

            {/* 2) background-log: 스크롤과 함께 이동 (z-[1]) */}
            <div
                className="
                pointer-events-none absolute inset-x-0 -top-20 z-[1]
                h-[800px]
                bg-[url('/img/background/background-log.png')] bg-no-repeat bg-top
                bg-[length:280px_auto] md:bg-[length:320px_auto] lg:bg-[length:360px_auto]
                "
                aria-hidden
            />

            {/* 3) 본문 */}
            <main
                className="relative z-10 mx-auto w-full max-w-[640px] px-6
                   min-h-[100dvh]
                   pb-[calc(max(env(safe-area-inset-bottom),16px)+160px)]"
            >
                {/* 로고 */}
                <div className="flex justify-center">
                    <img
                        src="/logo/maruon-gold.png"
                        alt="Maruon"
                        className="w-32 md:w-40 lg:w-56 select-none"
                        decoding="async"
                        loading="lazy"
                    />
                </div>

                {/* 문구 */}
                <section
                    key={i18n.language}
                    className="mt-10 text-center text-[#eed49d] text-xl [text-wrap:balance] break-keep">
                    <div>
                        <Trans
                            i18nKey="edition.registeredLine1"
                            ns="common"
                        />
                    </div>
                    <div className="mt-3">
                        <Trans
                            i18nKey="edition.registeredLine2"
                            ns="common"
                            components={{
                                num: (
                                    <span
                                        className="inline-block text-5xl md:text-6xl leading-none tracking-[0.02em]
                             text-transparent bg-clip-text [text-shadow:0_0_0_#e6c981]
                             [-webkit-text-stroke:1px_rgba(0,0,0,.18)]
                             [font-family:'Cinzel',serif]"
                                    >
                                        {formatSerialKeepZeros(serialNum)}
                                    </span>
                                ),
                            }}
                        />
                    </div>
                </section>

                {/* 의자: sticky → 하단 고정, 푸터 영역에서 자연스럽게 밀림 */}
                <div className="h-[300px] md:h-[220px] lg:h-[240px] mb-20">
                    <div className="sticky bottom-[max(env(safe-area-inset-bottom),16px)] flex justify-center">
                        <img
                            src="/img/chair/high-chair.png"
                            alt="Maruon"
                            className="w-[260px] md:w-[300px] lg:w-[340px] select-none pointer-events-none"
                            decoding="async"
                            loading="lazy"
                        />
                    </div>

                    {/* 배송예정일 */}
                    {date && (
                        <div className="text-center text-[#eed49d] text-xl mt-10 mb-10 ">
                            <Trans
                                i18nKey="edition.date" // "Your product is scheduled to ship on <br /> <date/>."
                                ns="common"
                                key={`date-${i18n.language}`}
                                components={{
                                    br: <br />,
                                    date: (
                                        <span
                                            className="inline-block text-4xl leading-[2.2] tracking-[0.02em]
                                            text-transparent bg-clip-text [text-shadow:0_0_0_#e6c981]
                                            [-webkit-text-stroke:1px_rgba(0,0,0,.18)]
                                            [font-family:'Cinzel',serif]"
                                        >
                                            {formatDateYMDDots(date)}
                                        </span>
                                    ),
                                }}
                            />
                        </div>
                    )}
                </div>
            </main >
        </div >
    );
}
