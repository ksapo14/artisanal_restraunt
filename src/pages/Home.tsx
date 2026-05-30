import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import LinkBar from "../components/LinkBar";
import Navbar from "../components/Navbar";
import "../index.css";
import Footer from "../components/Footer";
import bgImg1 from '../assets/artisanal_full_restraunt_pic.jpg';
import bgImg2 from '../assets/restraunt_2.png';
import bgImg3 from '../assets/restraunt_3.png';
import logoNoBg from '../assets/artisanal_logo_high_res_nobg.jpeg';

const themes = [
    {
        primary: "#dac464",
        secondary: "#ffe6ac",
        bg: "#1c170a",
        link: "#ffe6ac",
        arrow: "rgba(255, 230, 172, 0.5)",
    },
    {
        primary: "#a68a7b",
        secondary: "#f5f0ed",
        bg: "#1b1412",
        link: "#d7ccc8",
        arrow: "rgba(215, 204, 200, 0.6)",
    },
    {
        primary: "#d48888",
        secondary: "rgba(238, 192, 192, 1)",
        bg: "#1a0f0f",
        link: "#e5baba",
        arrow: "rgba(219, 162, 162, 0.6)",
    },
];

const FOOTER_SPLIT = 40;
const MAX_SECTION_INDEX = 1;

