import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import Lenis from "lenis";
import type { ScrollCallback } from "lenis";

type SmoothScrollOptions = {
    wrapperRef: RefObject<HTMLElement | null>;
    contentRef?: RefObject<HTMLElement | null>;
    enabled?: boolean;
    duration?: number;
    lerp?: number;
    syncTouch?: boolean;
    onScroll?: ScrollCallback;
};

const defaultDuration = 1.15;
const defaultLerp = 0.085;

function getContentElement(wrapper: HTMLElement, content?: HTMLElement | null) {
    if (content) return content;
    return wrapper.firstElementChild instanceof HTMLElement ? wrapper.firstElementChild : wrapper;
}

export function useLenisScroll({
    wrapperRef,
    contentRef,
    enabled = true,
    duration = defaultDuration,
    lerp = defaultLerp,
    syncTouch = true,
    onScroll,
}: SmoothScrollOptions) {
    const lenisRef = useRef<Lenis | null>(null);
    const onScrollRef = useRef(onScroll);

    useEffect(() => {
        onScrollRef.current = onScroll;
    }, [onScroll]);

    useEffect(() => {
        const wrapper = wrapperRef.current;
        if (!enabled || !wrapper) return;

        const lenis = new Lenis({
            wrapper,
            content: getContentElement(wrapper, contentRef?.current),
            autoRaf: true,
            duration,
            lerp,
            smoothWheel: true,
            syncTouch,
            anchors: {
                duration,
            },
            prevent: (node) => Boolean(node.closest("[data-lenis-prevent]")),
        });

        lenisRef.current = lenis;
        const unsubscribe = lenis.on("scroll", (instance) => {
            onScrollRef.current?.(instance);
        });

        const resizeFrame = window.requestAnimationFrame(() => lenis.resize());

        return () => {
            window.cancelAnimationFrame(resizeFrame);
            unsubscribe();
            lenis.destroy();
            if (lenisRef.current === lenis) lenisRef.current = null;
        };
    }, [contentRef, duration, enabled, lerp, syncTouch, wrapperRef]);

    return lenisRef;
}
