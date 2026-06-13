import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useUI } from "../context/UIContext";
import bgImg from "../assets/restraunt_2.png";
import roomImg from "../assets/artisanal_full_restraunt_pic.jpg";

type EventSection = {
    id: string;
    title: string;
    eyebrow: string;
    body: string;
};

const sections: EventSection[] = [
    {
        id: "gatherings",
        title: "Private Events",
        eyebrow: "Gather at Artisanal",
        body: "Intimate dinners, milestone celebrations, and polished corporate evenings shaped around seasonal cooking and careful service.",
    },
    {
        id: "details",
        title: "Plan the Evening",
        eyebrow: "Tailored service",
        body: "Our team can help coordinate menus, pacing, wine, and special requests for a dining room experience that feels considered from arrival to farewell.",
    },
];

const eventDetails = [
    "Private dining and partial buyouts",
    "Seasonal prix fixe menus",
    "Wine pairings and beverage service",
    "Celebrations, rehearsal dinners, and corporate gatherings",
];

const pageTheme = {
    bg: "#1b1412",
    primary: "#a68a7b",
    secondary: "#f5f0ed",
};

export default function PrivateEvents() {
    const { isSiteMapOpen, isMobile } = useUI();
    const [activeIndex, setActiveIndex] = useState(0);
    const activeIndexRef = useRef(activeIndex);
    const isNavigating = useRef(false);

    useEffect(() => {
        activeIndexRef.current = activeIndex;
    }, [activeIndex]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const navigateSection = useCallback((direction: "next" | "prev") => {
        if (isNavigating.current) return;

        const next = direction === "next" ? activeIndexRef.current + 1 : activeIndexRef.current - 1;
        if (next < 0 || next >= sections.length) return;

        isNavigating.current = true;
        setActiveIndex(next);

        window.setTimeout(() => {
            isNavigating.current = false;
        }, 900);
    }, []);

    useEffect(() => {
        const handleWheel = (event: WheelEvent) => {
            if (isSiteMapOpen) return;

            event.preventDefault();
            if (Math.abs(event.deltaY) < 30) return;

            navigateSection(event.deltaY > 0 ? "next" : "prev");
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (isSiteMapOpen) return;

            if (event.key === "ArrowDown" || event.key === "PageDown") {
                event.preventDefault();
                navigateSection("next");
            }

            if (event.key === "ArrowUp" || event.key === "PageUp") {
                event.preventDefault();
                navigateSection("prev");
            }
        };

        window.addEventListener("wheel", handleWheel, { passive: false });
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("wheel", handleWheel);
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isSiteMapOpen, navigateSection]);

    const themeStyles = {
        "--color-theme-primary": pageTheme.primary,
        "--color-theme-secondary": pageTheme.secondary,
        "--color-theme-bg": pageTheme.bg,
    } as CSSProperties;

    const contentVariants: Variants = {
        inactive: {
            opacity: 0,
            y: 28,
            filter: "blur(8px)",
            transition: { duration: 0.35, ease: "easeOut" },
        },
        active: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: { duration: 0.75, ease: [0.19, 1, 0.22, 1] },
        },
    };

    const currentSection = sections[activeIndex];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="h-[100svh] md:h-screen w-screen overflow-hidden flex flex-col relative selection:bg-[var(--color-theme-primary)] selection:text-[var(--color-theme-bg)]"
            style={themeStyles}
        >
            <div
                className="fixed inset-0 -z-30"
                style={{
                    background: `linear-gradient(135deg, ${pageTheme.bg} 0%, ${pageTheme.bg} 68%, #1a0f0f 100%)`,
                }}
            />
            <motion.img
                src={bgImg}
                alt=""
                aria-hidden="true"
                animate={{ scale: activeIndex === 0 ? 1.08 : 1.14, opacity: activeIndex === 0 ? 0.42 : 0.2 }}
                transition={{ duration: 1.1, ease: [0.19, 1, 0.22, 1] }}
                className="fixed inset-0 h-full w-full object-cover brightness-50 -z-20 pointer-events-none"
            />
            <div
                className="fixed inset-0 -z-10 pointer-events-none"
                style={{
                    background: "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, transparent 35%, var(--color-theme-bg) 100%)",
                }}
            />

            <div
                className={`relative transition-all duration-700 ease-out ${
                    activeIndex > 0 && !isSiteMapOpen
                        ? "opacity-0 pointer-events-none -translate-y-10 z-0"
                        : "opacity-100 pointer-events-auto translate-y-0 z-[1000]"
                }`}
            >
                <Navbar compactMobile />
            </div>

            <div className="flex-1 relative overflow-hidden">
                <div
                    className="h-full w-full transition-all duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)]"
                    style={{ transform: `translateY(-${activeIndex * 100}%)` }}
                >
                    <section
                        aria-labelledby="events-heading"
                        className="h-[100svh] md:h-full w-full flex items-center justify-center px-5 sm:px-8 md:px-32 pt-24 pb-36 md:py-0 relative overflow-hidden"
                    >
                        <motion.div
                            variants={contentVariants}
                            initial={false}
                            animate={activeIndex === 0 ? "active" : "inactive"}
                            className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-[0.78fr_1fr] gap-9 md:gap-16 items-center"
                        >
                            <div className="max-w-xl">
                                <p className="font-body text-[10px] sm:text-xs uppercase tracking-[0.32em] sm:tracking-[0.45em] text-[var(--color-theme-primary)] mb-5">
                                    {sections[0].eyebrow}
                                </p>
                                <h1
                                    id="events-heading"
                                    className="font-display text-5xl sm:text-6xl md:text-7xl text-white/95 italic tracking-wide leading-none mb-6"
                                >
                                    {sections[0].title}
                                </h1>
                                <p className="font-body text-xs sm:text-sm md:text-base text-[var(--color-theme-secondary)]/70 leading-relaxed font-light tracking-[0.08em] md:tracking-[0.1em] uppercase italic">
                                    {sections[0].body}
                                </p>
                            </div>

                            <div className="hidden md:block justify-self-end w-full max-w-sm overflow-hidden border border-white/8 bg-black/10">
                                <img
                                    src={roomImg}
                                    alt=""
                                    aria-hidden="true"
                                    className="aspect-[4/5] w-full object-cover brightness-75 transition-transform duration-700 hover:scale-105"
                                />
                            </div>
                        </motion.div>
                    </section>

                    <section
                        aria-labelledby="details-heading"
                        className="h-[100svh] md:h-full w-full flex items-center justify-center px-5 sm:px-8 md:px-32 pt-24 pb-36 md:py-0 relative overflow-hidden"
                    >
                        <motion.div
                            variants={contentVariants}
                            initial={false}
                            animate={activeIndex === 1 ? "active" : "inactive"}
                            className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-[0.78fr_1fr] gap-9 md:gap-16 items-center"
                        >
                            <div className="max-w-xl">
                                <p className="font-body text-[10px] sm:text-xs uppercase tracking-[0.32em] sm:tracking-[0.45em] text-[var(--color-theme-primary)] mb-5">
                                    {sections[1].eyebrow}
                                </p>
                                <h2
                                    id="details-heading"
                                    className="font-display text-4xl sm:text-5xl md:text-6xl text-white/95 italic tracking-wide leading-none mb-6"
                                >
                                    {sections[1].title}
                                </h2>
                                <p className="font-body text-xs sm:text-sm md:text-base text-[var(--color-theme-secondary)]/70 leading-relaxed font-light tracking-[0.08em] md:tracking-[0.1em] uppercase italic mb-8">
                                    {sections[1].body}
                                </p>

                                <motion.div whileHover={!isMobile ? { x: 6 } : undefined} whileTap={{ scale: 0.96 }}>
                                    <Link
                                        to="/contact"
                                        className="group inline-flex items-center gap-4 font-display text-xl italic tracking-wide text-[var(--color-theme-primary)] transition-colors duration-300 hover:text-white"
                                    >
                                        <span>Inquire About Events</span>
                                        <span className="h-px w-14 bg-current transition-all duration-300 group-hover:w-20" aria-hidden="true" />
                                    </Link>
                                </motion.div>
                            </div>

                            <div className="w-full md:justify-self-end">
                                <div className="grid grid-cols-1 gap-5 border-y border-white/10 py-7">
                                    {eventDetails.map((detail) => (
                                        <p
                                            key={detail}
                                            className="font-body text-[10px] sm:text-xs uppercase tracking-[0.24em] text-white/60"
                                        >
                                            {detail}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        <div className="absolute bottom-8 left-0 w-full z-20 pointer-events-auto">
                            <Footer embedded />
                        </div>
                    </section>
                </div>

                <div className="hidden md:flex absolute right-4 md:right-8 top-0 bottom-0 z-50 flex-col justify-between py-32 pointer-events-none">
                    <button
                        type="button"
                        onClick={() => navigateSection("prev")}
                        disabled={activeIndex === 0}
                        className="group flex items-start justify-center text-white/10 hover:text-white transition-all duration-700 disabled:opacity-0 cursor-pointer pointer-events-auto h-[30vh]"
                        aria-label="Previous private events section"
                    >
                        <svg viewBox="0 0 24 200" className="h-full w-8 md:w-10" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 200V4M12 4L5 11M12 4L19 11" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        onClick={() => navigateSection("next")}
                        disabled={activeIndex === sections.length - 1}
                        className="group flex items-end justify-center text-white/10 hover:text-white transition-all duration-700 disabled:opacity-0 cursor-pointer pointer-events-auto h-[30vh]"
                        aria-label="Next private events section"
                    >
                        <svg viewBox="0 0 24 200" className="h-full w-8 md:w-10" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 0V196M12 196L5 189M12 196L19 189" />
                        </svg>
                    </button>
                </div>

                <div className="md:hidden fixed left-4 right-4 bottom-17 z-50 flex items-center justify-between gap-3 pb-[env(safe-area-inset-bottom)] pointer-events-none">
                    <button
                        type="button"
                        onClick={() => navigateSection("prev")}
                        disabled={activeIndex === 0}
                        className="pointer-events-auto h-12 w-12 flex items-center justify-center rounded-full border border-white/15 bg-black/45 text-white/70 backdrop-blur-md disabled:opacity-25"
                        aria-label="Previous private events section"
                    >
                        <span className="text-2xl leading-none" aria-hidden="true">
                            ↑
                        </span>
                    </button>
                    <div className="pointer-events-auto min-w-0 flex-1 rounded-full border border-white/10 bg-black/45 px-4 py-3 text-center backdrop-blur-md">
                        <p className="truncate font-body text-[10px] uppercase tracking-[0.28em] text-white/55" aria-live="polite">
                            {currentSection.title}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => navigateSection("next")}
                        disabled={activeIndex === sections.length - 1}
                        className="pointer-events-auto h-12 w-12 flex items-center justify-center rounded-full border border-white/15 bg-black/45 text-white/70 backdrop-blur-md disabled:opacity-25"
                        aria-label="Next private events section"
                    >
                        <span className="text-2xl leading-none" aria-hidden="true">
                            ↓
                        </span>
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
