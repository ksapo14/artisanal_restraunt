import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import LinkBar from "../components/LinkBar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../index.css";
import bgImg1 from '../assets/artisanal_full_restraunt_pic.jpg';
import bgImg2 from '../assets/restraunt_2.png';
import bgImg3 from '../assets/restraunt_3.png';
import logoNoBg from '../assets/artisanal_logo_high_res_nobg.jpeg';
import { useUI } from "../context/UIContext";
import { useSwipeNavigation } from "../hooks/useSwipeNavigation";

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
        secondary: "#f5f0ed",
        bg: "#1a0f0f",
        link: "#e5baba",
        arrow: "rgba(219, 162, 162, 0.6)",
    },
];

export default function Home() {
    const { isMobile } = useUI();
    const bgImages = [bgImg1, bgImg2, bgImg3];
    const pageRef = useRef<HTMLDivElement | null>(null);
    const [bgIndex, setBgIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [sliding, setSliding] = useState(false);

    const currentTheme = themes[bgIndex];

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

    const handlePrevBg = useCallback(() => {
        setBgIndex((prev) => (prev === 0 ? bgImages.length - 1 : prev - 1));
    }, [bgImages.length]);

    const handleNextBg = useCallback(() => {
        setBgIndex((prev) => (prev === bgImages.length - 1 ? 0 : prev + 1));
    }, [bgImages.length]);

    useSwipeNavigation({
        targetRef: pageRef,
        onSwipeLeft: handleNextBg,
        onSwipeRight: handlePrevBg,
    });

    const themeStyles = {
        '--color-theme-primary': currentTheme.primary,
        '--color-theme-secondary': currentTheme.secondary,
        '--color-theme-bg': currentTheme.bg,
        '--color-theme-link': currentTheme.link,
        '--color-theme-arrow': currentTheme.arrow,
    } as React.CSSProperties;

    return (
        <motion.div
            ref={pageRef}
            data-local-horizontal-swipe
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="h-[100svh] md:h-screen w-screen overflow-hidden flex flex-col relative"
            style={themeStyles}
        >
            <div className="fixed inset-0 -z-10 bg-[var(--color-theme-bg)] transition-colors duration-1000" />

            {loading && (
                <div
                    className={`fixed inset-0 z-[3000] flex justify-center items-center bg-[#ffe6ac] transition-transform duration-500 ${
                        sliding ? "-translate-y-full" : "translate-y-0"
                    }`}
                >
                    <div className="relative flex items-center justify-center">
                        <svg className="absolute w-64 h-64 sm:w-72 sm:h-72 lg:w-[380px] lg:h-[380px]" viewBox="0 0 380 380">
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
                        <img src={logoNoBg} className="h-52 w-52 sm:h-60 sm:w-60 lg:h-80 lg:w-80 object-contain" alt="" />
                    </div>
                </div>
            )}

            {bgImages.map((src, index) => (
                <img
                    key={src}
                    src={src}
                    alt=""
                    className={`fixed inset-0 h-screen w-screen object-cover scale-110 md:scale-130 -z-[4] brightness-50 transition-all duration-1000 pointer-events-none ${
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

            <Navbar compactMobile />

            <div className="flex-1 relative overflow-hidden">
                <div className="h-full w-full flex justify-center items-center relative px-4 lg:px-8 pt-20 pb-36 lg:py-0 overflow-y-auto lg:overflow-hidden">
                    <motion.button
                        type="button"
                        onClick={handlePrevBg}
                        aria-label="Previous background"
                        whileHover={!isMobile ? { scale: 1.15 } : undefined}
                        whileTap={{ scale: 0.85 }}
                        style={{ y: "-50%" }}
                        className={`group absolute left-3 top-1/2 sm:left-5 lg:left-8 z-10 flex h-14 w-14 lg:h-auto lg:w-auto items-center justify-center text-[var(--color-theme-arrow)] hover:text-[var(--color-theme-primary)] transition-all duration-300 cursor-pointer ${!isMobile ? 'hover:scale-115' : ''}`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 80 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            className="w-10 h-6 lg:w-20 lg:h-8"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M76 12H4M4 12L11 5M4 12L11 19" />
                        </svg>
                    </motion.button>

                    <LinkBar />

                    <motion.button
                        type="button"
                        onClick={handleNextBg}
                        aria-label="Next background"
                        whileHover={!isMobile ? { scale: 1.15 } : undefined}
                        whileTap={{ scale: 0.85 }}
                        style={{ y: "-50%" }}
                        className={`group absolute right-3 top-1/2 sm:right-5 lg:right-8 z-10 flex h-14 w-14 lg:h-auto lg:w-auto items-center justify-center text-[var(--color-theme-arrow)] hover:text-[var(--color-theme-primary)] transition-all duration-300 cursor-pointer ${!isMobile ? 'hover:scale-115' : ''}`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 80 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            className="w-10 h-6 lg:w-20 lg:h-8"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 12H76M76 12L69 5M76 12L69 19" />
                        </svg>
                    </motion.button>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full z-20 pb-[env(safe-area-inset-bottom)]">
                <Footer />
            </div>
        </motion.div>
    );
}
