// Footer_qr.tsx

export default function Footer_qr() {
    const KoasLogoUrl = "/logo/koas-gold.png"
    const wechatSrc = "/sns/wechat-gold.png";
    const lineSrc = "/sns/line-gold.png";
    const linkedinSrc = "/sns/linkedin-gold.png";
    const facebookSrc = "/sns/facebook-gold.png";
    return (
        <footer className="w-screen relative z-10 px-4 py-6 bg-[#403736]">
            <div className="flex flex-col mt-2 justify-center items-center text-xs leading-5 sm:mt-4 sm:leading-normal">
                {/* sns 아이콘 */}
                <div className="space-y-1 sm:space-y-2 sm:space-x-4">
                    <p className="text-s text-neutral-600 text-white">CONTACT US</p>
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-center gap-3 sm:gap-6 md:gap-8">
                    {[
                        { src: wechatSrc, alt: "WeChat", href: "https://mp.weixin.qq.com/s/UjTRWkVtEEtINisMMWyxqw" },
                        { src: lineSrc, alt: "LINE", href: "https://line.me/R/ti/p/@761haror" },
                        { src: linkedinSrc, alt: "LinkedIn", href: "https://www.linkedin.com/company/koas/" },
                        { src: facebookSrc, alt: "Facebook", href: "https://www.facebook.com/people/코아스/61568079908788/" }
                    ].map((it) => (
                        <a
                            key={it.alt}
                            href={it.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={it.alt}
                            className="inline-flex items-center justify-center
                         rounded-full p-2 sm:p-2.5 md:p-3
                         hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white/30"
                        >
                            <img
                                src={it.src}
                                alt={it.alt}
                                className="w-9 sm:w-10 md:w-11 aspect-square object-contain select-none"
                                draggable={false}
                            />
                        </a>
                    ))}
                </div>
                {/* 로고 */}
                <img src={KoasLogoUrl} alt="KOAS" className="w-18 inline-block align-middle mt-5" />
                {/* 홈페이지*/}
                <p className="text-s text-[#eed49d] mt-3">www.team-koas.com  |  +82 2 2163 6000</p>
                {/* 저작권 */}
                <div className="space-y-1 sm:space-y-2 sm:space-x-4 mt-2">
                    <p className="text-xs text-neutral-600">Copyright © 2025 KOAS CO., LTD. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
}
