// src/pages/MaruonSerialPage.tsx
import './MaruonSerialPage.module.css'
import { useEffect, useMemo } from "react";
import { parseNameSerialToken } from "@/shared/lib/qr";
import { Trans, useTranslation } from "react-i18next";
import { usePageTheme } from "@/shared/hooks/usePageTheme";
import { qrCheckRequest } from '@/features/serial/serialSlice';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from "@/app/store";

export default function MaruonSerialPage() {
    usePageTheme("#403736");
    const { name, serial, token } = useMemo(() => parseNameSerialToken(), []);
    const { i18n } = useTranslation("common");
    const dispatch = useDispatch();
    const { loading, data } = useSelector((s: RootState) => s.serial);

    // QR 정도 가져오기
    useEffect(() => {
        if (!name || !serial || !token) return;
        dispatch(qrCheckRequest({ name, serial, token }));
    }, [name, serial, token, dispatch]);

    // Num 정규화
    function formatSerialKeepZeros(v: string | number | null | undefined) {
        if (v == null) return "—";
        const s = String(v).replace(/[０-９]/g, ch =>
            String.fromCharCode(ch.charCodeAt(0) - 0xFF10 + 0x30)
        );
        const m = s.match(/\d+/);
        return m ? m[0] : "—";
    }

    if (loading) {
        return;
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
                                            {formatSerialKeepZeros(data?.serial)}
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
            </div>
        </div>
    );
}
