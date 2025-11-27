// src/components/SnsFab.tsx
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleSns, closeSns } from "@/features/ui/uiSlice";
import type { RootState } from "@/app/store";

export default function SnsFab() {
    const dispatch = useDispatch();
    const open = useSelector((s: RootState) => s.ui.snsOpen);
    const wrapRef = useRef<HTMLDivElement>(null);

    const wechatSrc = "/sns/wechat-main.png";
    const lineSrc = "/sns/line-main.png";
    const linkedinSrc = "/sns/linkedin-main.png";
    const facebookSrc = "/sns/facebook-main.png";

    useEffect(() => {
        const onDocClick = (e: MouseEvent) => {
            if (!open) return;
            if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) dispatch(closeSns());
        };
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") dispatch(closeSns()); };
        document.addEventListener("mousedown", onDocClick);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onDocClick);
            document.removeEventListener("keydown", onKey);
        };
    }, [open, dispatch]);

    return (
        <nav aria-label="Contact quick panel" className="fixed z-[90] right-0 bottom-15">
            <div ref={wrapRef} className="relative">
                {/* 아이콘: 세로로 위로 */}
                <div
                    id="sns-pop"
                    aria-hidden={!open}
                    className={`absolute right-3 bottom-[calc(100%+12px)]
                      flex flex-col items-end gap-5
                      ${open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-2 pointer-events-none"}
                      transition-all duration-200`}
                >
                    {[
                        { src: wechatSrc, alt: "WeChat", href: "https://mp.weixin.qq.com/s/UjTRWkVtEEtINisMMWyxqw" },
                        { src: lineSrc, alt: "LINE", href: "https://line.me/R/ti/p/@761haror" },
                        { src: linkedinSrc, alt: "LinkedIn", href: "https://www.linkedin.com/company/koas/" },
                        { src: facebookSrc, alt: "Facebook", href: "https://www.facebook.com/people/코아스/61568079908788/" }
                    ]
                        .map(({ src, alt, href }) => (
                            <a
                                key={alt}
                                href={href}
                                title={alt}
                                target="_blank"
                                rel="noopener noreferrer"
                                tabIndex={open ? 0 : -1}
                                className="inline-block">
                                <img src={src} alt={alt}
                                    className="
                                    w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 
                                    object-contain transition-transform hover:scale-105 active:scale-80
                                    filter [filter:drop-shadow(0_0_10px_#fff)]
                                    " />
                            </a>
                        ))}
                </div>

                <button
                    aria-controls="sns-pop"
                    aria-expanded={open}
                    aria-label={open ? "닫기" : "연락하기 열기"}
                    onClick={() => dispatch(toggleSns())}
                    className="group bg-white/95  px-4 py-3 text-right
                     hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)] focus:outline-none focus:ring-2 focus:ring-black/10
                     !rounded-none"
                    style={{ borderRadius: 0 }}
                >
                    <div className="flex items-center gap-3">
                        <span className="hidden md:block h-8 w-[3px] bg-black/80" />
                        <div className="leading-tight">
                            <div className="text-[12px] font-semibold tracking-wide text-black">CONTACT&nbsp;US</div>
                        </div>
                    </div>
                </button>
            </div>
        </nav>
    );
}
