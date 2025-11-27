// VideoCover.tsx (핵심: h-dvh → h-full)
import { useEffect, useRef } from "react";

type VideoCoverProps = {
    src: string;
    poster?: string;
    autoPlay?: boolean;
    muted?: boolean;
    loop?: boolean;
    controls?: boolean;
    children?: React.ReactNode;
};

export default function VideoCover({
    src,
    poster,
    autoPlay = true,
    muted = true,
    loop = true,
    controls = false,
    children,
}: VideoCoverProps) {
    const vidRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        const v = vidRef.current;
        if (!v) return;
        v.setAttribute("playsinline", "");
        v.setAttribute("webkit-playsinline", "");
        const tryPlay = () => v.play().catch(() => { });
        v.addEventListener("loadedmetadata", tryPlay, { once: true });
        v.addEventListener("canplay", tryPlay, { once: true });
        return () => {
            v.removeEventListener("loadedmetadata", tryPlay);
            v.removeEventListener("canplay", tryPlay);
        };
    }, []);

    return (
        <div className="relative w-full h-full overflow-hidden">{/* ← h-full */}
            <video
                ref={vidRef}
                className="absolute inset-0 w-full h-full object-cover"
                src={src}
                poster={poster}
                autoPlay={autoPlay}
                muted={muted}
                loop={loop}
                controls={controls}
                playsInline
                preload="auto"
            />
            {children && <div className="relative z-10">{children}</div>}
        </div>
    );
}