export default function Home() {
    const bgImages = [bgImg1, bgImg2, bgImg3];
    const [bgIndex, setBgIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [sliding, setSliding] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const isNavigating = useRef(false);
    const activeIndexRef = useRef(activeIndex);
    const isFooter = activeIndex === MAX_SECTION_INDEX;

    useEffect(() => {
        activeIndexRef.current = activeIndex;
    }, [activeIndex]);

    const navigateSection = useCallback(
        (direction: "next" | "prev") => {
            if (isNavigating.current || loading) return;

            const prev = activeIndexRef.current;
            const next = direction === "next" ? prev + 1 : prev - 1;
            if (next < 0 || next > MAX_SECTION_INDEX) return;

            isNavigating.current = true;
            window.setTimeout(() => {
                isNavigating.current = false;
            }, 1000);

            setActiveIndex(next);
        },
        [loading]
    );

    const nextSection = () => navigateSection("next");
    const prevSection = () => navigateSection("prev");

    useEffect(() => {
        window.scrollTo(0, 0);

        const slideTimeout = setTimeout(() => {
            setSliding(true);
        }, 1500);

        const removeTimeout = setTimeout(() => {
            setLoading(false);
        }, 2000);

        const autoSwitchInterval = setInterval(() => {
            setBgIndex((prev) => (prev === bgImages.length - 1 ? 0 : prev + 1));
        }, 10000);

        return () => {
            clearTimeout(slideTimeout);
            clearTimeout(removeTimeout);
            clearInterval(autoSwitchInterval);
        };
    }, [bgImages.length]);

    useEffect(() => {
        if (loading) return;

        const onWheel = (e: WheelEvent) => {
            e.preventDefault();
            if (Math.abs(e.deltaY) < 30) return;
            if (e.deltaY > 0) navigateSection("next");
            else navigateSection("prev");
        };

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowDown" || e.key === "PageDown") {
                e.preventDefault();
                navigateSection("next");
            } else if (e.key === "ArrowUp" || e.key === "PageUp") {
                e.preventDefault();
                navigateSection("prev");
            }
        };

        window.addEventListener("wheel", onWheel, { passive: false });
        window.addEventListener("keydown", onKeyDown);

        return () => {
            window.removeEventListener("wheel", onWheel);
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [navigateSection, loading]);

    const handlePrevBg = () => {
        setBgIndex((prev) => (prev === 0 ? bgImages.length - 1 : prev - 1));
    };

    const handleNextBg = () => {
        setBgIndex((prev) => (prev === bgImages.length - 1 ? 0 : prev + 1));
    };

    const currentTheme = themes[bgIndex];

    const themeStyles = {
        '--color-theme-primary': currentTheme.primary,
        '--color-theme-secondary': currentTheme.secondary,
        '--color-theme-bg': currentTheme.bg,
        '--color-theme-link': currentTheme.link,
        '--color-theme-arrow': currentTheme.arrow,
    } as React.CSSProperties;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="h-screen w-screen overflow-hidden flex flex-col relative"
            style={themeStyles}
        >
            <div className="fixed inset-0 -z-10 bg-[var(--color-theme-bg)] transition-colors duration-1000" />

            {loading && (
                <div
                    className={`fixed inset-0 z-[200] flex justify-center items-center bg-[#ffe6ac] transition-transform duration-500 ${
                        sliding ? "-translate-y-full" : "translate-y-0"
                    }`}
                >
                    <div className="relative flex items-center justify-center">
                        <svg className="absolute" width="380" height="380" viewBox="0 0 380 380">
                            <rect x="2" y="2" width="376" height="376" fill="none" stroke="#e5c97a" strokeWidth="3" />
                            <rect
                                x="2"
                                y="2"
                                width="376"
                                height="376"
                                fill="none"
                                stroke="#a07830"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeDasharray="1504"
                                strokeDashoffset="1504"
                                style={{ animation: "fillCircle 1.4s ease-out forwards" }}
                            />
                        </svg>
                        <img src={logoNoBg} className="h-80 w-80 object-contain" alt="" />
                    </div>
                </div>
            )}

            {bgImages.map((src, index) => (
                <img
                    key={src}
                    src={src}
                    alt=""
                    className={`fixed w-screen scale-130 top-0 -z-[4] brightness-50 transition-all duration-1000 pointer-events-none ${
                        index === bgIndex ? "opacity-100" : "opacity-0"
                    }`}
                />
            ))}

            <div
                className="fixed top-0 left-0 w-full h-screen -z-[4] pointer-events-none transition-all duration-1000"
                style={{
                    background: "linear-gradient(to bottom, transparent 65%, var(--color-theme-bg) 100%)",
                }}
            />

            <div
                className={`transition-all duration-700 ${
                    activeIndex > 0 ? "opacity-0 pointer-events-none -translate-y-10" : "opacity-100"
                }`}
            >
                <Navbar />
            </div>

            <div className="flex-1 relative overflow-hidden">
                <div
                    className="h-full w-full transition-all duration-1000 ease-[cubic-bezier(0.19, 1, 0.22, 1)]"
                    style={{ transform: `translateY(-${isFooter ? FOOTER_SPLIT : activeIndex * 100}%)` }}
                >
                    {/* Main hero */}
                    <div className="h-full w-full flex justify-center items-center relative">
                        <div className="flex items-center justify-between w-full px-4 md:px-8">
                            <button
                                type="button"
                                onClick={handlePrevBg}
                                aria-label="Previous background"
                                className="group flex items-center justify-center text-[var(--color-theme-arrow)] hover:text-[var(--color-theme-primary)] transition-all duration-300 hover:scale-115 cursor-pointer"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 80 24"
                                    strokeWidth="2"
                                    stroke="currentColor"
                                    className="w-20 h-8"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M76 12H4M4 12L11 5M4 12L11 19" />
                                </svg>
                            </button>

                            <div className="flex-1 flex justify-center">
                                <LinkBar />
                            </div>

                            <button
                                type="button"
                                onClick={handleNextBg}
                                aria-label="Next background"
                                className="group flex items-center justify-center text-[var(--color-theme-arrow)] hover:text-[var(--color-theme-primary)] transition-all duration-300 hover:scale-115 cursor-pointer"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 80 24"
                                    strokeWidth="2"
                                    stroke="currentColor"
                                    className="w-20 h-8"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 12H76M76 12L69 5M76 12L69 19" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Footer — bottom half when scrolled */}
                    <div className="h-[50vh] w-full shrink-0 overflow-hidden">
                        <Footer embedded />
                    </div>
                </div>

                {/* Section navigation — scroll / arrow keys / buttons */}
                <div className="absolute right-4 md:right-8 top-0 bottom-0 z-50 flex flex-col justify-between py-32 pointer-events-none">
                    <button
                        type="button"
                        onClick={prevSection}
                        disabled={activeIndex === 0}
                        aria-label="Previous section"
                        className="group flex items-start justify-center text-white/10 hover:text-white transition-all duration-700 disabled:opacity-0 cursor-pointer pointer-events-auto h-[30vh]"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 200"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="h-full w-8 md:w-10"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 200V4M12 4L5 11M12 4L19 11" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        onClick={nextSection}
                        disabled={isFooter}
                        aria-label="Next section"
                        className="group flex items-end justify-center text-white/10 hover:text-white transition-all duration-700 disabled:opacity-0 cursor-pointer pointer-events-auto h-[30vh]"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 200"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="h-full w-8 md:w-10"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 0V196M12 196L5 189M12 196L19 189" />
                        </svg>
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
