import { useEffect, useRef } from "react";
import type { RefObject } from "react";

type SwipeDirection = "up" | "down" | "left" | "right";

type SwipeNavigationOptions = {
    enabled?: boolean;
    targetRef?: RefObject<HTMLElement | null>;
    minDistance?: number;
    ignoreSelector?: string;
    onSwipeUp?: () => void;
    onSwipeDown?: () => void;
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
};

type TouchStart = {
    x: number;
    y: number;
    target: EventTarget | null;
};

const defaultMinDistance = 58;

function isIgnoredTarget(target: EventTarget | null, ignoreSelector?: string) {
    if (!(target instanceof Element)) return false;

    if (ignoreSelector && target.closest(ignoreSelector)) return true;

    return Boolean(
        target.closest(
            "a, button, input, textarea, select, option, [contenteditable='true'], [data-swipe-ignore='true']"
        )
    );
}

function canScrollableElementContinue(target: EventTarget | null, direction: SwipeDirection) {
    if (!(target instanceof Element) || (direction !== "up" && direction !== "down")) return false;

    const scrollable = target.closest<HTMLElement>("[data-swipe-scroll]");
    if (!scrollable) return false;

    const scrollTop = scrollable.scrollTop;
    const maxScrollTop = scrollable.scrollHeight - scrollable.clientHeight;

    if (maxScrollTop <= 0) return false;
    if (direction === "up") return scrollTop < maxScrollTop - 2;
    return scrollTop > 2;
}

export function useSwipeNavigation({
    enabled = true,
    targetRef,
    minDistance = defaultMinDistance,
    ignoreSelector,
    onSwipeUp,
    onSwipeDown,
    onSwipeLeft,
    onSwipeRight,
}: SwipeNavigationOptions) {
    const startRef = useRef<TouchStart | null>(null);

    useEffect(() => {
        if (!enabled) return;

        const target = targetRef?.current ?? window;

        const handleTouchStart = (domEvent: Event) => {
            const event = domEvent as TouchEvent;

            if (event.touches.length !== 1 || isIgnoredTarget(event.target, ignoreSelector)) {
                startRef.current = null;
                return;
            }

            const touch = event.touches[0];
            startRef.current = {
                x: touch.clientX,
                y: touch.clientY,
                target: event.target,
            };
        };

        const handleTouchEnd = (domEvent: Event) => {
            const event = domEvent as TouchEvent;
            const start = startRef.current;
            startRef.current = null;
            if (!start || event.changedTouches.length !== 1) return;

            const touch = event.changedTouches[0];
            const deltaX = touch.clientX - start.x;
            const deltaY = touch.clientY - start.y;
            const absX = Math.abs(deltaX);
            const absY = Math.abs(deltaY);

            if (Math.max(absX, absY) < minDistance) return;

            if (absX > absY * 1.25) {
                if (deltaX < 0) onSwipeLeft?.();
                else onSwipeRight?.();
                return;
            }

            if (absY > absX * 1.25) {
                const direction: SwipeDirection = deltaY < 0 ? "up" : "down";
                if (canScrollableElementContinue(start.target, direction)) return;

                if (direction === "up") onSwipeUp?.();
                else onSwipeDown?.();
            }
        };

        target.addEventListener("touchstart", handleTouchStart, { passive: true });
        target.addEventListener("touchend", handleTouchEnd, { passive: true });

        return () => {
            target.removeEventListener("touchstart", handleTouchStart);
            target.removeEventListener("touchend", handleTouchEnd);
        };
    }, [
        enabled,
        targetRef,
        minDistance,
        ignoreSelector,
        onSwipeUp,
        onSwipeDown,
        onSwipeLeft,
        onSwipeRight,
    ]);
}
