import { useState, useEffect } from "react";

/**
 * 특정 섹션(id 기반)이 화면에 일정 비율 이상 보일 때 감지하는 Hook
 * @param id 감지할 섹션의 DOM id
 * @param threshold 화면에서 보여야 하는 비율 (기본값 0.4)
 * @returns boolean — 섹션이 현재 보이면 true
 */
export function useSectionVisible(id: string, threshold: number = 0.4) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const target = document.getElementById(id);
        if (!target) return;

        const observer = new IntersectionObserver(
            ([entry]) => setIsVisible(entry.isIntersecting),
            { threshold }
        );

        observer.observe(target);
        return () => observer.disconnect();
    }, [id, threshold]);

    return isVisible;
}
