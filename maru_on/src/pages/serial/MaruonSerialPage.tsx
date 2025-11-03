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
                setSerialNum(json?.serial ?? null);
                setDate(json?.createdDate ?? null);
            } catch { }
        })();
    }, [name, serial, token]);

    function formatSerialKeepZeros(v: string | number | null | undefined) {
        if (v == null) return "—";
        const s = String(v).replace(/[０-９]/g, ch =>
            String.fromCharCode(ch.charCodeAt(0) - 0xFF10 + 0x30)
        );
        const m = s.match(/\d+/);
        return m ? m[0] : "—";
    }

    function formatDateYMDDots(v: string | number | null | undefined) {
        if (v == null) return "—";
        const s = String(v).trim();
        let d = new Date(s);
        if (Number.isFinite(Number(s))) d = new Date(Number(s));
        if (!Number.isNaN(d.getTime())) {
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, "0");
            const dd = String(d.getDate()).padStart(2, "0");
            return `${yyyy}.${mm}.${dd}`;
        }
        const m = s.match(/(\d{4})[.\-\/](\d{1,2})[.\-\/](\d{1,2})/);
        if (m) return `${m[1]}.${m[2].padStart(2, "0")}.${m[3].padStart(2, "0")}`;
        return s;
    }

    return (
        <div className="bg-[url('/img/background/background.png')] bg-[length:390px_844px] bg-repeat -mt-20 md:-mt-24 lg:-mt-28">
            <div className="pointer-events-none w-full h-full bg-[url('/img/background/background-log.png')] bg-no-repeat bg-top bg-[length:280px_auto] md:bg-[length:320px_auto] lg:bg-[length:360px_auto]">
                <div className='w-full h-[60px]' />
                <section className="w-full min-h-[80svh] px-6 grid justify-items-center items-center grid-rows-[auto_1fr_auto_1fr_auto]">

                    {/* 로고 */}
                    <img
                        src="/logo/maruon-gold.png"
                        alt="Maruon"
                        className="w-30 md:w-40 lg:w-56 select-none mb-10"
                        decoding="async"
                        loading="lazy"
                    />

                    {/* 문구 */}
                    <div key={i18n.language} className="text-center text-[#eed49d] text-xl">
                        <div>
                            <Trans i18nKey="edition.registeredLine1" ns="common" />
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
                    </div>

                    {/* 의자 */}
                    <img
                        src="/img/chair/high-chair.png"
                        alt="Maruon Chair"
                        className="w-[260px] md:w-[300px] lg:w-[340px] select-none pointer-events-none"
                        decoding="async"
                        loading="lazy"
                    />
                </section>

                {/* 배송예정일 */}
                {date && (
                    <div className="text-center text-[#eed49d] text-xl pb-30">
                        <Trans
                            i18nKey="edition.date"
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
        </div>
    );
}
