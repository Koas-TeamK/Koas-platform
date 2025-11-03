import PosterPopup from "@/components/PosterPopup"

export default function VideoPage() {
    return (
        <div className="relative min-h-[100svh] overflow-hidden md:h-auto md:min-h-screen md:overflow-y-auto">
            <PosterPopup />
            <div className="fixed top-0 inset-x-0 h-[env(safe-area-inset-top)] bg-[#403736] z-[9999] pointer-events-none"></div>
            {/* 배경 이미지 */}
            <div className="fixed  inset-0 z-0 bg-[url('/img/background3.png')] bg-[length:290px_844px] bg-repeat" />
            {/* 어둡게 오버레이 */}
            <div className="fixed  inset-0 z-0" />

            {/* 콘텐츠 그리드 */}
            <div className="relative z-10 grid grid-rows-[1fr_1fr_2fr] mt-10 p-4">
                {/* 세션1 */}
                <section className="flex items-center justify-center z-10 ">
                    <div className="flex flex-col items-center">
                        <img
                            src="/logo/maruon-logo-gold.png"
                            alt="MARUON"
                            className="w-38 md:w-32 lg:w-36"
                        />
                    </div>
                </section>
                {/* 세션2 */}
                <section className="flex items-center justify-center">
                    <div className="flex flex-col items-center">
                        <div className="text-4xl font-gowun mb-5">
                            ‘다시, 생명으로’
                        </div>
                        <div className="text-base sm:text-lg md:text-2xl font-gowun ">
                            <span className="">대나무 가죽의 숨결</span>과
                        </div>
                        <div className="text-base sm:text-lg md:text-2xl font-gowun ">
                            <span className="">산불피해목의 기억</span>을 담다
                        </div>
                    </div>
                </section>

                {/* 세션3 */}
                <section className="flex items-center flex-col justify-center">
                    <div className="relative w-full max-w-4xl aspect-video">
                        <iframe
                            className="absolute inset-0 w-full h-full"
                            src="https://www.youtube.com/embed/7rk_LtB3kV0?si=CyS6rjgDHAzQduvx"
                            title="YouTube video player"
                            allowFullScreen
                        />
                    </div>
                    <div className="flex flex-col items-center mt-15">
                        <img
                            src="/logo/b-logo.png"
                            alt="MARUON"
                            className="w-20"
                        />
                    </div>
                </section>
            </div>
        </div>
    )
}
