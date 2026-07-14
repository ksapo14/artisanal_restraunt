import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useLenisScroll } from "../hooks/useLenisScroll";
import "../index.css";
import bgImg1 from '../assets/artisanal_full_restraunt_pic.jpg';
import bgImg2 from '../assets/restraunt_2.png';
import bgImg3 from '../assets/restraunt_3.png';
import logoFull from '../assets/artisanal_logo_high_res(2)_txtwhite.jpeg';
import logoColor from '../assets/artisanal_logo_high_res(2).jpeg';

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
    const bgImages = [bgImg1, bgImg2, bgImg3];
    const [bgIndex, setBgIndex] = useState(0);
    const [heroImageReady, setHeroImageReady] = useState(false);
    const [minimumLoadTimeElapsed, setMinimumLoadTimeElapsed] = useState(false);
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const reduceMotion = useReducedMotion();

    const currentTheme = themes[bgIndex];
    const loading = !heroImageReady || !minimumLoadTimeElapsed;
    useLenisScroll({ wrapperRef: scrollRef, contentRef });

    useEffect(() => {
        window.scrollTo(0, 0);

        const minimumLoadTimeout = window.setTimeout(() => {
            setMinimumLoadTimeElapsed(true);
        }, reduceMotion ? 200 : 1350);

        const autoSwitchInterval = setInterval(() => {
            setBgIndex((prev) => (prev === bgImages.length - 1 ? 0 : prev + 1));
        }, 10000);

        return () => {
            clearTimeout(minimumLoadTimeout);
            clearInterval(autoSwitchInterval);
        };
    }, [bgImages.length, reduceMotion]);

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
            className="h-[100svh] md:h-[100dvh] w-screen overflow-hidden flex flex-col relative"
            style={themeStyles}
        >
            <div className="fixed inset-0 -z-10 bg-[var(--color-theme-bg)] transition-colors duration-1000" />

            <AnimatePresence>
                {loading && (
                    <motion.div
                        key="home-loader"
                        initial={{ opacity: 1, clipPath: "inset(0% 0% 0% 0%)" }}
                        animate={{ opacity: 1, clipPath: "inset(0% 0% 0% 0%)" }}
                        exit={reduceMotion
                            ? { opacity: 0 }
                            : { clipPath: "inset(0% 0% 100% 0%)" }}
                        transition={{
                            duration: reduceMotion ? 0.18 : 1.05,
                            ease: reduceMotion ? "easeOut" : [0.76, 0, 0.24, 1],
                        }}
                        role="status"
                        aria-label="Loading Artisanal"
                        className="fixed inset-0 z-[3000] overflow-hidden bg-[#ffe6ac]"
                    >
                        <motion.div
                            aria-hidden="true"
                            className="relative flex h-full w-full flex-col items-center justify-center px-4 text-center"
                        >
                            <motion.div
                                initial={reduceMotion ? false : { clipPath: "inset(0% 100% 0% 0%)" }}
                                animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                                transition={{ duration: reduceMotion ? 0.12 : 0.95, delay: reduceMotion ? 0 : 0.12, ease: [0.76, 0, 0.24, 1] }}
                                className="w-[82vw] max-w-3xl"
                            >
                                <motion.img
                                    src={logoColor}
                                    className="h-auto w-full object-contain"
                                    alt=""
                                    initial={reduceMotion ? false : { x: "-4%", scale: 1.02 }}
                                    animate={{ x: "0%", scale: 1 }}
                                    transition={{ duration: reduceMotion ? 0.12 : 1.05, delay: reduceMotion ? 0 : 0.12, ease: [0.16, 1, 0.3, 1] }}
                                />
                            </motion.div>

                            <motion.p
                                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                                animate={{ opacity: 0.72, y: 0 }}
                                transition={{ duration: reduceMotion ? 0.12 : 0.55, delay: reduceMotion ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }}
                                className="mt-8 font-body text-[10px] uppercase leading-none tracking-[0.32em] text-[#33230f] sm:text-xs lg:text-xl"
                            >
                                Banner Elk - North Carolina
                            </motion.p>

                            <div className="mt-6 h-px w-20 overflow-hidden bg-[#a07830]/25 sm:w-24">
                                <motion.div
                                    initial={reduceMotion ? false : { scaleX: 0 }}
                                    animate={{ scaleX: heroImageReady ? 1 : 0.72 }}
                                    transition={{ duration: reduceMotion ? 0 : 0.9, ease: [0.76, 0, 0.24, 1] }}
                                    className="h-full w-full origin-left bg-[#a07830]"
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                initial={false}
                animate={{ scale: reduceMotion ? 1 : loading ? 1.035 : 1 }}
                transition={{ duration: reduceMotion ? 0 : 1.35, ease: [0.16, 1, 0.3, 1] }}
                className="pointer-events-none fixed inset-0 -z-[4]"
            >
                {bgImages.map((src, index) => (
                    <img
                        key={src}
                        src={src}
                        alt=""
                        onLoad={index === 0 ? () => setHeroImageReady(true) : undefined}
                        onError={index === 0 ? () => setHeroImageReady(true) : undefined}
                        className={`absolute inset-0 h-full w-full scale-110 object-cover brightness-50 transition-opacity duration-1000 md:scale-130 ${
                            index === bgIndex ? "opacity-100" : "opacity-0"
                        }`}
                    />
                ))}
            </motion.div>

            <div
                className="fixed top-0 left-0 w-full h-[100dvh] -z-[4] pointer-events-none transition-all duration-1000"
                style={{
                    background: "linear-gradient(to bottom, transparent 65%, var(--color-theme-bg) 100%)",
                }}
            />

            <Navbar compactMobile />

            <div className="flex-1 relative overflow-hidden">
                <div ref={scrollRef} className="h-full w-full flex justify-center items-center relative px-4 lg:px-8 pt-20 pb-36 lg:py-0 overflow-y-auto lg:overflow-hidden">
                    <motion.div
                        ref={contentRef}
                        initial={false}
                        animate={{
                            opacity: 1,
                            y: loading ? 10 : 0,
                            scale: loading ? 0.985 : 1,
                        }}
                        transition={{ duration: reduceMotion ? 0.18 : 1.15, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col items-center justify-center text-center"
                    >
                        <img
                            src={logoFull}
                            className="h-auto w-[82vw] max-w-3xl object-contain drop-shadow-[0_18px_45px_rgba(0,0,0,0.55)]"
                            alt="Artisanal"
                        />
                        <p className="mt-8 font-body text-[10px] uppercase leading-none tracking-[0.32em] text-[var(--color-theme-secondary)] sm:text-xs lg:text-xl">
                            Banner Elk - North Carolina
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full z-20 pb-[env(safe-area-inset-bottom)]">
                <Footer />
            </div>
        </motion.div>
    );
}
