import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useUI } from "../context/UIContext";
import { useLenisScroll } from "../hooks/useLenisScroll";
import bgImg from "../assets/restraunt_2.png";
import roomImg from "../assets/artisanal_full_restraunt_pic.jpg";

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
    const { isMobile } = useUI();
    const pageRef = useRef<HTMLDivElement | null>(null);
    const contentRef = useRef<HTMLElement | null>(null);
    useLenisScroll({ wrapperRef: pageRef, contentRef });

    useEffect(() => {
        pageRef.current?.scrollTo({ top: 0, behavior: "auto" });
    }, []);

    const themeStyles = {
        "--color-theme-primary": pageTheme.primary,
        "--color-theme-secondary": pageTheme.secondary,
        "--color-theme-bg": pageTheme.bg,
    } as CSSProperties;

    return (
        <motion.div
            ref={pageRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="relative h-[100svh] w-screen overflow-x-hidden overflow-y-auto overscroll-contain selection:bg-[var(--color-theme-primary)] selection:text-[var(--color-theme-bg)]"
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
                initial={{ scale: 1.12, opacity: 0 }}
                animate={{ scale: 1.08, opacity: 0.34 }}
                transition={{ duration: 1.05, ease: [0.65, 0, 0.35, 1] }}
                className="pointer-events-none fixed inset-0 -z-20 h-full w-full object-cover brightness-50"
            />
            <div
                className="pointer-events-none fixed inset-0 -z-10"
                style={{
                    background: "linear-gradient(to bottom, rgba(0,0,0,0.22) 0%, transparent 35%, var(--color-theme-bg) 100%)",
                }}
            />

            <Navbar compactMobile />

            <main ref={contentRef} className="relative z-10">
                <section
                    aria-labelledby="events-heading"
                    className="flex min-h-[100svh] w-full items-center justify-center px-5 pb-20 pt-28 sm:px-8 sm:pb-24 sm:pt-32 lg:px-32 lg:py-32"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
                        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        viewport={{ amount: 0.35, once: true }}
                        transition={{ duration: 0.75, ease: [0.65, 0, 0.35, 1] }}
                        className="grid w-full max-w-6xl grid-cols-1 items-center gap-9 lg:grid-cols-[0.78fr_1fr] lg:gap-16"
                    >
                        <div className="max-w-xl">
                            <h1
                                id="events-heading"
                                className="mb-6 font-display text-5xl leading-none tracking-wide text-white/95 italic sm:text-6xl lg:text-7xl"
                            >
                                Private Events
                            </h1>
                            <p className="font-body text-xs font-light leading-relaxed tracking-[0.08em] text-[var(--color-theme-secondary)]/70 uppercase italic sm:text-sm md:text-base md:tracking-[0.1em]">
                                Intimate dinners, milestone celebrations, and polished corporate evenings shaped around seasonal cooking and careful service.
                            </p>
                        </div>

                        <div className="justify-self-end overflow-hidden border border-white/8 bg-black/10 max-lg:hidden lg:w-full lg:max-w-sm">
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
                    className="flex min-h-[100svh] w-full flex-col justify-between px-5 pb-0 pt-20 sm:px-8 sm:pt-24 lg:px-32 lg:pt-32"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
                        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        viewport={{ amount: 0.35, once: true }}
                        transition={{ duration: 0.75, ease: [0.65, 0, 0.35, 1] }}
                        className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 items-center gap-9 lg:grid-cols-[0.78fr_1fr] lg:gap-16"
                    >
                        <div className="max-w-xl">
                            <h2
                                id="details-heading"
                                className="mb-6 font-display text-4xl leading-none tracking-wide text-white/95 italic sm:text-5xl lg:text-6xl"
                            >
                                Plan the Evening
                            </h2>
                            <p className="mb-8 font-body text-xs font-light leading-relaxed tracking-[0.08em] text-[var(--color-theme-secondary)]/70 uppercase italic sm:text-sm md:text-base md:tracking-[0.1em]">
                                Our team can help coordinate menus, pacing, wine, and special requests for a dining room experience that feels considered from arrival to farewell.
                            </p>

                            <motion.div whileHover={!isMobile ? { x: 6 } : undefined} whileTap={{ scale: 0.96 }}>
                                <Link
                                    to="/contact"
                                    className="group inline-flex items-center gap-4 font-display text-xl tracking-wide text-[var(--color-theme-primary)] transition-colors duration-300 hover:text-white italic"
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
                                        className="font-body text-[10px] tracking-[0.24em] text-white/60 uppercase sm:text-xs"
                                    >
                                        {detail}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    <div className="relative z-20 mt-16 w-full shrink-0">
                        <Footer embedded />
                    </div>
                </section>
            </main>
        </motion.div>
    );
}
