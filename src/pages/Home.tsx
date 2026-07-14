import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useLenisScroll } from "../hooks/useLenisScroll";
import "../index.css";
import bgImg1 from '../assets/artisanal_full_restraunt_pic.jpg';
import bgImg2 from '../assets/restraunt_2.png';
import bgImg3 from '../assets/restraunt_3.png';
import logoFull from '../assets/artisanal_logo_high_res(2)_txtwhite.jpeg';
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
        secondary: "#f5f0ed",
        bg: "#1a0f0f",
        link: "#e5baba",
        arrow: "rgba(219, 162, 162, 0.6)",
    },
];

export default function Home() {
    const bgImages = [bgImg1, bgImg2, bgImg3];
    const [bgIndex, setBgIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [sliding, setSliding] = useState(false);
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);

    const currentTheme = themes[bgIndex];
    useLenisScroll({ wrapperRef: scrollRef, contentRef });

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
            className="h-[100svh] md:h-screen w-screen overflow-hidden flex flex-col relative"
            style={themeStyles}
        >
            <div className="fixed inset-0 -z-10 bg-[var(--color-theme-bg)] transition-colors duration-1000" />

            {loading && (
                <div
                    className={`fixed inset-0 z-[3000] flex justify-center items-center bg-[#ffe6ac] transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] ${
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
                <div ref={scrollRef} className="h-full w-full flex justify-center items-center relative px-4 lg:px-8 pt-20 pb-36 lg:py-0 overflow-y-auto lg:overflow-hidden">
                    <motion.div
                        ref={contentRef}
                        initial={{ opacity: 0, y: 16, scale: 0.985, filter: "blur(4px)" }}
                        animate={{
                            opacity: loading ? 0 : 1,
                            y: loading ? 16 : 0,
                            scale: loading ? 0.985 : 1,
                            filter: loading ? "blur(4px)" : "blur(0px)",
                        }}
                        transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
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
