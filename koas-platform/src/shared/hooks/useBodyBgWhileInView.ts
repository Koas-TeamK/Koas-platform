import { useEffect } from "react";

type Opts = IntersectionObserverInit & { immediate?: boolean };

// 전역 스택: 가장 마지막이 현재 색
const colorStack: Array<{ key: string; color: string }> = [];

function applyTop() {
    const top = colorStack[colorStack.length - 1];
    const color = top?.color ?? "";
    // 변수와 인라인을 함께 써서 우선순위/트랜지션 모두 만족
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

        // 스크롤 컨테이너 자동 추론 (main이 스크롤이면 거기를 root로)
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
                    // 내 색을 스택에 푸시 (중복 방지)
                    if (!colorStack.find((c) => c.key === key)) {
                        colorStack.push({ key, color });
                        applyTop();
                    }
                } else {
                    // 뷰에서 벗어나면 스택에서 제거하고 복구
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

        // 옵션: 마운트하자마자 강제 적용(섹션이 이미 보이는 상태일 때 대비)
        if (opts?.immediate) {
            colorStack.push({ key, color });
            applyTop();
            // 다음 프레임에 관찰 상태로 정리(중복 방지)
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
            // 언마운트 시 내 항목 제거 + 복구
            const i = colorStack.findIndex((c) => c.key === key);
            if (i >= 0) {
                colorStack.splice(i, 1);
                applyTop();
            }
        };
    }, [ref, color, opts]);
}
