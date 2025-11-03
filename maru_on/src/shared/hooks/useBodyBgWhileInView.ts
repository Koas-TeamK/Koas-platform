// src/shared/hooks/useBodyBgWhileInView.ts
import { useEffect, useRef } from "react";
import type { RefObject, MutableRefObject } from "react";


type Opt = IntersectionObserverInit;

// RefObject | MutableRefObject 둘 다 받기 + null 허용
type MaybeRef<T> = RefObject<T | null> | MutableRefObject<T | null>;

export function useBodyBgWhileInView<T extends HTMLElement>(
    ref: MaybeRef<T>,
    color: string,
    opt: Opt = { threshold: 0.3 }
) {
    const prevColorRef = useRef<string>("");

    useEffect(() => {
        const el = ref.current;
        if (typeof window === "undefined" || !el) return;

        const apply = () => {
            if (!prevColorRef.current) {
                prevColorRef.current = document.body.style.backgroundColor || "";
            }
            document.body.style.backgroundColor = color;
        };

        const restore = () => {
            document.body.style.backgroundColor = prevColorRef.current;
        };

        const io = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) apply();
            else restore();
        }, opt);

        io.observe(el);
        return () => {
            io.unobserve(el);
            restore();
        };
    }, [ref, color, opt.root, opt.rootMargin, opt.threshold]);
}
