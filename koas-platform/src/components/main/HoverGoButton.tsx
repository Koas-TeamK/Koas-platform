// HoverGoButton.tsx
import { type ReactNode, useCallback } from "react";

type HoverGoButtonProps = {
    href: string;
    children: ReactNode;
    target?: "_self" | "_blank";
    className?: string;
    rel?: string;
};

export default function HoverGoButton({
    href,
    children,
    target = "_blank",
    className = "",
}: HoverGoButtonProps) {
    const go = useCallback(() => {
        window.open(href, target, "noopener,noreferrer");
    }, [href, target]);

    return (
        <button
            type="button"
            onClick={go}
            title="클릭하면 이동합니다"
            className={[
                "inline-flex items-center gap-2 rounded-2xl px-5 py-3",
                "text-[#eed49d] border border-white/30 bg-white/10 hover:bg-white/15",
                "font-semibold shadow transition active:scale-[0.98]",
                className,
            ].join(" ")}
        >
            <span className="underline-offset-4">{children}</span>
            <svg
                className="size-4 translate-x-0 transition-transform group-hover:translate-x-0.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
            >
                <path d="M7 17L17 7" />
                <path d="M8 7h9v9" />
            </svg>
        </button>
    );
}
