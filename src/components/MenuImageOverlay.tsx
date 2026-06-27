import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { fetchMenuPages } from "../api/menuAssetService";
import { MENU_CATEGORIES, type MenuCategoryId, type MenuPage } from "../lib/menuAssets";

type ImageState = "loading" | "loaded" | "error";

type MenuImageOverlayProps = {
    categoryId: MenuCategoryId;
    onClose: () => void;
};

export default function MenuImageOverlay({
    categoryId,
    onClose,
}: MenuImageOverlayProps) {
    const category = MENU_CATEGORIES[categoryId];
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const [pages, setPages] = useState<MenuPage[] | null>(null);
    const [imageStates, setImageStates] = useState<Record<string, ImageState>>({});

    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        closeButtonRef.current?.focus();

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    useEffect(() => {
        let cancelled = false;

        fetchMenuPages(categoryId)
            .then((nextPages) => {
                if (cancelled) return;
                setPages(nextPages);
                setImageStates(Object.fromEntries(nextPages.map((page) => [page.url, "loading"])));
            })
            .catch(() => {
                if (!cancelled) setPages([]);
            });

        return () => {
            cancelled = true;
        };
    }, [categoryId]);

    const visibleCount = pages?.filter((page) => imageStates[page.url] !== "error").length ?? 0;
    const allFinished = pages !== null && pages.every((page) => imageStates[page.url] !== "loading");

    return createPortal(
        <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="menu-overlay-title"
            data-local-horizontal-swipe
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-[2500] overflow-y-auto bg-[#100d08]/98 text-white"
            onClick={onClose}
        >
            <div className="min-h-full">
                <header
                    className="sticky top-0 z-20 border-b border-white/10 bg-[#100d08]/95 px-5 py-4 backdrop-blur-md sm:px-8"
                    onClick={(event) => event.stopPropagation()}
                >
                    <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-6">
                        <div className="min-w-0">
                            <p className="font-body text-[9px] uppercase tracking-[0.32em] text-[#dac464] sm:text-[10px]">
                                {category.eyebrow}
                            </p>
                            <h2
                                id="menu-overlay-title"
                                className="truncate font-display text-2xl leading-tight text-white sm:text-3xl"
                            >
                                {category.title}
                            </h2>
                        </div>
                        <button
                            ref={closeButtonRef}
                            type="button"
                            onClick={onClose}
                            className="shrink-0 cursor-pointer border-b border-[#dac464]/60 pb-1 font-body text-[10px] uppercase tracking-[0.24em] text-white transition-colors hover:text-[#dac464] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#dac464]"
                        >
                            Close
                        </button>
                    </div>
                </header>

                <main
                    className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-3 py-6 sm:gap-10 sm:px-8 sm:py-10"
                    onClick={(event) => event.stopPropagation()}
                >
                    {pages === null ? (
                        <MenuLoading />
                    ) : pages.length === 0 ? (
                        <MenuUnavailable />
                    ) : (
                        pages.map((page) => {
                            const state = imageStates[page.url] ?? "loading";
                            if (state === "error") return null;

                            return (
                                <figure
                                    key={page.url}
                                    className="relative min-h-64 w-full overflow-hidden bg-white/5"
                                >
                                    {state === "loading" && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="font-body text-[10px] uppercase tracking-[0.3em] text-white/45">
                                                Loading page {page.pageNumber}
                                            </span>
                                        </div>
                                    )}
                                    <img
                                        src={page.url}
                                        alt={`${category.title}, page ${page.pageNumber}`}
                                        loading={page.pageNumber === 1 ? "eager" : "lazy"}
                                        decoding="async"
                                        onLoad={() => {
                                            setImageStates((current) => ({ ...current, [page.url]: "loaded" }));
                                        }}
                                        onError={() => {
                                            setImageStates((current) => ({ ...current, [page.url]: "error" }));
                                        }}
                                        className={`h-auto w-full bg-white object-contain transition-opacity duration-500 ${
                                            state === "loaded" ? "opacity-100" : "opacity-0"
                                        }`}
                                    />
                                </figure>
                            );
                        })
                    )}

                    {pages && pages.length > 0 && allFinished && visibleCount === 0 && <MenuUnavailable />}
                </main>
            </div>
        </motion.div>,
        document.body,
    );
}

function MenuLoading() {
    return (
        <div className="flex min-h-[55svh] items-center justify-center px-6 text-center">
            <p className="font-body text-[10px] uppercase tracking-[0.3em] text-white/45">
                Loading menu
            </p>
        </div>
    );
}

function MenuUnavailable() {
    return (
        <div className="flex min-h-[55svh] items-center justify-center px-6 text-center">
            <div>
                <p className="font-display text-3xl italic text-white/90 sm:text-4xl">
                    Menu temporarily unavailable
                </p>
                <p className="mt-3 font-body text-xs uppercase tracking-[0.18em] text-white/45">
                    Please check back shortly.
                </p>
            </div>
        </div>
    );
}
