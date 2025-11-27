import { useEffect } from "react";

type Opts = IntersectionObserverInit & { immediate?: boolean };

const colorStack: Array<{ key: string; color: string }> = [];

function applyTop() {
    const top = colorStack[colorStack.length - 1];
    const color = top?.color ?? "";
    document.documentElement.style.setProperty("--body-bg", color || "transparent");
    document.body.style.backgroundColor = color;
}

export function useBodyBgWhileInView(
    ref: React.RefObject<HTMLElement | null>,
    color: string,
    opts?: Opts
) {
    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const getScrollParent = (n: HTMLElement | null): Element | null => {
            let p = n?.parentElement;
            while (p) {
                const s = getComputedStyle(p);
                if (/(auto|scroll|overlay)/.test(s.overflow + s.overflowY + s.overflowX)) return p;
                p = p.parentElement;
            }
            return null;
        };
        const root = (opts?.root as Element) ?? getScrollParent(el) ?? null;
        const threshold = opts?.threshold ?? 0.3;

        const key = `${Date.now()}_${Math.random().toString(36).slice(2)}`;

        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    if (!colorStack.find((c) => c.key === key)) {
                        colorStack.push({ key, color });
                        applyTop();
                    }
                } else {
                    const i = colorStack.findIndex((c) => c.key === key);
                    if (i >= 0) {
                        colorStack.splice(i, 1);
                        applyTop();
                    }
                }
            },
            { root, threshold, rootMargin: opts?.rootMargin }
        );

        io.observe(el);

        if (opts?.immediate) {
            colorStack.push({ key, color });
            applyTop();
            requestAnimationFrame(() => {
                const i = colorStack.findIndex((c) => c.key === key);
                if (i >= 0) {
                    colorStack.splice(i, 1);
                    applyTop();
                }
            });
        }

        return () => {
            io.disconnect();
            const i = colorStack.findIndex((c) => c.key === key);
            if (i >= 0) {
                colorStack.splice(i, 1);
                applyTop();
            }
        };
    }, [ref, color, opts]);
}
