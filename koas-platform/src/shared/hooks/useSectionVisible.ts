import { useState, useEffect } from "react";

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
